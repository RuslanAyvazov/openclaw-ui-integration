export default function QueryTabs({ tabs, activeTab, onSelect, onAdd, onClose }) {
    return (
        <div className="tabs">
            {tabs.map(tab => (
                <div
                    key={tab.id}
                    className={`tab${activeTab === tab.id ? ' active' : ''}`}
                    onClick={() => onSelect(tab.id)}
                >
                    <i className="fas fa-file-code"></i> {tab.name}
                    <i
                        className="fas fa-times"
                        onClick={e => { e.stopPropagation(); onClose(tab.id); }}
                    ></i>
                </div>
            ))}
            <div className="new-tab" onClick={onAdd} title="Новый запрос">
                <i className="fas fa-plus"></i>
            </div>
        </div>
    );
}
