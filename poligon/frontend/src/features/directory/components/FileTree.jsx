import { useState, useRef, useEffect } from 'react';
import { C } from '../constants';

const EXT_META = {
    sql:   { icon: 'fas fa-database',    color: '#2980b9' },
    scala: { icon: 'fas fa-code',        color: '#8e44ad' },
    java:  { icon: 'fab fa-java',        color: '#e67e22' },
    yml:   { icon: 'fas fa-cog',         color: '#27ae60' },
    yaml:  { icon: 'fas fa-cog',         color: '#27ae60' },
    json:  { icon: 'fas fa-align-left',  color: '#d4a017' },
    xml:   { icon: 'fas fa-code',        color: '#e67e22' },
    xlsx:  { icon: 'fas fa-table',       color: '#27ae60' },
    md:    { icon: 'fas fa-book-open',   color: '#7f8c8d' },
};

function extMeta(name) {
    const ext = name.split('.').pop().toLowerCase();
    return EXT_META[ext] || { icon: 'fas fa-file-code', color: '#7f8c8d' };
}

// Vertical guide line for indentation
function IndentGuide({ depth }) {
    return Array.from({ length: depth }).map((_, i) => (
        <span key={i} style={{
            position: 'absolute',
            left: 12 + i * 16 + 7,
            top: 0, bottom: 0,
            width: 1,
            background: C.borderFaint,
            pointerEvents: 'none',
        }} />
    ));
}

function BranchOption({ name, isActive, onSelect, onDelete, delay }) {
    const [hov, setHov] = useState(false);
    return (
        <div
            style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
                background: hov ? C.bgHover : isActive ? C.accentBg : 'transparent',
                cursor: 'pointer', transition: 'background 0.1s ease',
            }}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        >
            <i className="fas fa-check" style={{ fontSize: 9, color: isActive ? C.accent : 'transparent', width: 10, flexShrink: 0 }} />
            <span style={{ flex: 1, fontFamily: C.mono, fontSize: 12, color: isActive ? C.accent : C.text }} onClick={onSelect}>
                {name}
            </span>
            {name !== 'main' && (
                <button onClick={e => { e.stopPropagation(); onDelete(); }}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.textMuted, fontSize: 11, lineHeight: 1, padding: '1px 3px', borderRadius: 3, transition: 'color 0.1s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = C.red; }}
                    onMouseLeave={e => { e.currentTarget.style.color = C.textMuted; }}
                >
                    <i className="fas fa-times" />
                </button>
            )}
        </div>
    );
}

function BranchSelector({ branches, activeBranch, onSwitch, onCreate, onDelete }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!open) return;
        const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [open]);

    return (
        <div style={{ position: 'relative' }} ref={ref}>
            <button onClick={() => setOpen(o => !o)} style={{
                display: 'flex', alignItems: 'center', gap: 7, width: '100%',
                padding: '5px 10px', background: C.bgElevated, border: `1px solid ${C.border}`,
                borderRadius: 6, color: C.text, fontFamily: C.mono, fontSize: 12,
                cursor: 'pointer', transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}
            >
                <i className="fas fa-code-branch" style={{ color: C.accent, fontSize: 10 }} />
                <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activeBranch}</span>
                <i className="fas fa-chevron-down" style={{ fontSize: 8, color: C.textMuted, transform: open ? 'rotate(180deg)' : 'none', transition: `transform 0.18s ${C.ease}` }} />
            </button>

            {open && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 5px)', left: 0, right: 0, zIndex: 300,
                    background: '#fff', border: `1px solid ${C.border}`, borderRadius: 8,
                    boxShadow: '0 6px 20px rgba(44,62,80,0.12)', overflow: 'hidden',
                    animation: `gitSlideDown 0.14s ${C.ease} both`,
                }}>
                    {Object.keys(branches).map((name, i) => (
                        <BranchOption key={name} name={name} isActive={name === activeBranch} delay={i * 25}
                            onSelect={() => { onSwitch(name); setOpen(false); }}
                            onDelete={() => { onDelete(name); setOpen(false); }}
                        />
                    ))}
                    <button onClick={() => { onCreate(); setOpen(false); }} style={{
                        display: 'flex', alignItems: 'center', gap: 7, width: '100%',
                        padding: '8px 12px', background: 'transparent', border: 'none',
                        borderTop: `1px solid ${C.borderFaint}`, color: C.accent,
                        fontFamily: C.mono, fontSize: 12, cursor: 'pointer', transition: 'background 0.1s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.background = C.bgHover; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                        <i className="fas fa-plus" style={{ fontSize: 9 }} /> New branch
                    </button>
                </div>
            )}
        </div>
    );
}

function TreeNode({ node, nodePath, depth, collapsedFolders, selectedPath, searchTerm, onToggle, onSelect }) {
    const isFolder = node.type === 'folder';
    const isActive = !isFolder && nodePath === selectedPath;
    const isCollapsed = isFolder && collapsedFolders.has(nodePath);
    const [hov, setHov] = useState(false);
    const meta = isFolder ? null : extMeta(node.name);
    const indent = 12 + depth * 16;

    function renderName(name) {
        if (!searchTerm || !name.toLowerCase().includes(searchTerm.toLowerCase())) return name;
        const i = name.toLowerCase().indexOf(searchTerm.toLowerCase());
        return (
            <>{name.slice(0, i)}
                <mark style={{ background: 'rgba(230,126,34,0.22)', color: C.orange, borderRadius: 2, padding: '0 1px' }}>
                    {name.slice(i, i + searchTerm.length)}
                </mark>
                {name.slice(i + searchTerm.length)}
            </>
        );
    }

    return (
        <>
            <div style={{ position: 'relative' }}>
                <IndentGuide depth={depth} />
                <div
                    style={{
                        position: 'relative', display: 'flex', alignItems: 'center', gap: 5,
                        height: 26, paddingLeft: indent, paddingRight: 10,
                        cursor: 'pointer', userSelect: 'none',
                        background: isActive ? C.accentBg : hov ? C.bgHover : 'transparent',
                        borderLeft: isActive ? `2px solid ${C.accent}` : '2px solid transparent',
                        transition: 'background 0.1s, border-color 0.1s',
                    }}
                    onMouseEnter={() => setHov(true)}
                    onMouseLeave={() => setHov(false)}
                    onClick={() => isFolder ? onToggle(nodePath) : onSelect(nodePath)}
                    title={nodePath}
                >
                    {/* Folder arrow */}
                    <span style={{
                        width: 12, height: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        transform: isFolder ? (isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)') : 'none',
                        transition: `transform 0.16s ${C.ease}`,
                        opacity: isFolder ? 1 : 0, fontSize: 8, color: C.textMuted,
                    }}>
                        {isFolder && <i className="fas fa-chevron-right" />}
                    </span>

                    {/* Icon */}
                    {isFolder
                        ? <i className={isCollapsed ? 'fas fa-folder' : 'fas fa-folder-open'} style={{ fontSize: 13, color: '#e8a838', flexShrink: 0 }} />
                        : <i className={meta.icon} style={{ fontSize: 12, color: meta.color, flexShrink: 0 }} />
                    }

                    {/* Name */}
                    <span style={{
                        fontFamily: C.mono, fontSize: 12.5, color: isActive ? C.accent : C.text,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
                        fontWeight: isActive ? 500 : 400,
                    }}>
                        {renderName(node.name)}
                    </span>

                    {/* Ext badge on hover for files */}
                    {!isFolder && hov && (
                        <span style={{
                            fontFamily: C.mono, fontSize: 10, color: C.textMuted,
                            background: C.bgElevated, border: `1px solid ${C.borderFaint}`,
                            borderRadius: 3, padding: '0 4px', flexShrink: 0,
                        }}>
                            {node.name.split('.').pop()}
                        </span>
                    )}
                </div>
            </div>

            {isFolder && node.children && (
                <div style={{
                    overflow: 'hidden',
                    maxHeight: isCollapsed ? 0 : 2400,
                    opacity: isCollapsed ? 0 : 1,
                    transition: `max-height 0.26s ${C.ease}, opacity 0.18s ease`,
                }}>
                    {node.children.map(child => {
                        const cp = nodePath ? `${nodePath}/${child.name}` : child.name;
                        return (
                            <TreeNode key={cp} node={child} nodePath={cp} depth={depth + 1}
                                collapsedFolders={collapsedFolders} selectedPath={selectedPath}
                                searchTerm={searchTerm} onToggle={onToggle} onSelect={onSelect}
                            />
                        );
                    })}
                </div>
            )}
        </>
    );
}

export default function FileTree({ structure, branches, activeBranch, collapsedFolders, selectedPath, searchTerm, onFileSelect, onFolderToggle, onBranchSwitch, onBranchCreate, onBranchDelete, onSearchChange, onCreateFile, width }) {
    return (
        <div className="git-scrollbar" style={{
            width, minWidth: width, flexShrink: 0, background: C.bg,
            borderRight: `1px solid ${C.border}`,
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
            {/* Header */}
            <div style={{
                padding: '10px 12px 8px', borderBottom: `1px solid ${C.borderFaint}`,
                display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0,
            }}>
                <i className="fab fa-github" style={{ fontSize: 14, color: C.textSecondary }} />
                <span style={{ fontFamily: C.mono, fontSize: 11.5, color: C.text, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                    {structure.repo}
                </span>
                <button onClick={onCreateFile} title="Новый файл" style={{
                    width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 4,
                    color: C.textMuted, cursor: 'pointer', flexShrink: 0, transition: 'all 0.12s',
                }}
                    onMouseEnter={e => { e.currentTarget.style.color = C.accent; e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.background = C.accentBg; }}
                    onMouseLeave={e => { e.currentTarget.style.color = C.textMuted; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = 'transparent'; }}
                >
                    <i className="fas fa-plus" style={{ fontSize: 9 }} />
                </button>
            </div>

            {/* Branch */}
            <div style={{ padding: '8px 10px 6px', borderBottom: `1px solid ${C.borderFaint}`, flexShrink: 0 }}>
                <BranchSelector branches={branches} activeBranch={activeBranch}
                    onSwitch={onBranchSwitch} onCreate={onBranchCreate} onDelete={onBranchDelete}
                />
            </div>

            {/* Search */}
            <div style={{ padding: '6px 10px 6px', borderBottom: `1px solid ${C.borderFaint}`, flexShrink: 0 }}>
                <div style={{ position: 'relative' }}>
                    <i className="fas fa-search" style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: C.textMuted, pointerEvents: 'none' }} />
                    <input value={searchTerm} onChange={e => onSearchChange(e.target.value)} placeholder="Поиск файлов…"
                        style={{
                            width: '100%', padding: '5px 8px 5px 26px', background: C.bgElevated,
                            border: `1px solid ${C.borderFaint}`, borderRadius: 5,
                            color: C.text, fontFamily: C.mono, fontSize: 12, outline: 'none',
                            boxSizing: 'border-box', transition: 'border-color 0.14s, box-shadow 0.14s',
                        }}
                        onFocus={e => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = C.accentGlow; e.target.style.background = '#fff'; }}
                        onBlur={e => { e.target.style.borderColor = C.borderFaint; e.target.style.boxShadow = 'none'; e.target.style.background = C.bgElevated; }}
                    />
                </div>
            </div>

            {/* Tree */}
            <div className="git-scrollbar" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingTop: 4, paddingBottom: 8 }}>
                {structure.children.map(child => (
                    <TreeNode key={child.name} node={child} nodePath={child.name} depth={0}
                        collapsedFolders={collapsedFolders} selectedPath={selectedPath}
                        searchTerm={searchTerm} onToggle={onFolderToggle} onSelect={onFileSelect}
                    />
                ))}
            </div>
        </div>
    );
}
