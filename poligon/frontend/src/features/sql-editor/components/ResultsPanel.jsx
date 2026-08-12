export default function ResultsPanel({
    visible, collapsed, activeTab,
    columns, rows, explain,
    onTabChange, onToggleCollapse, onClose,
}) {
    if (!visible) return null;

    return (
        <div className={`output-panel${collapsed ? ' collapsed' : ''}`}>
            <div className="output-header">
                <div className="output-tabs">
                    <div
                        className={`out-tab${activeTab === 'results' ? ' active' : ''}`}
                        onClick={() => onTabChange('results')}
                    >📋 Query results</div>
                    <div
                        className={`out-tab${activeTab === 'explain' ? ' active' : ''}`}
                        onClick={() => onTabChange('explain')}
                    >📊 Explain</div>
                </div>
                <div className="output-controls">
                    <button onClick={onToggleCollapse} title="Свернуть">
                        <i className={`fas fa-chevron-${collapsed ? 'up' : 'down'}`}></i>
                    </button>
                    <button onClick={onClose} title="Закрыть">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div className="output-content">
                {activeTab === 'results' ? (
                    <div className="table-container">
                        <table className="result-table">
                            <thead>
                                <tr>{columns.map(c => <th key={c}>{c}</th>)}</tr>
                            </thead>
                            <tbody>
                                {rows.map((row, i) => (
                                    <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="spark-plan">
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 12 }}>
                            {explain}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}
