import { useState, useEffect, useRef } from 'react';
import { C } from '../constants';
import { MOCK_COMMITS } from '../mock';
import PullRequestsView from './PullRequestsView';

const TYPE_COLORS = {
    feat:     { color: '#27ae60', bg: 'rgba(39,174,96,0.1)' },
    fix:      { color: '#e67e22', bg: 'rgba(230,126,34,0.1)' },
    refactor: { color: '#8e44ad', bg: 'rgba(142,68,173,0.1)' },
    chore:    { color: '#7f8c8d', bg: 'rgba(127,140,141,0.1)' },
    docs:     { color: '#3498db', bg: 'rgba(52,152,219,0.1)' },
    test:     { color: '#16a085', bg: 'rgba(22,160,133,0.1)' },
};

const AVATAR_STYLES = {
    RA: { bg: '#d6eaf8', color: '#2980b9' },
    AP: { bg: '#e8daef', color: '#8e44ad' },
    DB: { bg: '#d5f5e3', color: '#1e8449' },
    AD: { bg: '#fdebd0', color: '#b9770e' },
};

function DiffBlocks({ additions, deletions, animated }) {
    const total = additions + deletions;
    const N = 5;
    const addB = total === 0 ? 0 : Math.round((additions / total) * N);
    const delB = total === 0 ? 0 : Math.round((deletions / total) * N);
    const neuB = Math.max(0, N - addB - delB);
    return (
        <div style={{ display: 'flex', gap: 2 }}>
            {Array.from({ length: addB }).map((_, i) => (
                <div key={`a${i}`} style={{ width: 9, height: 9, borderRadius: 2, background: animated ? C.green : 'transparent', border: `1.5px solid ${C.green}`, transition: `background 0.22s ease ${i * 65}ms` }} />
            ))}
            {Array.from({ length: delB }).map((_, i) => (
                <div key={`d${i}`} style={{ width: 9, height: 9, borderRadius: 2, background: animated ? C.red : 'transparent', border: `1.5px solid ${C.red}`, transition: `background 0.22s ease ${(addB + i) * 65}ms` }} />
            ))}
            {Array.from({ length: neuB }).map((_, i) => (
                <div key={`n${i}`} style={{ width: 9, height: 9, borderRadius: 2, background: C.bgElevated, border: `1.5px solid ${C.borderFaint}` }} />
            ))}
        </div>
    );
}

function CommitItem({ commit, animated, idx }) {
    const [hov, setHov] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const typeKey = commit.message.split(':')[0];
    const ts = TYPE_COLORS[typeKey] || { color: C.textSecondary, bg: C.bgHover };
    const av = AVATAR_STYLES[commit.initials] || { bg: C.bgElevated, color: C.textSecondary };
    const rest = commit.message.replace(`${typeKey}: `, '');

    return (
        <div style={{
            borderBottom: `1px solid ${C.borderFaint}`,
            background: hov ? C.bgHover : 'transparent',
            transition: 'background 0.1s',
            animation: `gitFadeIn 0.18s ease ${idx * 40}ms both`,
        }}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        >
            <div style={{ padding: '9px 12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 6 }}
                onClick={() => setExpanded(e => !e)}
            >
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <div style={{
                        width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                        background: av.bg, color: av.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: C.syne, fontSize: 9, fontWeight: 700, letterSpacing: '0.04em',
                    }}>
                        {commit.initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, flexWrap: 'wrap', marginBottom: 3 }}>
                            <span style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: ts.color, background: ts.bg, padding: '1px 6px', borderRadius: 4, flexShrink: 0 }}>{typeKey}</span>
                            <span style={{ fontFamily: C.mono, fontSize: 12, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{rest}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <span style={{ fontFamily: C.mono, fontSize: 10.5, color: C.accent }}>{commit.hash}</span>
                            <span style={{ fontFamily: C.syne, fontSize: 10.5, color: C.textMuted }}>{commit.time}</span>
                        </div>
                    </div>
                    <i className="fas fa-chevron-down" style={{ fontSize: 8, color: C.textMuted, flexShrink: 0, marginTop: 5, transform: expanded ? 'rotate(180deg)' : 'none', transition: `transform 0.16s ${C.ease}` }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 34 }}>
                    <DiffBlocks additions={commit.additions} deletions={commit.deletions} animated={animated} />
                    <span style={{ fontFamily: C.mono, fontSize: 10.5, color: C.green }}>+{commit.additions}</span>
                    <span style={{ fontFamily: C.mono, fontSize: 10.5, color: C.red }}>−{commit.deletions}</span>
                    <span style={{ fontFamily: C.syne, fontSize: 10.5, color: C.textMuted, marginLeft: 'auto' }}>{commit.changedFiles} файл{commit.changedFiles !== 1 ? 'а' : ''}</span>
                </div>
            </div>

            <div style={{ maxHeight: expanded ? 72 : 0, overflow: 'hidden', transition: `max-height 0.22s ${C.ease}` }}>
                <div style={{ padding: '0 12px 10px 12px' }}>
                    <div style={{ padding: '7px 10px', background: C.bgElevated, border: `1px solid ${C.borderFaint}`, borderRadius: 6, fontFamily: C.mono, fontSize: 11, color: C.textSecondary, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                        <span><span style={{ color: C.textMuted }}>author </span>{commit.author}</span>
                        <span><span style={{ color: C.textMuted }}>branch </span><span style={{ color: C.accent }}>{commit.branch}</span></span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CommitsList({ commits, animated }) {
    const totalAdd = commits.reduce((s, c) => s + c.additions, 0);
    const totalDel = commits.reduce((s, c) => s + c.deletions, 0);
    return (
        <>
            <div style={{ padding: '7px 12px', borderBottom: `1px solid ${C.borderFaint}`, display: 'flex', gap: 12, flexShrink: 0 }}>
                <span style={{ fontFamily: C.mono, fontSize: 11, color: C.green }}><i className="fas fa-plus" style={{ fontSize: 8, marginRight: 4 }} />{totalAdd.toLocaleString()}</span>
                <span style={{ fontFamily: C.mono, fontSize: 11, color: C.red }}><i className="fas fa-minus" style={{ fontSize: 8, marginRight: 4 }} />{totalDel.toLocaleString()}</span>
                <span style={{ fontFamily: C.syne, fontSize: 11, color: C.textMuted, marginLeft: 'auto' }}>{commits.reduce((s, c) => s + c.changedFiles, 0)} файлов</span>
            </div>
            <div className="git-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
                {commits.map((commit, i) => (
                    <CommitItem key={commit.hash + i} commit={commit} animated={animated} idx={i} />
                ))}
            </div>
        </>
    );
}

export default function CommitHistory({
    commits = MOCK_COMMITS,
    pullRequests = [], branches = {}, activeBranch = 'main',
    onApprovePR, onRejectPR, onCommentPR, onCreatePR,
    width, onWidthChange, isOpen, onToggle,
}) {
    const [animated, setAnimated] = useState(false);
    const [tab, setTab] = useState('commits'); // 'commits' | 'pulls'
    const dragging = useRef(false);
    const startX = useRef(0);
    const startW = useRef(0);

    useEffect(() => {
        const t = setTimeout(() => setAnimated(true), 150);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        function onMove(e) {
            if (!dragging.current) return;
            const delta = startX.current - e.clientX;
            const newW = Math.max(260, Math.min(560, startW.current + delta));
            onWidthChange(newW);
        }
        function onUp() {
            dragging.current = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    }, [onWidthChange]);

    function startResize(e) {
        dragging.current = true;
        startX.current = e.clientX;
        startW.current = width;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    }

    const openPRCount = pullRequests.filter(pr => pr.status === 'open').length;

    // Collapsed strip
    if (!isOpen) {
        return (
            <div style={{
                width: 38, minWidth: 38, borderLeft: `1px solid ${C.border}`,
                background: C.bgElevated, display: 'flex', flexDirection: 'column', alignItems: 'center',
                paddingTop: 10, gap: 8,
            }}>
                <button onClick={onToggle} title="Открыть активность" style={{
                    width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 6,
                    color: C.textSecondary, cursor: 'pointer', transition: 'all 0.12s',
                }}
                    onMouseEnter={e => { e.currentTarget.style.color = C.accent; e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.background = C.accentBg; }}
                    onMouseLeave={e => { e.currentTarget.style.color = C.textSecondary; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = 'transparent'; }}
                >
                    <i className="fas fa-history" style={{ fontSize: 12 }} />
                </button>
                {openPRCount > 0 && (
                    <div style={{ position: 'relative' }}>
                        <button onClick={() => { onToggle(); setTab('pulls'); }} title={`${openPRCount} открытых PR`} style={{
                            width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 6,
                            color: C.textSecondary, cursor: 'pointer', transition: 'all 0.12s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.color = C.accent; e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.background = C.accentBg; }}
                            onMouseLeave={e => { e.currentTarget.style.color = C.textSecondary; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = 'transparent'; }}
                        >
                            <i className="fas fa-code-branch" style={{ fontSize: 12 }} />
                        </button>
                        <span style={{
                            position: 'absolute', top: -4, right: -4, minWidth: 14, height: 14, padding: '0 3px',
                            background: '#e67e22', color: '#fff', borderRadius: 8, border: '2px solid #f8f9fa',
                            fontFamily: C.mono, fontSize: 8.5, fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>{openPRCount}</span>
                    </div>
                )}
                <span style={{ fontFamily: C.syne, fontSize: 10, color: C.textMuted, writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '0.04em' }}>
                    Activity
                </span>
            </div>
        );
    }

    const TabBtn = ({ value, icon, label, count }) => {
        const active = tab === value;
        return (
            <button onClick={() => setTab(value)} style={{
                flex: 1, padding: '8px 6px', background: active ? '#fff' : 'transparent',
                border: 'none', borderBottom: `2px solid ${active ? C.accent : 'transparent'}`,
                fontFamily: C.syne, fontSize: 11.5, fontWeight: active ? 700 : 500,
                color: active ? C.text : C.textSecondary, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                transition: 'all 0.14s',
            }}>
                <i className={icon} style={{ fontSize: 10 }} />
                {label}
                {count > 0 && (
                    <span style={{
                        fontFamily: C.mono, fontSize: 9.5, padding: '0 5px',
                        background: active ? C.accentBg : C.bgElevated,
                        color: active ? C.accent : C.textMuted,
                        borderRadius: 8, minWidth: 14, textAlign: 'center',
                    }}>{count}</span>
                )}
            </button>
        );
    };

    return (
        <div style={{
            width, minWidth: width, background: C.bg,
            display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative',
            borderLeft: `1px solid ${C.border}`,
        }}>
            {/* Resize handle */}
            <div onMouseDown={startResize} style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: 5,
                cursor: 'col-resize', zIndex: 10, background: 'transparent', transition: 'background 0.15s',
            }}
                onMouseEnter={e => { e.currentTarget.style.background = `rgba(52,152,219,0.25)`; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            />

            {/* Tabs row */}
            <div style={{
                display: 'flex', alignItems: 'stretch',
                background: C.bgElevated, borderBottom: `1px solid ${C.border}`, flexShrink: 0,
            }}>
                <TabBtn value="commits" icon="fas fa-history" label="Commits" count={commits.length} />
                <TabBtn value="pulls"   icon="fas fa-code-branch" label="PRs" count={pullRequests.length} />
                <button onClick={onToggle} title="Скрыть" style={{
                    width: 30, padding: 0,
                    background: 'transparent', border: 'none', borderLeft: `1px solid ${C.borderFaint}`,
                    color: C.textMuted, cursor: 'pointer', transition: 'all 0.12s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                    onMouseEnter={e => { e.currentTarget.style.color = C.text; e.currentTarget.style.background = C.bgHover; }}
                    onMouseLeave={e => { e.currentTarget.style.color = C.textMuted; e.currentTarget.style.background = 'transparent'; }}
                >
                    <i className="fas fa-chevron-right" style={{ fontSize: 10 }} />
                </button>
            </div>

            {/* Body */}
            {tab === 'commits' ? (
                <CommitsList commits={commits} animated={animated} />
            ) : (
                <PullRequestsView
                    pullRequests={pullRequests}
                    branches={branches}
                    activeBranch={activeBranch}
                    onApprove={onApprovePR}
                    onReject={onRejectPR}
                    onComment={onCommentPR}
                    onCreate={onCreatePR}
                />
            )}
        </div>
    );
}
