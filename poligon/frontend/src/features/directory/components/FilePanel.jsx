import { useState, useEffect } from 'react';
import { C } from '../constants';

const LANG_MAP = {
    sql: 'SQL', yml: 'YAML', yaml: 'YAML', json: 'JSON',
    java: 'Java', scala: 'Scala', xml: 'XML', xlsx: 'Binary', md: 'Markdown',
};

function getLang(path) {
    const ext = path.split('.').pop().toLowerCase();
    return LANG_MAP[ext] || 'Text';
}

function ActionBtn({ icon, title, onClick, active, danger }) {
    const [hovered, setHovered] = useState(false);
    return (
        <button
            onClick={onClick} title={title}
            style={{
                width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: active ? C.accentBg : hovered ? C.bgHover : 'transparent',
                border: `1px solid ${active ? C.accent : hovered ? C.border : C.borderFaint}`,
                borderRadius: 5,
                color: active ? C.accent : danger ? (hovered ? C.red : C.textMuted) : hovered ? C.text : C.textMuted,
                cursor: 'pointer', transition: 'all 0.12s ease', flexShrink: 0,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <i className={icon} style={{ fontSize: 11 }} />
        </button>
    );
}

export default function FilePanel({ repoName, selectedPath, content, onSave, onDelete, onCreateFile }) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState('');

    useEffect(() => {
        setEditing(false);
        setDraft(content || '');
    }, [selectedPath, content]);

    function handleEditToggle() {
        if (editing) {
            onSave(selectedPath, draft);
        } else {
            setDraft(content || '');
        }
        setEditing(e => !e);
    }

    const lines = (content || '').split('\n');
    const lineCount = lines.length;
    const charCount = (content || '').length;

    if (!selectedPath) {
        return (
            <div style={{
                flex: 1, background: C.bg, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 14,
                borderRight: `1px solid ${C.border}`,
            }}>
                <div style={{
                    width: 56, height: 56, borderRadius: 14, background: C.bgElevated,
                    border: `1px solid ${C.borderFaint}`, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    <i className="far fa-file-code" style={{ fontSize: 22, color: C.textMuted }} />
                </div>
                <div style={{ textAlign: 'center', maxWidth: 240 }}>
                    <div style={{ fontFamily: C.syne, fontSize: 15, fontWeight: 600, color: C.textSecondary, marginBottom: 6, letterSpacing: '-0.01em' }}>
                        No file open
                    </div>
                    <div style={{ fontFamily: C.mono, fontSize: 12, color: C.textMuted, lineHeight: 1.6 }}>
                        Select a file from the tree to view its contents
                    </div>
                </div>
                <button
                    onClick={onCreateFile}
                    style={{
                        marginTop: 4, padding: '7px 16px', background: 'transparent',
                        border: `1px solid ${C.border}`, borderRadius: 6,
                        color: C.accent, fontFamily: C.mono, fontSize: 12, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 7,
                        transition: 'border-color 0.15s ease, background 0.15s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.background = C.accentBg; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = 'transparent'; }}
                >
                    <i className="fas fa-plus" style={{ fontSize: 10 }} />
                    New file
                </button>
            </div>
        );
    }

    const breadcrumbs = selectedPath.split('/');
    const lang = getLang(selectedPath);

    return (
        <div style={{ flex: 1, background: C.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: `1px solid ${C.border}` }}>
            {/* Path bar */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '9px 14px', borderBottom: `1px solid ${C.borderFaint}`,
                background: C.bgElevated, flexShrink: 0, gap: 12, minHeight: 44,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontFamily: C.mono, fontSize: 12, overflow: 'hidden', minWidth: 0, flex: 1 }}>
                    <span style={{ color: C.textMuted, flexShrink: 0 }}>{repoName}</span>
                    {breadcrumbs.map((part, i) => (
                        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: i < breadcrumbs.length - 1 ? 0 : 1, minWidth: 0, overflow: i === breadcrumbs.length - 1 ? 'hidden' : 'visible' }}>
                            <span style={{ color: C.textMuted }}>/</span>
                            <span style={{
                                color: i === breadcrumbs.length - 1 ? C.text : C.textSecondary,
                                fontWeight: i === breadcrumbs.length - 1 ? 500 : 400,
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                                {part}
                            </span>
                        </span>
                    ))}
                    <span style={{
                        marginLeft: 8, padding: '1px 7px', background: C.bgHover,
                        border: `1px solid ${C.borderFaint}`, borderRadius: 4,
                        color: C.textMuted, fontSize: 10, fontFamily: C.syne,
                        textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0,
                    }}>
                        {lang}
                    </span>
                </div>

                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    <ActionBtn icon="far fa-file" title="New file" onClick={onCreateFile} />
                    <ActionBtn icon={editing ? 'fas fa-check' : 'fas fa-pencil-alt'} title={editing ? 'Save' : 'Edit'} onClick={handleEditToggle} active={editing} />
                    <ActionBtn icon="far fa-trash-alt" title="Delete file" onClick={() => onDelete(selectedPath)} danger />
                </div>
            </div>

            {/* Content area */}
            <div className="git-scrollbar" style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
                {editing ? (
                    <textarea
                        value={draft}
                        onChange={e => setDraft(e.target.value)}
                        style={{
                            position: 'absolute', inset: 0, width: '100%', height: '100%',
                            background: 'rgba(88, 166, 255, 0.02)', border: 'none', outline: 'none',
                            resize: 'none', padding: '14px 16px 14px 56px',
                            fontFamily: C.mono, fontSize: 13, lineHeight: '22px',
                            color: C.text, boxSizing: 'border-box', caretColor: C.accent,
                        }}
                        spellCheck={false}
                        autoFocus
                    />
                ) : (
                    <div style={{ paddingTop: 6, paddingBottom: 20 }}>
                        {lines.map((line, i) => (
                            <div key={i} style={{ display: 'flex', minHeight: 22 }}>
                                <span style={{
                                    width: 44, flexShrink: 0, fontFamily: C.mono, fontSize: 12,
                                    color: C.textMuted, userSelect: 'none', textAlign: 'right',
                                    paddingRight: 16, lineHeight: '22px', opacity: 0.5,
                                }}>
                                    {i + 1}
                                </span>
                                <span style={{
                                    fontFamily: C.mono, fontSize: 13, color: C.text,
                                    lineHeight: '22px', flex: 1, whiteSpace: 'pre',
                                    paddingRight: 24,
                                }}>
                                    {line || '\u00A0'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Status bar */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '4px 16px',
                borderTop: `1px solid ${C.borderFaint}`, background: C.bgElevated, flexShrink: 0,
            }}>
                <span style={{ fontFamily: C.mono, fontSize: 11, color: C.textMuted }}>{lineCount} lines</span>
                <span style={{ fontFamily: C.mono, fontSize: 11, color: C.textMuted }}>{charCount} chars</span>
                {editing && (
                    <span style={{ fontFamily: C.syne, fontSize: 11, color: C.orange, marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ width: 6, height: 6, background: C.orange, borderRadius: '50%', display: 'inline-block', animation: 'gitPulse 1.4s ease infinite' }} />
                        Unsaved changes
                    </span>
                )}
            </div>
        </div>
    );
}
