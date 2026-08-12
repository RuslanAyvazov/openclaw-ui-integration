import { useState } from 'react';

export default function CanvasPageTabs({ pages, activePageId, onSelect, onAdd, onClose, onRename }) {
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');

    function startRename(page) {
        setEditingId(page.id);
        setEditValue(page.name);
    }

    function commitRename() {
        if (editingId && editValue.trim()) onRename(editingId, editValue.trim());
        setEditingId(null);
    }

    return (
        <div className="canvas-tabs">
            <div className="canvas-tabs-container">
                {pages.map(page => (
                    <div
                        key={page.id}
                        className={`canvas-tab${activePageId === page.id ? ' active' : ''}`}
                        onClick={() => setEditingId(null) || onSelect(page.id)}
                        onDoubleClick={() => startRename(page)}
                    >
                        {editingId === page.id ? (
                            <input
                                className="tab-name-input"
                                autoFocus
                                value={editValue}
                                onChange={e => setEditValue(e.target.value)}
                                onBlur={commitRename}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') commitRename();
                                    else if (e.key === 'Escape') setEditingId(null);
                                }}
                                onClick={e => e.stopPropagation()}
                            />
                        ) : (
                            <span className="tab-name">{page.name}</span>
                        )}
                        {editingId !== page.id && (
                            <span
                                className="tab-close"
                                onClick={e => { e.stopPropagation(); onClose(page.id); }}
                            >
                                <i className="fas fa-times"></i>
                            </span>
                        )}
                    </div>
                ))}
                <div className="add-tab-btn" onClick={onAdd} title="Добавить поток">
                    <i className="fas fa-plus"></i>
                </div>
            </div>
        </div>
    );
}
