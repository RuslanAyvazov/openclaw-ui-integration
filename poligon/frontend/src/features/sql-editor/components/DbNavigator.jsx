import { useState, useRef, useEffect, forwardRef } from 'react';

function DbNavigator({
    collapsed, onToggleCollapse,
    sparkSessions, activeSessionId, onSessionSelect, onSessionAdd,
    onSessionConnect, onSessionStop, onSessionDelete,
    databases, onTableClick,
    filter, onFilterChange,
}, ref) {
    const [dbExpanded, setDbExpanded] = useState({ default: true });

    // Vertical resize of the spark sessions panel (prototype: #sparkDbResizer)
    const [sparkHeight, setSparkHeight] = useState(210);
    const [sparkResizing, setSparkResizing] = useState(false);
    const sparkDrag = useRef(null); // { startY, startH }

    useEffect(() => {
        function onMove(e) {
            if (!sparkDrag.current) return;
            const next = Math.max(88, Math.min(window.innerHeight * 0.58, sparkDrag.current.startH + e.clientY - sparkDrag.current.startY));
            setSparkHeight(next);
        }
        function onUp() {
            if (!sparkDrag.current) return;
            sparkDrag.current = null;
            setSparkResizing(false);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    }, []);

    function startSparkResize(e) {
        e.preventDefault();
        sparkDrag.current = { startY: e.clientY, startH: sparkHeight };
        setSparkResizing(true);
        document.body.style.cursor = 'row-resize';
        document.body.style.userSelect = 'none';
    }

    const filteredDbs = filter
        ? databases.filter(db =>
            db.name.toLowerCase().includes(filter.toLowerCase()) ||
            db.tables.some(t => t.name.toLowerCase().includes(filter.toLowerCase())))
        : databases;

    return (
        <div ref={ref} className={`db-sidebar${collapsed ? ' collapsed' : ''}`}>
            <div className="sidebar-header">
                <span className="sidebar-title">Navigator</span>
                <i
                    className={`fas fa-chevron-${collapsed ? 'right' : 'left'} toggle-sidebar`}
                    onClick={onToggleCollapse}
                    title={collapsed ? 'Развернуть' : 'Свернуть'}
                ></i>
            </div>

            <div className="spark-sessions" style={{ height: sparkHeight }}>
                <div className="spark-sessions-title">
                    <span><i className="fas fa-fire"></i> Spark sessions</span>
                    <button type="button" className="spark-session-add" aria-label="Добавить Spark session" onClick={onSessionAdd}>
                        <i className="fas fa-plus"></i>
                    </button>
                </div>
                <div className="spark-session-list">
                    {sparkSessions.map(s => (
                        <div
                            key={s.id}
                            className={`spark-session-item${activeSessionId === s.id ? ' active' : ''}`}
                            onClick={() => onSessionSelect(activeSessionId === s.id ? null : s.id)}
                        >
                            <div className="spark-session-top">
                                <div className="spark-session-name">
                                    <i className="fas fa-fire"></i>
                                    <span title={s.name}>{s.name}</span>
                                </div>
                                <div className="spark-session-actions">
                                    <button type="button" className="spark-session-action" title="Подключить Spark сессию к текущему SQL окну"
                                            onClick={e => { e.stopPropagation(); onSessionConnect?.(s.id); }}>
                                        <i className="fas fa-play"></i>
                                    </button>
                                    <button type="button" className="spark-session-action" title="Остановить Spark сессию"
                                            onClick={e => { e.stopPropagation(); onSessionStop?.(s.id); }}>
                                        <i className="fas fa-stop"></i>
                                    </button>
                                    <button type="button" className="spark-session-action" title="Редактировать"
                                            onClick={e => e.stopPropagation()}>
                                        <i className="fas fa-cog"></i>
                                    </button>
                                    <button type="button" className="spark-session-action" title="Удалить"
                                            onClick={e => { e.stopPropagation(); onSessionDelete?.(s.id); }}>
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="spark-session-meta">
                                {s.params.master} · {s.params.executors}×{s.params.executorMemory} · shuffle {s.params.shufflePartitions}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div
                className={`spark-db-resizer${sparkResizing ? ' dragging' : ''}`}
                role="separator"
                aria-orientation="horizontal"
                onMouseDown={startSparkResize}
            ></div>

            <div className="db-filter">
                <input
                    type="text"
                    placeholder="Filter databases..."
                    value={filter}
                    onChange={e => onFilterChange(e.target.value)}
                    autoComplete="off"
                />
            </div>
            <div className="db-section-title"><i className="fas fa-database"></i> DATABASES</div>

            <div className="db-tree">
                {filteredDbs.map(db => (
                    <div key={db.name} className="db-item">
                        <div
                            className="db-root"
                            onClick={() => setDbExpanded(prev => ({ ...prev, [db.name]: !prev[db.name] }))}
                        >
                            <i className={`fas fa-caret-${dbExpanded[db.name] ? 'down' : 'right'}`}></i>
                            <i className="fas fa-database"></i> {db.name}
                            <span className="badge">{db.tables.length}</span>
                        </div>
                        {dbExpanded[db.name] && (
                            <div className="table-list">
                                {db.tables.map(t => (
                                    <div
                                        key={t.name}
                                        className="table-item"
                                        onClick={() => onTableClick(db.name, t.name)}
                                    >
                                        <i className="fas fa-table"></i> {t.name}
                                        <span className="badge">{t.cols} cols</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default forwardRef(DbNavigator);
