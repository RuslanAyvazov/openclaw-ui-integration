import { useEffect, useState } from 'react';
import { C } from '../constants';

const STATUS_META = {
    open:     { label: 'Открыт',  color: '#27ae60', bg: 'rgba(39,174,96,0.10)',  border: 'rgba(39,174,96,0.25)' },
    approved: { label: 'Одобрен', color: '#3498db', bg: 'rgba(52,152,219,0.10)', border: 'rgba(52,152,219,0.25)' },
    rejected: { label: 'Отклонён', color: '#e74c3c', bg: 'rgba(231,76,60,0.10)', border: 'rgba(231,76,60,0.25)' },
    merged:   { label: 'Влит',    color: '#8e44ad', bg: 'rgba(142,68,173,0.10)', border: 'rgba(142,68,173,0.25)' },
};

const FILTERS = [
    { key: 'open',     label: 'Открытые' },
    { key: 'approved', label: 'Одобренные' },
    { key: 'rejected', label: 'Отклонённые' },
    { key: 'all',      label: 'Все' },
];

function formatRel(iso) {
    if (!iso) return '';
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return 'только что';
    if (diff < 3600) return `${Math.round(diff / 60)} мин назад`;
    if (diff < 86400) return `${Math.round(diff / 3600)} ч назад`;
    return `${Math.round(diff / 86400)} дн назад`;
}

function StatusBadge({ status }) {
    const m = STATUS_META[status] || STATUS_META.open;
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '1px 7px', borderRadius: 20,
            fontFamily: C.mono, fontSize: 10, fontWeight: 600,
            color: m.color, background: m.bg, border: `1px solid ${m.border}`,
        }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: m.color }} />
            {m.label}
        </span>
    );
}

function Avatar({ initials, size = 22 }) {
    return (
        <div style={{
            width: size, height: size, borderRadius: '50%', flexShrink: 0,
            background: '#d6eaf8', color: '#2980b9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: C.syne, fontSize: size * 0.36, fontWeight: 700, letterSpacing: '0.04em',
        }}>{initials}</div>
    );
}

function PullRequestCard({ pr, onOpen, idx }) {
    const [hov, setHov] = useState(false);
    return (
        <div
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            onClick={onOpen}
            style={{
                padding: '10px 12px', borderBottom: `1px solid ${C.borderFaint}`,
                background: hov ? C.bgHover : 'transparent', cursor: 'pointer',
                transition: 'background 0.1s',
                animation: `gitFadeIn 0.18s ease ${idx * 35}ms both`,
            }}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <Avatar initials={pr.author.initials} />
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <span style={{ fontFamily: C.mono, fontSize: 10.5, color: C.textMuted }}>#{pr.number}</span>
                        <StatusBadge status={pr.status} />
                    </div>
                    <div style={{
                        fontFamily: C.syne, fontSize: 12.5, fontWeight: 500, color: C.text, lineHeight: 1.35,
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        marginBottom: 5,
                    }}>{pr.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: C.mono, fontSize: 10.5, color: C.accent, padding: '0 5px', background: C.accentBg, borderRadius: 3 }}>{pr.sourceBranch}</span>
                        <i className="fas fa-arrow-right" style={{ fontSize: 7, color: C.textMuted }} />
                        <span style={{ fontFamily: C.mono, fontSize: 10.5, color: C.textSecondary, padding: '0 5px', background: C.bgElevated, borderRadius: 3 }}>{pr.targetBranch}</span>
                        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                            {pr.comments.length > 0 && (
                                <span style={{ fontFamily: C.mono, fontSize: 10.5, color: C.textMuted, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                                    <i className="far fa-comment" style={{ fontSize: 9 }} /> {pr.comments.length}
                                </span>
                            )}
                            <span style={{ fontFamily: C.syne, fontSize: 10.5, color: C.textMuted }}>{formatRel(pr.createdAt)}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CommentItem({ comment }) {
    return (
        <div style={{ display: 'flex', gap: 8, padding: '8px 10px', borderBottom: `1px solid ${C.borderFaint}` }}>
            <Avatar initials={comment.initials} size={24} />
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 3 }}>
                    <span style={{ fontFamily: C.syne, fontSize: 11.5, fontWeight: 600, color: C.text }}>{comment.author}</span>
                    <span style={{ fontFamily: C.syne, fontSize: 10, color: C.textMuted }}>{formatRel(comment.createdAt)}</span>
                </div>
                <div style={{ fontFamily: C.mono, fontSize: 11.5, color: C.text, lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {comment.text}
                </div>
            </div>
        </div>
    );
}

function PullRequestDetail({ pr, onBack, onApprove, onReject, onComment }) {
    const [comment, setComment] = useState('');
    const [actionMode, setActionMode] = useState(null); // 'approve' | 'reject' | null
    const [actionComment, setActionComment] = useState('');
    const isOpen = pr.status === 'open';

    function submitAction() {
        if (actionMode === 'approve') onApprove(pr.id, actionComment);
        else if (actionMode === 'reject') {
            if (!actionComment.trim()) { alert('Для отклонения укажите причину в комментарии.'); return; }
            onReject(pr.id, actionComment);
        }
        setActionMode(null); setActionComment('');
    }

    function submitComment() {
        if (!comment.trim()) return;
        onComment(pr.id, comment);
        setComment('');
    }

    const m = STATUS_META[pr.status] || STATUS_META.open;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            {/* Detail header */}
            <div style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}`, flexShrink: 0, background: '#fff' }}>
                <button onClick={onBack} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '3px 7px', background: 'transparent', border: 'none',
                    color: C.textSecondary, fontFamily: C.syne, fontSize: 11, cursor: 'pointer',
                    borderRadius: 4, transition: 'background 0.1s',
                }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.bgHover; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                    <i className="fas fa-chevron-left" style={{ fontSize: 9 }} /> К списку
                </button>
                <div style={{ marginTop: 6, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <Avatar initials={pr.author.initials} size={28} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                            <span style={{ fontFamily: C.mono, fontSize: 11, color: C.textMuted }}>#{pr.number}</span>
                            <StatusBadge status={pr.status} />
                        </div>
                        <div style={{ fontFamily: C.syne, fontSize: 14, fontWeight: 600, color: C.text, lineHeight: 1.3, marginBottom: 5 }}>{pr.title}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap', fontFamily: C.mono, fontSize: 10.5 }}>
                            <span style={{ color: C.accent, padding: '1px 6px', background: C.accentBg, borderRadius: 3 }}>{pr.sourceBranch}</span>
                            <i className="fas fa-arrow-right" style={{ fontSize: 7, color: C.textMuted }} />
                            <span style={{ color: C.textSecondary, padding: '1px 6px', background: C.bgElevated, borderRadius: 3 }}>{pr.targetBranch}</span>
                            <span style={{ color: C.textMuted, marginLeft: 'auto' }}>{formatRel(pr.createdAt)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="git-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: 0 }}>
                {pr.description && (
                    <div style={{ padding: '10px 12px', borderBottom: `1px solid ${C.borderFaint}`, background: C.bgElevated }}>
                        <div style={{ fontFamily: C.syne, fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 5 }}>Описание</div>
                        <div style={{ fontFamily: C.mono, fontSize: 11.5, color: C.text, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                            {pr.description}
                        </div>
                    </div>
                )}

                <div style={{ padding: '8px 12px', borderBottom: `1px solid ${C.borderFaint}`, display: 'flex', gap: 14, fontFamily: C.mono, fontSize: 11 }}>
                    <span style={{ color: C.green }}><i className="fas fa-plus" style={{ fontSize: 8, marginRight: 4 }} />{pr.additions}</span>
                    <span style={{ color: C.red }}><i className="fas fa-minus" style={{ fontSize: 8, marginRight: 4 }} />{pr.deletions}</span>
                    <span style={{ color: C.textMuted, marginLeft: 'auto' }}>{pr.changedFiles} файл{pr.changedFiles !== 1 ? 'а' : ''}</span>
                </div>

                <div style={{ padding: '8px 12px 4px', fontFamily: C.syne, fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Комментарии {pr.comments.length > 0 && <span style={{ color: C.textSecondary }}>({pr.comments.length})</span>}
                </div>
                {pr.comments.length === 0 && (
                    <div style={{ padding: '6px 12px 10px', fontFamily: C.mono, fontSize: 11, color: C.textMuted, fontStyle: 'italic' }}>Комментариев пока нет.</div>
                )}
                {pr.comments.map(c => <CommentItem key={c.id} comment={c} />)}
            </div>

            {/* Actions */}
            {isOpen && (
                <div style={{ padding: 10, borderTop: `1px solid ${C.border}`, background: '#fff', flexShrink: 0 }}>
                    {actionMode ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <textarea
                                value={actionComment} onChange={e => setActionComment(e.target.value)}
                                placeholder={actionMode === 'approve' ? 'Комментарий (необязательно)…' : 'Причина отклонения (обязательно)…'}
                                style={{
                                    width: '100%', minHeight: 64, padding: 8,
                                    fontFamily: C.mono, fontSize: 11.5, color: C.text,
                                    border: `1.5px solid ${C.border}`, borderRadius: 6,
                                    background: '#fafbfc', outline: 'none', resize: 'vertical',
                                    boxSizing: 'border-box',
                                }}
                                onFocus={e => { e.target.style.borderColor = C.accent; e.target.style.background = '#fff'; }}
                                onBlur={e => { e.target.style.borderColor = C.border; e.target.style.background = '#fafbfc'; }}
                            />
                            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                <button onClick={() => { setActionMode(null); setActionComment(''); }} style={{
                                    padding: '6px 12px', background: 'transparent', border: `1px solid ${C.border}`,
                                    borderRadius: 5, fontFamily: C.syne, fontSize: 11.5, color: C.textSecondary, cursor: 'pointer',
                                }}>Отмена</button>
                                <button onClick={submitAction} style={{
                                    padding: '6px 12px',
                                    background: actionMode === 'approve' ? '#27ae60' : '#e74c3c',
                                    border: 'none', borderRadius: 5,
                                    fontFamily: C.syne, fontSize: 11.5, fontWeight: 600, color: '#fff', cursor: 'pointer',
                                }}>
                                    {actionMode === 'approve' ? 'Одобрить' : 'Отклонить'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                                <button onClick={() => setActionMode('approve')} style={{
                                    flex: 1, padding: '6px 10px', background: '#27ae60', border: 'none',
                                    borderRadius: 5, fontFamily: C.syne, fontSize: 11.5, fontWeight: 600, color: '#fff',
                                    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                                }}>
                                    <i className="fas fa-check" style={{ fontSize: 10 }} /> Одобрить
                                </button>
                                <button onClick={() => setActionMode('reject')} style={{
                                    flex: 1, padding: '6px 10px', background: '#e74c3c', border: 'none',
                                    borderRadius: 5, fontFamily: C.syne, fontSize: 11.5, fontWeight: 600, color: '#fff',
                                    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                                }}>
                                    <i className="fas fa-times" style={{ fontSize: 10 }} /> Отклонить
                                </button>
                            </div>
                            <div style={{ display: 'flex', gap: 6 }}>
                                <input
                                    value={comment} onChange={e => setComment(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') submitComment(); }}
                                    placeholder="Добавить комментарий…"
                                    style={{
                                        flex: 1, padding: '6px 10px', fontFamily: C.mono, fontSize: 11.5, color: C.text,
                                        border: `1px solid ${C.border}`, borderRadius: 5, background: C.bgElevated,
                                        outline: 'none', boxSizing: 'border-box',
                                    }}
                                    onFocus={e => { e.target.style.borderColor = C.accent; e.target.style.background = '#fff'; }}
                                    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.background = C.bgElevated; }}
                                />
                                <button onClick={submitComment} disabled={!comment.trim()} style={{
                                    padding: '6px 10px', background: comment.trim() ? C.accent : C.bgElevated,
                                    border: `1px solid ${comment.trim() ? C.accent : C.border}`, borderRadius: 5,
                                    fontFamily: C.syne, fontSize: 11.5, fontWeight: 600,
                                    color: comment.trim() ? '#fff' : C.textMuted,
                                    cursor: comment.trim() ? 'pointer' : 'default',
                                }}>
                                    <i className="fas fa-paper-plane" style={{ fontSize: 10 }} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

function CreatePullRequestForm({ branches, activeBranch, onCreate, onCancel }) {
    const branchNames = Object.keys(branches);
    const [source, setSource] = useState(activeBranch !== 'main' ? activeBranch : (branchNames.find(b => b !== 'main') || activeBranch));
    const [target, setTarget] = useState('main');
    const [title, setTitle]   = useState('');
    const [desc, setDesc]     = useState('');

    function submit() {
        if (!title.trim()) { alert('Введите заголовок PR'); return; }
        if (source === target) { alert('Source и target ветки должны быть разными'); return; }
        onCreate({ title, description: desc, sourceBranch: source, targetBranch: target });
    }

    return (
        <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10, height: '100%', overflowY: 'auto' }}>
            <div>
                <div style={{ fontFamily: C.syne, fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Из ветки</div>
                <select value={source} onChange={e => setSource(e.target.value)} style={{
                    width: '100%', padding: '6px 8px', fontFamily: C.mono, fontSize: 12,
                    border: `1px solid ${C.border}`, borderRadius: 5, background: C.bgElevated, outline: 'none',
                }}>
                    {branchNames.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
            </div>
            <div>
                <div style={{ fontFamily: C.syne, fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>В ветку</div>
                <select value={target} onChange={e => setTarget(e.target.value)} style={{
                    width: '100%', padding: '6px 8px', fontFamily: C.mono, fontSize: 12,
                    border: `1px solid ${C.border}`, borderRadius: 5, background: C.bgElevated, outline: 'none',
                }}>
                    {branchNames.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
            </div>
            <div>
                <div style={{ fontFamily: C.syne, fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Заголовок</div>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="feat: краткое описание" style={{
                    width: '100%', padding: '6px 8px', fontFamily: C.mono, fontSize: 12,
                    border: `1px solid ${C.border}`, borderRadius: 5, background: C.bgElevated, outline: 'none',
                    boxSizing: 'border-box',
                }} />
            </div>
            <div>
                <div style={{ fontFamily: C.syne, fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Описание</div>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Подробности изменений…" style={{
                    width: '100%', minHeight: 90, padding: 8, fontFamily: C.mono, fontSize: 11.5,
                    border: `1px solid ${C.border}`, borderRadius: 5, background: C.bgElevated, outline: 'none',
                    boxSizing: 'border-box', resize: 'vertical',
                }} />
            </div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', marginTop: 'auto' }}>
                <button onClick={onCancel} style={{
                    padding: '6px 12px', background: 'transparent', border: `1px solid ${C.border}`,
                    borderRadius: 5, fontFamily: C.syne, fontSize: 11.5, color: C.textSecondary, cursor: 'pointer',
                }}>Отмена</button>
                <button onClick={submit} style={{
                    padding: '6px 14px', background: C.accent, border: 'none', borderRadius: 5,
                    fontFamily: C.syne, fontSize: 11.5, fontWeight: 600, color: '#fff', cursor: 'pointer',
                }}>Создать PR</button>
            </div>
        </div>
    );
}

export default function PullRequestsView({ pullRequests, branches, activeBranch, onApprove, onReject, onComment, onCreate }) {
    const [filter, setFilter] = useState('open');
    const [activeId, setActiveId] = useState(null);
    const [creating, setCreating] = useState(false);

    const filtered = filter === 'all' ? pullRequests : pullRequests.filter(pr => pr.status === filter);
    const counts = pullRequests.reduce((acc, pr) => { acc[pr.status] = (acc[pr.status] || 0) + 1; return acc; }, {});
    const active = pullRequests.find(pr => pr.id === activeId);

    // Reset detail if PR changes
    useEffect(() => {
        if (activeId && !pullRequests.find(pr => pr.id === activeId)) setActiveId(null);
    }, [pullRequests, activeId]);

    if (creating) {
        return (
            <CreatePullRequestForm
                branches={branches} activeBranch={activeBranch}
                onCreate={(data) => { onCreate(data); setCreating(false); }}
                onCancel={() => setCreating(false)}
            />
        );
    }

    if (active) {
        return (
            <PullRequestDetail
                pr={active}
                onBack={() => setActiveId(null)}
                onApprove={onApprove}
                onReject={onReject}
                onComment={onComment}
            />
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            {/* Filter strip + create button */}
            <div style={{
                padding: '8px 10px', borderBottom: `1px solid ${C.borderFaint}`,
                display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', flexShrink: 0,
            }}>
                {FILTERS.map(f => {
                    const active = filter === f.key;
                    const count = f.key === 'all' ? pullRequests.length : (counts[f.key] || 0);
                    return (
                        <button key={f.key} onClick={() => setFilter(f.key)} style={{
                            padding: '3px 8px', background: active ? C.accent : C.bgElevated,
                            border: `1px solid ${active ? C.accent : C.border}`, borderRadius: 20,
                            fontFamily: C.syne, fontSize: 10.5, fontWeight: 600,
                            color: active ? '#fff' : C.textSecondary, cursor: 'pointer',
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            transition: 'all 0.1s',
                        }}>
                            {f.label}
                            <span style={{
                                fontFamily: C.mono, fontSize: 9.5, padding: '0 4px',
                                background: active ? 'rgba(255,255,255,0.25)' : '#fff',
                                color: active ? '#fff' : C.textMuted,
                                borderRadius: 8, minWidth: 14, textAlign: 'center',
                            }}>{count}</span>
                        </button>
                    );
                })}
                <button onClick={() => setCreating(true)} title="Новый PR" style={{
                    marginLeft: 'auto', width: 24, height: 24, padding: 0,
                    background: C.accent, border: 'none', borderRadius: 5, color: '#fff',
                    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <i className="fas fa-plus" style={{ fontSize: 9 }} />
                </button>
            </div>

            {/* List */}
            <div className="git-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
                {filtered.length === 0 ? (
                    <div style={{ padding: '20px 14px', textAlign: 'center' }}>
                        <i className="fas fa-code-branch" style={{ fontSize: 22, color: C.textMuted, opacity: 0.5, marginBottom: 8 }} />
                        <div style={{ fontFamily: C.syne, fontSize: 12, color: C.textSecondary }}>
                            Нет PR в выбранном фильтре
                        </div>
                    </div>
                ) : filtered.map((pr, i) => (
                    <PullRequestCard key={pr.id} pr={pr} idx={i} onOpen={() => setActiveId(pr.id)} />
                ))}
            </div>
        </div>
    );
}
