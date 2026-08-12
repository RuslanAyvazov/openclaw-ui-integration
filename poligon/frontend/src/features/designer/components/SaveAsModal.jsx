// "Сохранить как" modal. Branches behave like Excel save folders:
//   - Pick an existing branch (folder) and a stream (subfolder).
//   - Or create a new branch from any existing one ("создать каталог").
// If a stream with that name already exists in the target branch the user is
// prompted to confirm a replace.

import { useEffect, useMemo, useState } from 'react';
import { findNode } from '../../../shared/branchStore';

const EXT_META = {
    sql:   { icon: 'fas fa-database',   color: '#2980b9' },
    json:  { icon: 'fas fa-align-left', color: '#d4a017' },
    yml:   { icon: 'fas fa-cog',        color: '#27ae60' },
    yaml:  { icon: 'fas fa-cog',        color: '#27ae60' },
    xml:   { icon: 'fas fa-code',       color: '#e67e22' },
    md:    { icon: 'fas fa-book-open',  color: '#7f8c8d' },
    scala: { icon: 'fas fa-code',       color: '#8e44ad' },
    java:  { icon: 'fab fa-java',       color: '#e67e22' },
};

function extMeta(name) {
    const ext = name.split('.').pop().toLowerCase();
    return EXT_META[ext] || { icon: 'fas fa-file-code', color: '#7f8c8d' };
}

function NewBranchDialog({ open, onConfirm, onClose, branchNames, defaultParent }) {
    const [name, setName] = useState('');
    const [parent, setParent] = useState(defaultParent || 'main');

    useEffect(() => {
        if (!open) return;
        setName('');
        setParent(defaultParent || 'main');
    }, [open, defaultParent]);

    if (!open) return null;

    function submit() {
        const trimmed = name.trim();
        if (!trimmed) { alert('Введите имя ветки'); return; }
        if (branchNames.includes(trimmed)) { alert('Такая ветка уже есть'); return; }
        onConfirm({ name: trimmed, parent });
    }

    return (
        <div className="modal active branch-modal-overlay" style={{ zIndex: 1100 }}>
            <div className="modal-content branch-modal-content" style={{ maxWidth: 460 }}>
                <div className="branch-hero">
                    <div className="branch-hero-icon"><i className="fas fa-folder-plus" /></div>
                    <div className="branch-hero-title">
                        <h3>Новая ветка</h3>
                        <p>Будет создана как клон выбранной родительской ветки.</p>
                    </div>
                    <button className="branch-hero-close" onClick={onClose} aria-label="Закрыть">
                        <i className="fas fa-times" />
                    </button>
                </div>
                <div className="branch-modal-body">
                    <div className="branch-field">
                        <label>Название</label>
                        <input
                            autoFocus
                            className="branch-input"
                            placeholder="feature/awesome-mart"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') submit(); }}
                        />
                    </div>
                    <div className="branch-field">
                        <label>Клонировать от</label>
                        <div className="branch-select-wrap">
                            <i className="fas fa-code-branch" />
                            <select value={parent} onChange={e => setParent(e.target.value)}>
                                {branchNames.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                            <i className="fas fa-chevron-down branch-select-caret" />
                        </div>
                    </div>
                </div>
                <div className="branch-modal-footer">
                    <button className="branch-btn-secondary" onClick={onClose}>Отмена</button>
                    <button className="branch-btn-primary" onClick={submit}>
                        <i className="fas fa-plus" /> Создать
                    </button>
                </div>
            </div>
        </div>
    );
}

function FileViewerModal({ open, branchName, path, content, onClose }) {
    useEffect(() => {
        if (!open) return;
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open, onClose]);

    if (!open) return null;

    const ext = (path || '').split('.').pop().toLowerCase();
    const meta = extMeta(path || '');

    return (
        <div className="modal active branch-modal-overlay" style={{ zIndex: 1200 }}>
            <div className="modal-content branch-modal-content branch-fileviewer-content">
                <div className="branch-hero">
                    <div className="branch-hero-icon"><i className={meta.icon} /></div>
                    <div className="branch-hero-title">
                        <h3>{path?.split('/').pop()}</h3>
                        <p>
                            <span style={{ opacity: 0.85 }}>{branchName}</span>
                            <span style={{ opacity: 0.55, margin: '0 6px' }}>·</span>
                            <span style={{ opacity: 0.85, fontFamily: "'JetBrains Mono', monospace" }}>{path}</span>
                        </p>
                    </div>
                    <button className="branch-hero-close" onClick={onClose} aria-label="Закрыть">
                        <i className="fas fa-times" />
                    </button>
                </div>
                <div className="branch-fileviewer-body">
                    <div className="branch-fileviewer-readonly-bar">
                        <i className="fas fa-eye" /> Просмотр — редактирование недоступно
                        <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#9aa5b5' }}>{ext || 'file'}</span>
                    </div>
                    <pre className="branch-fileviewer-pre">{content ?? ''}</pre>
                </div>
                <div className="branch-modal-footer">
                    <button className="branch-btn-secondary" onClick={onClose}>Закрыть</button>
                </div>
            </div>
        </div>
    );
}

// Asks the user where to commit their unsaved changes when "Create PR" is
// checked. When `forceNew` is true (no source branch, or source no longer
// exists) the "current branch" option is hidden — only the new-branch path
// is available.
function PRStrategyDialog({ open, sourceBranch, hasSource, forceNew, branchNames, isDirty, prTargetBranch, onConfirm, onCancel }) {
    const [mode, setMode] = useState(hasSource && !forceNew ? 'current' : 'new');
    const [newName, setNewName] = useState('');

    useEffect(() => {
        if (!open) return;
        setMode(hasSource && !forceNew ? 'current' : 'new');
        setNewName('');
    }, [open, hasSource, forceNew]);

    if (!open) return null;

    function submit() {
        if (mode === 'current') {
            if (!hasSource) { alert('Текущая ветка не определена.'); return; }
            onConfirm({ target: 'current' });
            return;
        }
        const trimmed = newName.trim();
        if (!trimmed) { alert('Введите имя новой ветки'); return; }
        if (branchNames.includes(trimmed)) { alert('Такая ветка уже есть'); return; }
        onConfirm({ target: 'new', name: trimmed });
    }

    return (
        <div className="modal active branch-modal-overlay" style={{ zIndex: 1100 }}>
            <div className="modal-content branch-modal-content" style={{ maxWidth: 540 }}>
                <div className="branch-hero" style={{ background: 'linear-gradient(135deg, #c0392b 0%, #e67e22 100%)' }}>
                    <div className="branch-hero-icon"><i className="fas fa-exclamation-triangle" /></div>
                    <div className="branch-hero-title">
                        <h3>{forceNew ? 'Куда сохранить изменения?' : 'Несохранённые изменения'}</h3>
                        <p>
                            {forceNew
                                ? <>Текущая страница не привязана к ветке. Создайте отдельную ветку — туда уйдут изменения, и из неё откроется PR в <strong>{prTargetBranch}</strong>.</>
                                : <>В потоке есть несохранённые изменения. Сохраните их сначала — они и пойдут в PR в <strong>{prTargetBranch}</strong>.</>
                            }
                        </p>
                    </div>
                </div>
                <div className="branch-modal-body" style={{ padding: '14px 18px' }}>
                    {!forceNew && hasSource && (
                        <label className={`branch-pr-strategy-row${mode === 'current' ? ' is-active' : ''}`}>
                            <input
                                type="radio"
                                name="pr-strategy"
                                checked={mode === 'current'}
                                onChange={() => setMode('current')}
                            />
                            <div className="branch-pr-strategy-text">
                                <strong>Сохранить в текущей ветке</strong>
                                <span><code>{sourceBranch}</code> — туда уйдёт коммит и из неё откроется PR.</span>
                            </div>
                        </label>
                    )}

                    <label className={`branch-pr-strategy-row${mode === 'new' ? ' is-active' : ''}`}>
                        <input
                            type="radio"
                            name="pr-strategy"
                            checked={mode === 'new'}
                            onChange={() => setMode('new')}
                        />
                        <div className="branch-pr-strategy-text">
                            <strong>Сохранить в новой ветке</strong>
                            <span>Новая ветка будет клонирована {hasSource ? <>от <code>{sourceBranch}</code></> : <>от <code>main</code></>}.</span>
                        </div>
                    </label>

                    {mode === 'new' && (
                        <input
                            className="branch-input"
                            placeholder="feature/my-changes"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') submit(); }}
                            autoFocus
                            style={{ marginTop: 10 }}
                        />
                    )}

                    {!isDirty && !forceNew && (
                        <div className="branch-saveas-info" style={{ margin: '12px 0 0', padding: '8px 12px' }}>
                            <i className="fas fa-info-circle" />
                            <span>В потоке нет несохранённых изменений — это резервная стратегия.</span>
                        </div>
                    )}
                </div>
                <div className="branch-modal-footer">
                    <button className="branch-btn-secondary" onClick={onCancel}>Отмена</button>
                    <button className="branch-btn-primary" onClick={submit}>
                        <i className="fas fa-arrow-right" /> Продолжить
                    </button>
                </div>
            </div>
        </div>
    );
}

function ConflictDialog({ open, branch, stream, onReplace, onCancel }) {
    if (!open) return null;
    return (
        <div className="modal active branch-modal-overlay" style={{ zIndex: 1100 }}>
            <div className="modal-content branch-modal-content" style={{ maxWidth: 440 }}>
                <div className="branch-hero" style={{ background: 'linear-gradient(135deg, #c0392b 0%, #e67e22 100%)' }}>
                    <div className="branch-hero-icon"><i className="fas fa-exclamation-triangle" /></div>
                    <div className="branch-hero-title">
                        <h3>Поток уже существует</h3>
                        <p>В ветке <strong>{branch}</strong> уже есть поток <strong>{stream}</strong>.</p>
                    </div>
                </div>
                <div className="branch-modal-body" style={{ padding: '16px 18px' }}>
                    <p style={{ margin: 0, color: '#475569', fontSize: 13.5, lineHeight: 1.5 }}>
                        Заменить существующий поток (будет создан новый коммит), или отменить и выбрать другую цель?
                    </p>
                </div>
                <div className="branch-modal-footer">
                    <button className="branch-btn-secondary" onClick={onCancel}>Отмена</button>
                    <button className="branch-btn-primary" onClick={onReplace} style={{ background: '#e67e22' }}>
                        <i className="fas fa-pen" /> Заменить
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function SaveAsModal({
    open,
    branches,
    activeBranch,
    currentStream,
    sourceBranch,           // branch the page was imported from (page.branch); may be null
    isDirty,                // true if current page flow != cleanFlow
    listStreamsInBranch,
    onCreateBranch,         // (name, parent) => void (mutates branches via store)
    onConfirm,              // ({ branch, stream, replaceExisting, createPR, prStrategy }) => void
    onClose,
}) {
    const branchNames = useMemo(() => Object.keys(branches || {}), [branches]);
    const [selectedBranch, setSelectedBranch] = useState(activeBranch || branchNames[0] || 'main');
    const [streamName, setStreamName] = useState(currentStream || '');
    const [showNewBranch, setShowNewBranch] = useState(false);
    const [conflict, setConflict] = useState(null); // null | { branch, stream }
    const [viewingFile, setViewingFile] = useState(null); // null | { path }
    const [createPR, setCreatePR] = useState(false);
    const [strategyOpen, setStrategyOpen] = useState(false);

    // Source is "alive" if the bound branch still exists in the store.
    const hasLiveSource = !!(sourceBranch && branches?.[sourceBranch]);

    useEffect(() => {
        if (!open) return;
        setSelectedBranch(activeBranch || branchNames[0] || 'main');
        setStreamName(currentStream || '');
        setShowNewBranch(false);
        setConflict(null);
        setViewingFile(null);
        setCreatePR(false);
        setStrategyOpen(false);
    }, [open, activeBranch, currentStream, branchNames]);

    // Files inside the selected stream, walked recursively so files inside
    // DDL/ and DML/ subfolders show up too. `relativePath` is shown to the
    // user (e.g. "DDL/orders.sql"); `path` is the full content key.
    const streamFiles = useMemo(() => {
        const trimmed = streamName.trim();
        if (!trimmed) return [];
        const branch = branches?.[selectedBranch];
        if (!branch) return [];
        const node = findNode(branch.structure, `etl/${trimmed}`);
        if (!node || node.type !== 'folder') return [];
        const out = [];
        const walk = (n, prefix) => {
            for (const child of (n.children || [])) {
                const rel = prefix ? `${prefix}/${child.name}` : child.name;
                if (child.type === 'file')        out.push({ relativePath: rel, name: child.name });
                else if (child.type === 'folder') walk(child, rel);
            }
        };
        walk(node, '');
        // Top-level files first, then nested — alphabetical inside each tier.
        return out.sort((a, b) => {
            const aDepth = a.relativePath.split('/').length;
            const bDepth = b.relativePath.split('/').length;
            if (aDepth !== bDepth) return aDepth - bDepth;
            return a.relativePath.localeCompare(b.relativePath);
        });
    }, [branches, selectedBranch, streamName]);

    const viewingContent = viewingFile
        ? (branches?.[selectedBranch]?.contents?.[viewingFile.path] ?? '')
        : '';

    if (!open) return null;

    const streamsInTarget = listStreamsInBranch(selectedBranch);
    const exists = streamsInTarget.includes(streamName.trim());

    function attemptSave() {
        const finalStream = streamName.trim();
        if (!finalStream) { alert('Введите имя потока'); return; }
        if (!/^[A-Za-z0-9_-]+$/.test(finalStream)) {
            alert('Имя потока: только латиница, цифры, дефис и подчёркивание.');
            return;
        }

        if (createPR) {
            // PR flow: target B is purely the merge target, no commit goes to B.
            if (hasLiveSource && selectedBranch === sourceBranch) {
                alert('Целевая ветка PR должна отличаться от исходной (' + sourceBranch + ').');
                return;
            }
            // Need a commit destination — open the strategy dialog when:
            //   - no live source (force new), OR
            //   - the page is dirty (must save first)
            if (!hasLiveSource || isDirty) {
                setStrategyOpen(true);
                return;
            }
            // Clean + bound: just open the PR, no commit needed.
            onConfirm({
                branch: selectedBranch,
                stream: finalStream,
                replaceExisting: false,
                createPR: true,
                prStrategy: null,
            });
            return;
        }

        // Without PR — existing direct-commit flow.
        if (exists) {
            setConflict({ branch: selectedBranch, stream: finalStream });
            return;
        }
        onConfirm({ branch: selectedBranch, stream: finalStream, replaceExisting: false, createPR: false });
    }

    function handleStrategyConfirm(strategy) {
        setStrategyOpen(false);
        onConfirm({
            branch: selectedBranch,
            stream: streamName.trim(),
            replaceExisting: false,
            createPR: true,
            prStrategy: strategy,
        });
    }

    return (
        <>
            <div className="modal active branch-modal-overlay">
                <div className="modal-content branch-modal-content branch-modal-content--wide">
                    <div className="branch-hero">
                        <div className="branch-hero-icon"><i className="fas fa-share-square" /></div>
                        <div className="branch-hero-title">
                            <h3>Сохранить как</h3>
                            <p>Ветки — это папки сохранения. Выберите целевую ветку или создайте новую.</p>
                        </div>
                        <button className="branch-hero-close" onClick={onClose} aria-label="Закрыть">
                            <i className="fas fa-times" />
                        </button>
                    </div>

                    <div className="branch-modal-body branch-saveas-body">

                        <div className="branch-saveas-tree">
                            <div className="branch-saveas-tree-header">
                                <span><i className="fas fa-code-branch" /> Ветки</span>
                                <button className="branch-tree-add" onClick={() => setShowNewBranch(true)} title="Создать новую ветку">
                                    <i className="fas fa-folder-plus" /> Новая ветка
                                </button>
                            </div>
                            <div className="branch-tree-list">
                                {branchNames.map(b => {
                                    const sel = b === selectedBranch;
                                    const streams = listStreamsInBranch(b);
                                    return (
                                        <div key={b}>
                                            <button
                                                type="button"
                                                className={`branch-tree-folder${sel ? ' is-selected' : ''}`}
                                                onClick={() => setSelectedBranch(b)}
                                            >
                                                <i className={`fas fa-${sel ? 'folder-open' : 'folder'}`} />
                                                <span className="branch-tree-folder-name">{b}</span>
                                                <span className="branch-tree-folder-count">{streams.length}</span>
                                            </button>
                                            {sel && streams.length > 0 && (
                                                <div className="branch-tree-children">
                                                    {streams.map(s => {
                                                        const isCur = s === streamName.trim();
                                                        return (
                                                            <button
                                                                key={s}
                                                                type="button"
                                                                className={`branch-tree-stream${isCur ? ' is-selected' : ''}`}
                                                                onClick={() => setStreamName(s)}
                                                                title="Выбрать существующий поток (будет предложено заменить)"
                                                            >
                                                                <i className="fas fa-stream" />
                                                                <span>{s}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="branch-saveas-form">
                            <div className="branch-saveas-files">
                                <div className="branch-saveas-files-header">
                                    <span>
                                        <i className="fas fa-folder-open" /> Файлы потока
                                        {streamName.trim() && <code> etl/{streamName.trim()}/</code>}
                                    </span>
                                    <span className="branch-saveas-files-count">{streamFiles.length}</span>
                                </div>
                                <div className="branch-saveas-files-hint">
                                    <i className="fas fa-mouse-pointer" /> Двойной клик — открыть файл (только для просмотра)
                                </div>
                                <div className="branch-saveas-files-list">
                                    {streamFiles.length === 0 ? (
                                        <div className="branch-saveas-files-empty">
                                            <i className="fas fa-folder" />
                                            {streamName.trim()
                                                ? <>В ветке <strong>{selectedBranch}</strong> нет потока <code>{streamName.trim()}</code> — он будет создан при сохранении.</>
                                                : <>Выберите поток в дереве слева или введите имя ниже, чтобы увидеть его файлы.</>
                                            }
                                        </div>
                                    ) : streamFiles.map(({ relativePath, name }) => {
                                        const meta = extMeta(name);
                                        const path = `etl/${streamName.trim()}/${relativePath}`;
                                        const folder = relativePath.includes('/') ? relativePath.split('/').slice(0, -1).join('/') : null;
                                        return (
                                            <div
                                                key={relativePath}
                                                className="branch-saveas-file-row"
                                                title="Двойной клик — открыть для просмотра"
                                                onDoubleClick={() => setViewingFile({ path })}
                                            >
                                                <i className={meta.icon} style={{ color: meta.color }} />
                                                <span className="branch-saveas-file-name">
                                                    {folder && <span className="branch-saveas-file-folder">{folder}/</span>}
                                                    {name}
                                                </span>
                                                <button
                                                    type="button"
                                                    className="branch-saveas-file-open"
                                                    onClick={(e) => { e.stopPropagation(); setViewingFile({ path }); }}
                                                    title="Открыть"
                                                >
                                                    <i className="fas fa-eye" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="branch-saveas-info">
                        <i className="fas fa-info-circle" />
                        <span>
                            {createPR
                                ? <>Будет открыт <strong>Pull Request</strong> в <strong>{selectedBranch}</strong>. Коммит уйдёт в {hasLiveSource ? <>текущую ветку <strong>{sourceBranch}</strong></> : <>новую ветку</>} или в новую — выбор на следующем шаге.</>
                                : <>«Сохранить как» создаёт новый коммит в выбранной ветке (<strong>{selectedBranch}</strong>). Если папки нет — она будет создана.</>
                            }
                        </span>
                    </div>

                    <div className="branch-saveas-name-row">
                        <label htmlFor="branch-saveas-stream">Имя потока</label>
                        <div className="branch-saveas-name-wrap">
                            <input
                                id="branch-saveas-stream"
                                className="branch-input"
                                placeholder="orders"
                                value={streamName}
                                onChange={e => setStreamName(e.target.value)}
                                autoComplete="off"
                            />
                            <div className="branch-saveas-name-hint">
                                {streamName.trim() ? (
                                    <>Будет сохранено в <code>etl/{streamName.trim()}/</code>{!createPR && exists && <span className="branch-warn"> — поток уже существует</span>}</>
                                ) : (
                                    <span style={{ opacity: 0.7 }}>Латиница, цифры, дефис и подчёркивание</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <label className="branch-pr-checkbox-row">
                        <input
                            type="checkbox"
                            checked={createPR}
                            onChange={e => setCreatePR(e.target.checked)}
                        />
                        <span className="branch-pr-checkbox-text">
                            <strong>Создать Pull Request</strong>
                            <span>Не коммитить в <code>{selectedBranch}</code> напрямую — открыть PR на ревью.</span>
                        </span>
                        <i className="fas fa-code-branch" />
                    </label>

                    <div className="branch-modal-footer">
                        <button className="branch-btn-secondary" onClick={onClose}>Отмена</button>
                        <button className="branch-btn-primary" onClick={attemptSave} disabled={!streamName.trim()}>
                            <i className={createPR ? 'fas fa-code-branch' : 'fas fa-save'} />
                            {createPR
                                ? <>Открыть PR в {selectedBranch}</>
                                : <>Сохранить в {selectedBranch}</>
                            }
                        </button>
                    </div>
                </div>
            </div>

            <NewBranchDialog
                open={showNewBranch}
                branchNames={branchNames}
                defaultParent={selectedBranch}
                onClose={() => setShowNewBranch(false)}
                onConfirm={({ name, parent }) => {
                    const created = onCreateBranch(name, parent);
                    if (created) setSelectedBranch(created);
                    setShowNewBranch(false);
                }}
            />

            <ConflictDialog
                open={!!conflict}
                branch={conflict?.branch}
                stream={conflict?.stream}
                onCancel={() => setConflict(null)}
                onReplace={() => {
                    onConfirm({ branch: conflict.branch, stream: conflict.stream, replaceExisting: true });
                    setConflict(null);
                }}
            />

            <FileViewerModal
                open={!!viewingFile}
                branchName={selectedBranch}
                path={viewingFile?.path}
                content={viewingContent}
                onClose={() => setViewingFile(null)}
            />

            <PRStrategyDialog
                open={strategyOpen}
                sourceBranch={hasLiveSource ? sourceBranch : null}
                hasSource={hasLiveSource}
                forceNew={!hasLiveSource}
                isDirty={isDirty}
                prTargetBranch={selectedBranch}
                branchNames={branchNames}
                onCancel={() => setStrategyOpen(false)}
                onConfirm={handleStrategyConfirm}
            />
        </>
    );
}
