import { useState, useRef, useEffect, useCallback } from 'react';
import {
    fetchAiModels, sendAgentMessage, buildDistribution, buildMartDraft, discardMartDraft,
    fetchAiConversations, saveAiConversation, deleteAiConversation, setActiveAiConversation,
    fetchLlmConnection, saveLlmConnection,
} from '../api';
import { martBranchName, buildStreamSummary, filesForStream, listStreamsFromFiles } from '../../../shared/etlTemplates';

/* ── Markdown-lite renderer ─────────────────────────────────────────── */
// Ответы агента приходят в markdown; полноценный рендерер не тянем —
// поддерживаем то, что агент реально использует: **жирный**, `код`,
// таблицы |…|, маркированные списки и заголовки.
function mdInline(s, keyBase) {
    const out = [];
    const re = /(`[^`]+`|\*\*[^*]+\*\*)/g;
    let last = 0, m, k = 0;
    while ((m = re.exec(s))) {
        if (m.index > last) out.push(s.slice(last, m.index));
        const t = m[0];
        if (t.startsWith('`')) out.push(<code key={`${keyBase}c${k++}`}>{t.slice(1, -1)}</code>);
        else out.push(<strong key={`${keyBase}b${k++}`}>{t.slice(2, -2)}</strong>);
        last = re.lastIndex;
    }
    if (last < s.length) out.push(s.slice(last));
    return out;
}

function mdSplitRow(line) {
    return line.trim().replace(/^\|/, '').replace(/\|+\s*$/, '').split('|').map(c => c.trim());
}

function MarkdownLite({ text }) {
    const lines = (text || '').split('\n');
    const blocks = [];
    let i = 0, key = 0;
    const isTableRow = l => /^\s*\|.*\|\s*$/.test(l);
    const isTableSep = l => /^\s*\|(\s*:?-{2,}:?\s*\|)+\s*$/.test(l);

    while (i < lines.length) {
        const line = lines[i];

        if (isTableRow(line) && i + 1 < lines.length && isTableSep(lines[i + 1])) {
            const header = mdSplitRow(line);
            i += 2;
            const rows = [];
            while (i < lines.length && isTableRow(lines[i])) { rows.push(mdSplitRow(lines[i])); i++; }
            blocks.push(
                <div className="ai-md-table-wrap" key={key++}>
                    <table className="ai-md-table">
                        <thead><tr>{header.map((h, hi) => <th key={hi}>{mdInline(h, `h${key}${hi}`)}</th>)}</tr></thead>
                        <tbody>
                            {rows.map((r, ri) => (
                                <tr key={ri}>{r.map((c, ci) => <td key={ci}>{mdInline(c, `t${key}${ri}${ci}`)}</td>)}</tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
            continue;
        }

        if (/^\s*[-*•]\s+/.test(line)) {
            const items = [];
            while (i < lines.length && /^\s*[-*•]\s+/.test(lines[i])) {
                items.push(lines[i].replace(/^\s*[-*•]\s+/, ''));
                i++;
            }
            blocks.push(
                <ul className="ai-md-list" key={key++}>
                    {items.map((it, ii) => <li key={ii}>{mdInline(it, `l${key}${ii}`)}</li>)}
                </ul>
            );
            continue;
        }

        if (line.trim() === '' || line.trim() === '---') { i++; continue; }

        const headM = line.match(/^\s*#{1,4}\s+(.*)$/);
        if (headM) {
            blocks.push(<div className="ai-md-head" key={key++}>{mdInline(headM[1], `hd${key}`)}</div>);
            i++;
            continue;
        }

        const para = [line];
        i++;
        while (i < lines.length && lines[i].trim() !== '' && !isTableRow(lines[i]) && !/^\s*[-*•#]/.test(lines[i])) {
            para.push(lines[i]);
            i++;
        }
        blocks.push(<p className="ai-md-p" key={key++}>{mdInline(para.join(' '), `p${key}`)}</p>);
    }
    return <>{blocks}</>;
}

const FALLBACK_MODEL = { id: 'b2c-sql-agent', name: 'B2C-SQL Agent', sub: 'Сборка витрин · OpenClaw', icon: 'fa-database', accent: '#e67e22', capability: 'b2c-mart' };
const DIST_PROMPT = 'Выберите SQL-окна для дистрибутива витрины. Отметьте нужные мышкой (зажмите Ctrl, чтобы выбрать несколько) или впишите их имена вручную ниже.';

/* ── PostgreSQL-backed dialog history (per datamart) ────────────────── */
function safeMessages(messages) {
    return (messages || []).map(message => {
        if (!message.project) return message;
        const { draftId, summary, expiresAt, mart } = message.project;
        return { ...message, project: { draftId, summary, expiresAt, mart } };
    });
}
// Mart built inside a conversation (for the history list badge).
function convMart(c) {
    const msgs = c?.messages || [];
    for (let i = msgs.length - 1; i >= 0; i--) {
        if (msgs[i]?.project?.mart) return msgs[i].project.mart;
        const names = msgs[i]?.project?.summary?.tableNames;
        if (names?.length) return names.length === 1 ? names[0] : `${names.length} таблицы`;
    }
    return null;
}
function relTime(ts) {
    const mins = Math.floor((Date.now() - ts) / 60000);
    if (mins < 1) return 'только что';
    if (mins < 60) return `${mins} мин назад`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} ч назад`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days} дн назад`;
    return new Date(ts).toLocaleDateString('ru-RU');
}

/* ── Custom model dropdown ──────────────────────────────────────────── */
function ModelSelector({ models, value, onChange }) {
    const [open, setOpen] = useState(false);
    const wrapRef = useRef(null);
    const current = models.find(m => m.id === value) || models[0] || FALLBACK_MODEL;

    useEffect(() => {
        if (!open) return;
        function onOutside(e) { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); }
        document.addEventListener('mousedown', onOutside);
        return () => document.removeEventListener('mousedown', onOutside);
    }, [open]);

    return (
        <div className="ai-model" ref={wrapRef}>
            <button
                type="button"
                className={`ai-model-trigger${open ? ' open' : ''}`}
                onClick={() => setOpen(o => !o)}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className="ai-model-dot" style={{ background: current.accent }} />
                <i className={`fas ${current.icon}`} style={{ color: current.accent }} />
                <span className="ai-model-name">{current.name}</span>
                <i className="fas fa-chevron-down ai-model-caret" />
            </button>

            {open && (
                <div className="ai-model-menu" role="listbox">
                    {models.map(m => (
                        <button
                            key={m.id}
                            type="button"
                            role="option"
                            aria-selected={m.id === current.id}
                            className={`ai-model-opt${m.id === current.id ? ' active' : ''}`}
                            onClick={() => { onChange(m.id); setOpen(false); }}
                        >
                            <span className="ai-model-opt-icon" style={{ background: `${m.accent}22`, color: m.accent }}>
                                <i className={`fas ${m.icon}`} />
                            </span>
                            <span className="ai-model-opt-text">
                                <span className="ai-model-opt-name">{m.name}</span>
                                <span className="ai-model-opt-sub">{m.sub}</span>
                            </span>
                            {m.id === current.id && <i className="fas fa-check ai-model-opt-check" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ── SQL code block with copy / insert actions ──────────────────────── */
function SqlBlock({ sql, onInsert }) {
    const [copied, setCopied] = useState(false);
    const [inserted, setInserted] = useState(false);

    function copy() {
        navigator.clipboard?.writeText(sql).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
    }
    function insert() {
        onInsert?.(sql);
        setInserted(true);
        setTimeout(() => setInserted(false), 1600);
    }

    return (
        <div className="ai-code">
            <div className="ai-code-bar">
                <span className="ai-code-lang"><span className="ai-code-dot" /> sql</span>
                <div className="ai-code-actions">
                    <button type="button" onClick={copy} title="Скопировать" aria-label="Скопировать запрос">
                        <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`} /> {copied ? 'Готово' : 'Копировать'}
                    </button>
                    {onInsert && (
                        <button type="button" className="primary" onClick={insert} title="Вставить в редактор" aria-label="Вставить в редактор">
                            <i className={`fas ${inserted ? 'fa-check' : 'fa-arrow-right-to-bracket'}`} /> {inserted ? 'Вставлено' : 'В редактор'}
                        </button>
                    )}
                </div>
            </div>
            <pre className="ai-code-body"><code>{sql}</code></pre>
        </div>
    );
}

/* ── Datamart project card (```b2c-project``` block from the agent) ─── */
// CJM: проект агента не сохраняется сам по себе. Карточка спрашивает
// пользователя: создать карточку витрины (паспорт + ≥1 кластер) — тогда
// проект импортируется в её репозиторий в ветку openclaw/<mart>; отказ —
// проект остаётся только в диалоге.
function ProjectCard({ project, loaded, declined, branch, onLoad, onDecline }) {
    if (project.draftId) {
        const summary = project.summary || {};
        const rows = [
            ['Хранилище', String(summary.storage || '').toUpperCase()],
            ['Таблиц', summary.tableCount],
            ['Колонок', summary.columnCount],
            ['Потоков', summary.streamCount],
            ['Файлов', summary.fileCount],
        ].filter(([, value]) => value != null && value !== '');
        return (
            <div className="ai-dist">
                <div className="ai-dist-label">
                    <span><i className="fas fa-cubes" /> Черновик витрины собран</span>
                    <span className="ai-dist-hint"><i className="fas fa-clock" /> временный черновик · 1 час</span>
                </div>
                <div className="ai-dist-chips">
                    {(summary.tableNames || []).map(name => (
                        <span className="ai-dist-chip" key={name}><i className="fas fa-table" /> {name}</span>
                    ))}
                </div>
                <div className="ai-proj-stream">
                    <table className="ai-proj-table"><tbody>
                        {rows.map(([label, value]) => (
                            <tr key={label}><td>{label}</td><td>{value}</td></tr>
                        ))}
                    </tbody></table>
                </div>
                {loaded ? (
                    <div className="ai-dist-foot"><span className="ai-dist-count">
                        <i className="fas fa-circle-check" /> Карточка создана, структура перенесена в витрину
                    </span></div>
                ) : declined ? (
                    <div className="ai-dist-foot"><span className="ai-dist-count">
                        <i className="fas fa-circle-minus" /> Черновик удалён и не сохранён
                    </span></div>
                ) : (
                    <>
                        <div className="ai-dist-label" style={{ marginTop: 6 }}>
                            <span><i className="fas fa-circle-question" /> Создать витрину из этого результата?</span>
                        </div>
                        <div className="ai-dist-foot">
                            <button type="button" className="ai-dist-confirm" onClick={onDecline}
                                    style={{ background: 'transparent', color: '#8b9bb8', border: '1px solid rgba(139,155,184,0.4)' }}>
                                Не создавать
                            </button>
                            <button type="button" className="ai-dist-confirm" onClick={onLoad}>
                                <i className="fas fa-id-card" /> Заполнить паспорт…
                            </button>
                        </div>
                    </>
                )}
            </div>
        );
    }

    const files = Object.keys(project.files || {});
    const streams = listStreamsFromFiles(project.files || {});
    const targetBranch = branch || martBranchName(project.mart);

    return (
        <div className="ai-dist">
            <div className="ai-dist-label">
                <span><i className="fas fa-cubes" /> Проект витрины{project.mart ? `: ${project.mart}` : ''}</span>
                <span className="ai-dist-hint">{files.length} файл(ов)</span>
            </div>
            <div className="ai-dist-chips">
                <span className="ai-dist-chip"><i className="fas fa-code-branch" /> {targetBranch}</span>
                {streams.map(s => <span key={s} className="ai-dist-chip">etl/{s}/</span>)}
                {files.some(f => f.startsWith('resources/')) && <span className="ai-dist-chip">resources/</span>}
            </div>

            {/* Паспорт потока — строится из самих файлов проекта, а не из текста агента */}
            {streams.map(s => {
                const sum = buildStreamSummary(filesForStream(project.files, s));
                const rows = [
                    ['PA (целевая)', sum.pa],
                    ['STG (инкремент)', sum.stg],
                    ['HIST (бэкап)', sum.hist],
                    ['Первичный ключ', sum.pk],
                    ['Партиция PA', sum.partitionPa],
                    ['Партиция HIST', sum.partitionHist],
                    ['Колонок в PA', sum.columns],
                ].filter(([, v]) => v != null && v !== '');
                if (rows.length === 0) return null;
                return (
                    <div className="ai-proj-stream" key={s}>
                        <div className="ai-proj-stream-head">
                            <i className="fas fa-stream" /> Поток {s}
                        </div>
                        <table className="ai-proj-table">
                            <tbody>
                                {rows.map(([label, value]) => (
                                    <tr key={label}>
                                        <td>{label}</td>
                                        <td>{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            })}

            {loaded ? (
                <div className="ai-dist-foot">
                    <span className="ai-dist-count">
                        <i className="fas fa-circle-check" /> Карточка витрины создана — проект загружен в ветку {targetBranch}
                    </span>
                </div>
            ) : declined ? (
                <div className="ai-dist-foot">
                    <span className="ai-dist-count">
                        <i className="fas fa-circle-minus" /> Проект не сохранён — карточка не создана
                    </span>
                    <button type="button" className="ai-dist-confirm" onClick={onLoad}>
                        <i className="fas fa-id-card" /> Всё же создать карточку…
                    </button>
                </div>
            ) : (
                <>
                    <div className="ai-dist-label" style={{ marginTop: 6 }}>
                        <span>
                            <i className="fas fa-circle-question" /> Чтобы сохранить проект, нужно создать карточку витрины. Создаём?
                        </span>
                    </div>
                    <div className="ai-dist-foot">
                        <button type="button" className="ai-dist-confirm" onClick={onDecline}
                                style={{ background: 'transparent', color: '#8b9bb8', border: '1px solid rgba(139,155,184,0.4)' }}>
                            Не сохранять
                        </button>
                        <button type="button" className="ai-dist-confirm" onClick={onLoad}>
                            <i className="fas fa-id-card" /> Создать карточку витрины…
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

/* ── SQL-window picker for the distribution flow ────────────────────── */
function DistPicker({ tabs, done, picked, onConfirm }) {
    const [selected, setSelected] = useState(() => new Set());
    const [manual, setManual] = useState('');

    if (done) {
        return (
            <div className="ai-dist ai-dist-done">
                <div className="ai-dist-done-row"><i className="fas fa-circle-check" /> Окна выбраны</div>
                <div className="ai-dist-chips">
                    {(picked || []).map(n => <span key={n} className="ai-dist-chip is-done">{n}</span>)}
                </div>
            </div>
        );
    }

    function clickItem(e, id) {
        if (e.ctrlKey || e.metaKey) {
            setSelected(prev => {
                const next = new Set(prev);
                next.has(id) ? next.delete(id) : next.add(id);
                return next;
            });
        } else {
            setSelected(prev => (prev.size === 1 && prev.has(id)) ? new Set() : new Set([id]));
        }
    }

    const manualNames = manual.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    const selectedNames = tabs.filter(t => selected.has(t.id)).map(t => t.name);
    const finalNames = Array.from(new Set([...selectedNames, ...manualNames]));

    return (
        <div className="ai-dist">
            <div className="ai-dist-label">
                <span><i className="fas fa-window-restore" /> Открытые SQL-окна</span>
                <span className="ai-dist-hint">Ctrl — выбрать несколько</span>
            </div>
            <div className="ai-dist-list">
                {tabs.length === 0 ? (
                    <div className="ai-dist-empty">Нет открытых окон</div>
                ) : tabs.map(t => (
                    <button
                        key={t.id}
                        type="button"
                        className={`ai-dist-item${selected.has(t.id) ? ' selected' : ''}`}
                        onClick={e => clickItem(e, t.id)}
                    >
                        <i className={`${selected.has(t.id) ? 'fas fa-square-check' : 'far fa-square'} ai-dist-check`} />
                        <i className="fas fa-file-code ai-dist-file" />
                        <span className="ai-dist-name">{t.name}</span>
                    </button>
                ))}
            </div>

            <div className="ai-dist-label"><span><i className="fas fa-pen" /> Или впишите вручную</span></div>
            <textarea
                className="ai-dist-manual"
                rows={2}
                value={manual}
                placeholder="напр. query_3.sql, custom_mart.sql"
                spellCheck={false}
                onChange={e => setManual(e.target.value)}
            />

            <div className="ai-dist-foot">
                <span className="ai-dist-count">{finalNames.length} выбрано</span>
                <button
                    type="button"
                    className="ai-dist-confirm"
                    disabled={finalNames.length === 0}
                    onClick={() => onConfirm(finalNames)}
                >
                    <i className="fas fa-box-open" /> Создать дистрибутив
                </button>
            </div>
        </div>
    );
}

async function fileToBase64(file) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    let binary = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
}

function LlmConnectionDialog({ connection, loading, saving, error, token, onToken, onSave, onClose }) {
    const configured = Boolean(connection?.configured);
    return (
        <div className="ai-connection-backdrop" role="presentation">
            <section className="ai-connection-dialog" role="dialog" aria-modal="true" aria-labelledby="ai-connection-title">
                <div className="ai-connection-icon"><i className="fas fa-key" /></div>
                <h3 id="ai-connection-title">Подключение модели</h3>
                <p>
                    Укажите токен вашей модели. Он передаётся напрямую в персональный агент OpenClaw,
                    не сохраняется в браузере и не попадает в проект на GitHub.
                </p>
                <dl className="ai-connection-meta">
                    <div><dt>Поставщик</dt><dd>{connection?.providerName || 'RouterAI'}</dd></div>
                    <div><dt>Модель</dt><dd>{connection?.modelName || 'DeepSeek V4 Pro'}</dd></div>
                </dl>
                <form onSubmit={onSave}>
                    <label htmlFor="ai-model-token">Токен доступа</label>
                    <div className="ai-token-field">
                        <i className="fas fa-shield-halved" />
                        <input
                            id="ai-model-token"
                            type="password"
                            value={token}
                            onChange={event => onToken(event.target.value)}
                            placeholder={configured ? 'Введите новый токен для замены' : 'Вставьте токен'}
                            autoComplete="new-password"
                            disabled={loading || saving}
                            autoFocus
                        />
                    </div>
                    {error && <div className="ai-connection-error"><i className="fas fa-triangle-exclamation" /> {error}</div>}
                    <div className="ai-connection-actions">
                        {configured && (
                            <button type="button" className="secondary" onClick={onClose} disabled={saving}>Отмена</button>
                        )}
                        <button type="submit" className="primary" disabled={loading || saving || token.trim().length < 8}>
                            <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-link'}`} />
                            {saving ? 'Подключаю…' : configured ? 'Заменить токен' : 'Подключить модель'}
                        </button>
                    </div>
                </form>
                <small><i className="fas fa-database" /> Токен хранится только в закрытом Docker-томе OpenClaw.</small>
            </section>
        </div>
    );
}

/* ── Main panel ─────────────────────────────────────────────────────── */
export default function AiAgentPanel({ datamartId, open, onClose, onInsertSql, onLoadProject, tabs = [], width }) {
    const conversationScope = String(datamartId || 'global');
    const [models, setModels] = useState([FALLBACK_MODEL]);
    const [model, setModel] = useState('b2c-sql-agent');
    const [view, setView] = useState('chat'); // 'chat' | 'history'
    const [conversations, setConversations] = useState([]);
    const [convId, setConvId] = useState(() => String(Date.now()));
    const [messages, setMessages] = useState([]);
    const [historyReady, setHistoryReady] = useState(false);
    const [draft, setDraft] = useState('');
    const [thinking, setThinking] = useState(false);
    const [streamText, setStreamText] = useState('');
    const [storage, setStorage] = useState('iceberg');
    const [attachments, setAttachments] = useState([]);
    const [building, setBuilding] = useState(false);
    const [buildError, setBuildError] = useState('');
    const [connection, setConnection] = useState(null);
    const [connectionLoading, setConnectionLoading] = useState(false);
    const [connectionDialog, setConnectionDialog] = useState(false);
    const [connectionToken, setConnectionToken] = useState('');
    const [connectionSaving, setConnectionSaving] = useState(false);
    const [connectionError, setConnectionError] = useState('');

    // Load the user's server-side history and resume the active conversation.
    useEffect(() => {
        let alive = true;
        setHistoryReady(false);
        fetchAiConversations(conversationScope).then(result => {
            if (!alive) return;
            const items = Array.isArray(result?.items) ? result.items : [];
            const activeId = result?.activeConversationId || items[0]?.id || String(Date.now());
            const active = items.find(item => item.id === activeId);
            setConversations(items);
            setConvId(activeId);
            setMessages(active?.messages || []);
        }).catch(() => {
            if (!alive) return;
            setConversations([]);
            setConvId(String(Date.now()));
            setMessages([]);
        }).finally(() => { if (alive) setHistoryReady(true); });
        return () => { alive = false; };
    }, [conversationScope]);

    useEffect(() => {
        if (!historyReady) return;
        setActiveAiConversation(conversationScope, convId).catch(() => {});
    }, [conversationScope, convId, historyReady]);

    const bodyRef = useRef(null);
    const inputRef = useRef(null);
    const fileRef = useRef(null);
    const activeModel = models.find(m => m.id === model) || FALLBACK_MODEL;

    useEffect(() => {
        fetchAiModels().then(items => {
            if (!items?.length) return;
            setModels(items);
            setModel(current => items.some(item => item.id === current)
                ? current
                : (items.find(item => item.id === 'b2c-sql-agent')?.id || items[0].id));
        }).catch(() => {});
    }, []);

    useEffect(() => {
        if (!open) return;
        let alive = true;
        setConnectionLoading(true);
        setConnectionError('');
        fetchLlmConnection().then(result => {
            if (!alive) return;
            setConnection(result);
            if (!result?.configured) setConnectionDialog(true);
        }).catch(error => {
            if (!alive) return;
            setConnection({ configured: false, providerName: 'RouterAI', modelName: 'DeepSeek V4 Pro' });
            setConnectionError(error?.message || 'Не удалось проверить подключение модели.');
            setConnectionDialog(true);
        }).finally(() => { if (alive) setConnectionLoading(false); });
        return () => { alive = false; };
    }, [open]);

    // Persist the active conversation in PostgreSQL whenever messages change.
    useEffect(() => {
        if (!historyReady || messages.length === 0) return;
        const safe = safeMessages(messages);
        const title = safe.find(m => m.role === 'user')?.text?.slice(0, 52) || 'Новый диалог';
        const projectName = convMart({ messages: safe }) || '';
        const conv = { id: convId, title, count: safe.length, messages: safe, updatedAt: Date.now(), projectName };
        setConversations(prev => {
            const next = [conv, ...prev.filter(c => c.id !== convId)].sort((a, b) => b.updatedAt - a.updatedAt);
            return next;
        });
        saveAiConversation(conversationScope, convId, { title, messages: safe, projectName }).catch(() => {});
    }, [messages, convId, conversationScope, historyReady]);

    // Autoscroll to newest message / thinking indicator.
    useEffect(() => {
        if (view !== 'chat') return;
        const el = bodyRef.current;
        if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }, [messages, thinking, streamText, view]);

    // Focus the input when the panel opens.
    useEffect(() => { if (open && view === 'chat') inputRef.current?.focus(); }, [open, view]);

    function newChat() {
        setConvId(String(Date.now()));
        setMessages([]);
        setView('chat');
    }
    function loadConv(c) {
        setConvId(c.id);
        setMessages(c.messages || []);
        setView('chat');
    }
    async function deleteConv(id, e) {
        e.stopPropagation();
        await deleteAiConversation(conversationScope, id).catch(() => {});
        setConversations(prev => prev.filter(c => c.id !== id));
        // Deleted the conversation we were in — start a fresh one.
        if (id === convId) {
            setConvId(String(Date.now()));
            setMessages([]);
        }
    }

    const send = useCallback(async (text) => {
        const prompt = text.trim();
        if (!prompt || thinking) return;
        if (!connection?.configured) {
            setConnectionDialog(true);
            return;
        }
        setMessages(prev => [...prev, { role: 'user', text: prompt }]);
        setDraft('');
        setStreamText('');
        if (inputRef.current) inputRef.current.style.height = 'auto';

        // Distribution intent → offer the SQL-window picker instead of a text reply.
        if (/дистрибутив|distribution/i.test(prompt)) {
            setThinking(true);
            await new Promise(r => setTimeout(r, 480));
            setThinking(false);
            setMessages(prev => [...prev, { role: 'assistant', type: 'distPicker', text: DIST_PROMPT }]);
            return;
        }

        setThinking(true);
        try {
            const selectedAttachments = [...attachments];
            const reply = await sendAgentMessage({
                prompt,
                model,
                history: messages,
                conversationId: convId,
                attachments: selectedAttachments,
                storage,
                onDelta: setStreamText,
            });
            // Agent-built datamart project: NOT saved automatically — the card
            // in the thread asks the user to create a datamart card first.
            setMessages(prev => {
                const next = [...prev];
                if (reply.upload?.uploadPath) {
                    for (let index = next.length - 1; index >= 0; index--) {
                        if (next[index]?.role === 'user' && !next[index].uploadPath) {
                            next[index] = { ...next[index], uploadPath: reply.upload.uploadPath };
                            break;
                        }
                    }
                }
                return [...next, { ...reply, upload: undefined }];
            });
            setStreamText('');
            if (selectedAttachments.length) setAttachments([]);
        } catch (err) {
            setStreamText('');
            const hint = ' Проверьте состояние контейнеров OpenClaw и backend.';
            setMessages(prev => [...prev, { role: 'assistant', text: `Не удалось получить ответ.${hint} (${err?.message || 'ошибка сети'})` }]);
        } finally {
            setThinking(false);
        }
    }, [model, thinking, messages, convId, connection, attachments, storage]);

    async function connectModel(event) {
        event.preventDefault();
        const token = connectionToken.trim();
        if (token.length < 8 || connectionSaving) return;
        setConnectionSaving(true);
        setConnectionError('');
        try {
            const result = await saveLlmConnection(token);
            setConnection(result);
            setConnectionToken('');
            setConnectionDialog(false);
            setTimeout(() => inputRef.current?.focus(), 0);
        } catch (error) {
            setConnectionError(error?.message || 'Не удалось подключить модель.');
        } finally {
            setConnectionSaving(false);
        }
    }

    function selectFiles(event) {
        const incoming = Array.from(event.target.files || []);
        setAttachments(prev => {
            const byKey = new Map(prev.map(file => [`${file.name}:${file.size}`, file]));
            incoming.forEach(file => byKey.set(`${file.name}:${file.size}`, file));
            return Array.from(byKey.values());
        });
        setBuildError('');
        event.target.value = '';
    }

    async function buildPackage() {
        if (building) return;
        const s2tFiles = attachments.filter(file => /\.xlsx$/i.test(file.name));
        const prototypeFiles = attachments.filter(file => /\.(sql|txt|json)$/i.test(file.name));
        if (s2tFiles.length !== 1) {
            setBuildError('Добавьте ровно один файл S2T.xlsx.');
            return;
        }
        if (!prototypeFiles.length) {
            setBuildError('Добавьте SQL-прототипы или один dml_scripts.json.');
            return;
        }

        setBuilding(true);
        setBuildError('');
        setMessages(prev => [...prev, {
            role: 'user',
            text: `Проверить и собрать пакет: ${s2tFiles[0].name}, ${prototypeFiles.length} прототип(ов), ${storage.toUpperCase()}.`,
        }]);
        try {
            const result = await buildMartDraft({
                storage,
                s2t: { name: s2tFiles[0].name, base64: await fileToBase64(s2tFiles[0]) },
                files: await Promise.all(prototypeFiles.map(async file => ({ name: file.name, text: await file.text() }))),
            });
            const summary = result.summary || {};
            setMessages(prev => [...prev, {
                role: 'assistant',
                model,
                text: `Пакет проверен. Собрано таблиц: ${summary.tableCount || 0}, потоков: ${summary.streamCount || 0}, файлов: ${summary.fileCount || 0}. Результат сохранён как временный черновик и ещё не добавлен в репозиторий.`,
                project: {
                    draftId: result.draftId,
                    expiresAt: result.expiresAt,
                    summary,
                },
            }]);
            setAttachments([]);
        } catch (error) {
            const message = error?.message || 'Не удалось проверить пакет.';
            setBuildError(message);
            setMessages(prev => [...prev, {
                role: 'assistant',
                model,
                text: `Сборка не выполнена. Исправьте пакет:\n${message}`,
            }]);
        } finally {
            setBuilding(false);
        }
    }

    // «Создать карточку витрины» — открывает паспорт новой витрины (в
    // standalone-редакторе) и по завершении помечает сообщение загруженным.
    const loadProject = useCallback(async (idx) => {
        const msg = messages[idx];
        if (!msg?.project || msg.projectLoaded) return;
        const res = await Promise.resolve(onLoadProject?.(msg.project)).catch(() => false);
        if (!res) return;
        setMessages(prev => prev.map((m, i) => (i === idx
            ? { ...m, projectLoaded: true, projectDeclined: false, projectBranch: typeof res === 'string' ? res : m.projectBranch }
            : m)));
    }, [messages, onLoadProject]);

    // «Не создавать» удаляет серверный черновик; в истории остаётся только
    // короткая запись о результате решения пользователя.
    const declineProject = useCallback(async (idx) => {
        const project = messages[idx]?.project;
        if (project?.draftId) await discardMartDraft(project.draftId).catch(() => {});
        setMessages(prev => prev.map((m, i) => (i === idx ? { ...m, projectDeclined: true } : m)));
    }, [messages]);

    const confirmDistribution = useCallback(async (idx, names) => {
        if (!names.length) return;
        setMessages(prev => {
            const marked = prev.map((m, i) => (i === idx ? { ...m, done: true, picked: names } : m));
            return [...marked, { role: 'user', text: `Окна для дистрибутива: ${names.join(', ')}` }];
        });
        setThinking(true);
        try {
            const reply = await buildDistribution({ windows: names, model });
            setMessages(prev => [...prev, reply]);
        } finally {
            setThinking(false);
        }
    }, [model]);

    function onInputKey(e) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(draft); }
    }
    function autoGrow(e) {
        setDraft(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
    }

    return (
        <aside className="ai-agent-panel" aria-label="ИИ-ассистент" style={width ? { width } : undefined}>
            <header className="ai-head">
                <span className="ai-head-sheen" aria-hidden="true" />
                <div className="ai-head-bar">
                    <div className="ai-head-id">
                        <span className="ai-orb" aria-hidden="true"><i className="fas fa-wand-magic-sparkles" /></span>
                        <span className="ai-head-text">
                            <strong>ИИ-ассистент</strong>
                            <span>SQL-копайлот</span>
                        </span>
                    </div>
                    <div className="ai-head-actions">
                        <button
                            type="button"
                            className="ai-icon-btn"
                            onClick={() => { setConnectionError(''); setConnectionDialog(true); }}
                            title="Токен модели"
                            aria-label="Настроить токен модели"
                        >
                            <i className="fas fa-key" />
                        </button>
                        <button
                            type="button"
                            className={`ai-icon-btn${view === 'history' ? ' active' : ''}`}
                            onClick={() => setView(v => (v === 'history' ? 'chat' : 'history'))}
                            title="История диалогов"
                            aria-label="История диалогов"
                            aria-pressed={view === 'history'}
                        >
                            <i className="fas fa-clock-rotate-left" />
                        </button>
                        <button type="button" className="ai-icon-btn" onClick={newChat} title="Новый чат" aria-label="Новый чат">
                            <i className="fas fa-pen-to-square" />
                        </button>
                        <button type="button" className="ai-icon-btn" onClick={onClose} title="Свернуть" aria-label="Свернуть панель">
                            <i className="fas fa-chevron-right" />
                        </button>
                    </div>
                </div>
                <ModelSelector models={models} value={model} onChange={setModel} />
            </header>

            {view === 'history' ? (
                <div className="ai-body ai-history">
                    <div className="ai-history-head">
                        <button type="button" className="ai-back" onClick={() => setView('chat')}>
                            <i className="fas fa-arrow-left" /> Назад к диалогу
                        </button>
                    </div>
                    {conversations.length === 0 ? (
                        <div className="ai-history-empty">
                            <i className="fas fa-comments" />
                            <span>История пуста</span>
                            <small>Здесь появятся ваши прошлые диалоги</small>
                        </div>
                    ) : conversations.map(c => (
                        <div
                            key={c.id}
                            className={`ai-history-item${c.id === convId ? ' active' : ''}`}
                            onClick={() => loadConv(c)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={e => { if (e.key === 'Enter') loadConv(c); }}
                        >
                            <span className="ai-history-icon"><i className="fas fa-message" /></span>
                            <span className="ai-history-text">
                                <span className="ai-history-title">{c.title}</span>
                                <span className="ai-history-meta">
                                    {relTime(c.updatedAt)} · {c.count} сообщ.{convMart(c) ? ` · 📦 ${convMart(c)}` : ''}
                                </span>
                            </span>
                            <span
                                className="ai-history-del"
                                onClick={e => deleteConv(c.id, e)}
                                title="Удалить диалог"
                                role="button"
                                aria-label="Удалить диалог"
                            >
                                <i className="fas fa-trash" />
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="ai-body" ref={bodyRef}>
                    {messages.length === 0 && !thinking ? (
                        <div className="ai-empty">
                            <div className="ai-empty-orb"><i className="fas fa-wand-magic-sparkles" /></div>
                            <h3 className="ai-empty-title">Чем помочь с запросом?</h3>
                            <p className="ai-empty-sub">Напишите сообщение или приложите S2T и SQL-прототипы через скрепку.</p>
                        </div>
                    ) : (
                        <div className="ai-thread">
                            {messages.map((m, i) => (
                                m.role === 'user' ? (
                                    <div key={i} className="ai-msg ai-msg-user">
                                        <div className="ai-bubble ai-bubble-user">{m.text}</div>
                                    </div>
                                ) : (
                                    <div key={i} className="ai-msg ai-msg-bot">
                                        <span className="ai-avatar" aria-hidden="true"><i className="fas fa-wand-magic-sparkles" /></span>
                                        <div className="ai-bubble ai-bubble-bot">
                                            <div className="ai-text"><MarkdownLite text={m.text} /></div>
                                            {m.type === 'distPicker' && (
                                                <DistPicker
                                                    tabs={tabs}
                                                    done={m.done}
                                                    picked={m.picked}
                                                    onConfirm={names => confirmDistribution(i, names)}
                                                />
                                            )}
                                            {m.project && (
                                                <ProjectCard
                                                    project={m.project}
                                                    loaded={m.projectLoaded}
                                                    declined={m.projectDeclined}
                                                    branch={m.projectBranch}
                                                    onLoad={() => loadProject(i)}
                                                    onDecline={() => declineProject(i)}
                                                />
                                            )}
                                            {m.sql && <SqlBlock sql={m.sql} onInsert={m.noInsert ? undefined : onInsertSql} />}
                                        </div>
                                    </div>
                                )
                            ))}
                            {thinking && streamText && (
                                <div className="ai-msg ai-msg-bot">
                                    <span className="ai-avatar ai-avatar-live" aria-hidden="true"><i className="fas fa-wand-magic-sparkles" /></span>
                                    <div className="ai-bubble ai-bubble-bot" aria-live="polite">
                                        <div className="ai-text"><MarkdownLite text={streamText} /></div>
                                    </div>
                                </div>
                            )}
                            {thinking && !streamText && (
                                <div className="ai-msg ai-msg-bot">
                                    <span className="ai-avatar ai-avatar-live" aria-hidden="true"><i className="fas fa-wand-magic-sparkles" /></span>
                                    <div className="ai-bubble ai-bubble-bot ai-thinking" aria-live="polite">
                                        <span className="ai-think-label">{activeModel.name} думает</span>
                                        <span className="ai-dots"><span /><span /><span /></span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {activeModel.capability === 'b2c-mart' && attachments.length > 0 && (
                <div className="ai-package">
                    <div className="ai-package-head">
                        <span><i className="fas fa-box-open" /> Пакет документов</span>
                        <div className="ai-storage" aria-label="Формат хранения">
                            {['iceberg', 'parquet'].map(kind => (
                                <button key={kind} type="button" className={storage === kind ? 'active' : ''}
                                        onClick={() => setStorage(kind)}>{kind}</button>
                            ))}
                        </div>
                    </div>
                    <div className="ai-package-files">
                        {attachments.map(file => (
                            <span className="ai-package-file" key={`${file.name}:${file.size}`}>
                                <i className={`fas ${/\.xlsx$/i.test(file.name) ? 'fa-file-excel' : 'fa-file-code'}`} />
                                <span title={file.name}>{file.name}</span>
                                <button type="button" aria-label={`Убрать ${file.name}`}
                                        onClick={() => setAttachments(prev => prev.filter(item => item !== file))}>
                                    <i className="fas fa-xmark" />
                                </button>
                            </span>
                        ))}
                    </div>
                    {buildError && <div className="ai-package-error"><i className="fas fa-triangle-exclamation" /> {buildError}</div>}
                    <button type="button" className="ai-package-build" disabled={building} onClick={buildPackage}>
                        <i className={`fas ${building ? 'fa-spinner fa-spin' : 'fa-gears'}`} />
                        {building ? 'Проверяю и собираю…' : 'Проверить и собрать'}
                    </button>
                </div>
            )}

            <form className="ai-input" onSubmit={e => { e.preventDefault(); send(draft); }}>
                <input ref={fileRef} type="file" multiple accept=".xlsx,.sql,.txt,.json" hidden onChange={selectFiles} />
                <div className="ai-input-box">
                    {activeModel.capability === 'b2c-mart' && (
                        <button type="button" className="ai-attach" onClick={() => fileRef.current?.click()}
                                title="Добавить S2T и SQL-прототипы" aria-label="Добавить документы">
                            <i className="fas fa-paperclip" />
                        </button>
                    )}
                    <textarea
                        ref={inputRef}
                        rows={1}
                        value={draft}
                        placeholder={activeModel.capability === 'b2c-mart' ? 'Опишите задачу или приложите S2T и SQL…' : 'Введите сообщение агенту…'}
                        spellCheck={false}
                        onChange={autoGrow}
                        onKeyDown={onInputKey}
                        aria-label="Сообщение ассистенту"
                    />
                    <button type="submit" className="ai-send" disabled={thinking || !draft.trim()} aria-label="Отправить">
                        <i className={`fas ${thinking ? 'fa-spinner fa-spin' : 'fa-arrow-up'}`} />
                    </button>
                </div>
                <div className="ai-input-hint"><kbd>Enter</kbd> отправить · <kbd>Shift</kbd>+<kbd>Enter</kbd> перенос</div>
            </form>

            {connectionDialog && (
                <LlmConnectionDialog
                    connection={connection}
                    loading={connectionLoading}
                    saving={connectionSaving}
                    error={connectionError}
                    token={connectionToken}
                    onToken={setConnectionToken}
                    onSave={connectModel}
                    onClose={() => { setConnectionDialog(false); setConnectionToken(''); setConnectionError(''); }}
                />
            )}
        </aside>
    );
}
