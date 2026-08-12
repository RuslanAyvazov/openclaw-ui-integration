// Modal for picking a branch + a stream to import into a designer page.
//
// Two import targets:
//   1. "Текущая вкладка" — replace current page's elements/connections.
//   2. "Новая вкладка"   — add a new page named after the stream.

import { useEffect, useMemo, useState } from 'react';

export default function StreamImportModal({
    open,
    branches,
    activeBranch,
    pages,
    activePageId,
    listStreamsInBranch,
    onConfirm,
    onClose,
}) {
    const branchNames = useMemo(() => Object.keys(branches || {}), [branches]);
    const [branchName, setBranchName] = useState(activeBranch || branchNames[0] || 'main');
    const [streamName, setStreamName] = useState(null);
    const [target, setTarget] = useState('current'); // 'current' | 'new'
    const [tabName, setTabName] = useState('');

    const hasPages = (pages || []).length > 0;

    useEffect(() => {
        if (!open) return;
        const fallback = activeBranch || branchNames[0] || 'main';
        setBranchName(fallback);
        setStreamName(null);
        setTarget(hasPages ? 'current' : 'new');
        setTabName('');
    }, [open, activeBranch, branchNames, hasPages]);

    const streams = useMemo(
        () => (open && branchName ? listStreamsInBranch(branchName) : []),
        [open, branchName, listStreamsInBranch],
    );

    if (!open) return null;

    const activePage = pages.find(p => p.id === activePageId);

    function handleConfirm() {
        if (!streamName) { alert('Выберите поток'); return; }
        const finalName = target === 'new'
            ? (tabName.trim() || streamName)
            : (activePage?.name || streamName);
        onConfirm({
            branch: branchName,
            stream: streamName,
            target,
            tabName: finalName,
        });
    }

    return (
        <div className="modal active branch-modal-overlay">
            <div className="modal-content branch-modal-content">
                <div className="branch-hero">
                    <div className="branch-hero-icon"><i className="fas fa-cloud-download-alt" /></div>
                    <div className="branch-hero-title">
                        <h3>Импортировать поток</h3>
                        <p>Выберите ветку и поток. Поток загрузится в текущую или новую вкладку.</p>
                    </div>
                    <button className="branch-hero-close" onClick={onClose} aria-label="Закрыть">
                        <i className="fas fa-times" />
                    </button>
                </div>

                <div className="branch-modal-body">

                    <div className="branch-field">
                        <label>Ветка</label>
                        <div className="branch-select-wrap">
                            <i className="fas fa-code-branch" />
                            <select value={branchName} onChange={e => { setBranchName(e.target.value); setStreamName(null); }}>
                                {branchNames.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                            <i className="fas fa-chevron-down branch-select-caret" />
                        </div>
                    </div>

                    <div className="branch-field">
                        <label>
                            Потоки в ветке
                            <span className="branch-field-hint">{streams.length}</span>
                        </label>
                        {streams.length === 0 ? (
                            <div className="branch-empty-state">
                                <i className="fas fa-folder-open" />
                                В этой ветке нет потоков (папок в <code>etl/</code>).
                            </div>
                        ) : (
                            <div className="branch-stream-list">
                                {streams.map(s => {
                                    const sel = streamName === s;
                                    return (
                                        <button
                                            key={s}
                                            type="button"
                                            className={`branch-stream-row${sel ? ' is-selected' : ''}`}
                                            onClick={() => setStreamName(s)}
                                        >
                                            <i className={`fas ${sel ? 'fa-check-circle' : 'fa-stream'}`} />
                                            <span className="branch-stream-name">{s}</span>
                                            <span className="branch-stream-path">etl/{s}/</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="branch-field">
                        <label>Куда импортировать</label>
                        <div className="branch-target-grid">
                            <button
                                type="button"
                                className={`branch-target-card${target === 'current' ? ' is-active' : ''}`}
                                onClick={() => setTarget('current')}
                                disabled={!hasPages}
                                style={!hasPages ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
                            >
                                <div className="branch-target-icon"><i className="fas fa-window-restore" /></div>
                                <div className="branch-target-text">
                                    <strong>В текущую вкладку</strong>
                                    <span>{hasPages ? `«${activePage?.name || 'Поток'}» будет перезаписана` : 'нет открытых вкладок'}</span>
                                </div>
                            </button>
                            <button
                                type="button"
                                className={`branch-target-card${target === 'new' ? ' is-active' : ''}`}
                                onClick={() => setTarget('new')}
                            >
                                <div className="branch-target-icon"><i className="fas fa-plus" /></div>
                                <div className="branch-target-text">
                                    <strong>В новую вкладку</strong>
                                    <span>создать новую страницу</span>
                                </div>
                            </button>
                        </div>
                        {target === 'new' && (
                            <input
                                className="branch-input"
                                placeholder={streamName ? `Название (по умолчанию: ${streamName})` : 'Название новой вкладки'}
                                value={tabName}
                                onChange={e => setTabName(e.target.value)}
                                style={{ marginTop: 8 }}
                            />
                        )}
                    </div>
                </div>

                <div className="branch-modal-footer">
                    <button className="branch-btn-secondary" onClick={onClose}>Отмена</button>
                    <button className="branch-btn-primary" onClick={handleConfirm} disabled={!streamName}>
                        <i className="fas fa-cloud-download-alt" />
                        Импортировать
                    </button>
                </div>
            </div>
        </div>
    );
}
