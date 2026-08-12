import { useState, useEffect, useRef } from 'react';

const STATUS_MAP = {
    active: { text: 'Активна', className: 'status-active' },
    draft: { text: 'Черновик', className: 'status-draft' }
};

export default function DatamartTile({ datamart, onClick, onEdit, onDelete }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const status = STATUS_MAP[datamart.status] || STATUS_MAP.draft;

    useEffect(() => {
        if (!menuOpen) return;
        function onOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', onOutside);
        return () => document.removeEventListener('mousedown', onOutside);
    }, [menuOpen]);

    function handleMenuClick(e) {
        e.stopPropagation();
        setMenuOpen(o => !o);
    }

    function handleAction(e, action) {
        e.stopPropagation();
        setMenuOpen(false);
        if (action === 'edit') onEdit(datamart);
        if (action === 'delete') onDelete();
    }

    return (
        <div className="tile" data-datamart-id={datamart.id} onClick={onClick}>
            <div className="tile-header">
                <div className="tile-title">{datamart.name}</div>
                <div className="tile-actions">
                    <div className={`tile-status ${status.className}`}>{status.text}</div>
                    <button
                        className="tile-menu-trigger"
                        type="button"
                        aria-label="Действия с витриной"
                        onClick={handleMenuClick}
                    >
                        <i className="fas fa-ellipsis-h"></i>
                    </button>
                </div>
                {menuOpen && (
                    <div ref={menuRef} className="tile-context-menu open">
                        <button className="tile-context-item" type="button" onClick={e => handleAction(e, 'edit')}>
                            <i className="fas fa-gear"></i>
                            <span>Редактировать</span>
                        </button>
                        <button className="tile-context-item delete" type="button" onClick={e => handleAction(e, 'delete')}>
                            <i className="fas fa-trash"></i>
                            <span>Удалить</span>
                        </button>
                    </div>
                )}
            </div>
            <div className="tile-content">{datamart.description}</div>
            <div className="tile-footer">
                <div className="tile-meta-row">
                    <span className="tile-meta-label">Владелец:</span>
                    <span className="tile-meta-value">{datamart.owner}</span>
                </div>
                <div className="tile-meta-row">
                    <span className="tile-meta-label">Дата создания:</span>
                    <span className="tile-meta-value">{datamart.createdAt}</span>
                </div>
            </div>
        </div>
    );
}
