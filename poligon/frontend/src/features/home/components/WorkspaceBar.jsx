import { useState, useRef, useEffect } from 'react';
import { WS_ROLES } from '../constants';

export default function WorkspaceBar({ workspace, workspaces, onSwitch, onCreate, onBrowse, onManage, onInvite }) {
    const [open, setOpen] = useState(false);
    const btnRef = useRef(null);
    const dropRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        function onOutside(e) {
            if (btnRef.current?.contains(e.target) || dropRef.current?.contains(e.target)) return;
            setOpen(false);
        }
        document.addEventListener('mousedown', onOutside);
        return () => document.removeEventListener('mousedown', onOutside);
    }, [open]);

    const role = workspace?.role;
    const roleInfo = WS_ROLES[role] || {};

    return (
        <div className="ws-bar">
            {/* Left: switcher */}
            <div className="ws-bar-left">
                <button
                    ref={btnRef}
                    className="ws-switcher-btn"
                    onClick={() => setOpen(o => !o)}
                    type="button"
                >
                    {workspace ? (
                        <div className="ws-icon" style={{ background: workspace.color }}>
                            {workspace.name[0]}
                        </div>
                    ) : (
                        <div className="ws-icon" style={{ background: '#9aa3b2' }}>
                            <i className="fas fa-layer-group" style={{ fontSize: 14 }} />
                        </div>
                    )}
                    <div className="ws-name-group">
                        <span className="ws-label">Пространство</span>
                        <span className="ws-name">{workspace ? workspace.name : 'Не выбрано'}</span>
                    </div>
                    <i className={`fas fa-chevron-down ws-arrow${open ? ' open' : ''}`} />
                </button>

                {open && (
                    <div className="ws-dropdown" ref={dropRef}>
                        <div className="ws-dropdown-header">Мои пространства</div>
                        {workspaces.map(ws => (
                            <button
                                key={ws.id}
                                className={`ws-dropdown-item${ws.id === workspace?.id ? ' active' : ''}`}
                                type="button"
                                onClick={() => { onSwitch(ws.id); setOpen(false); }}
                            >
                                <div className="ws-dropdown-item-icon" style={{ background: ws.color }}>
                                    {ws.name[0]}
                                </div>
                                <div className="ws-dropdown-item-info">
                                    <div className="ws-dropdown-item-name">{ws.name}</div>
                                    <div className="ws-dropdown-item-meta">
                                        {ws.membersCount} участн. · {ws.datamartsCount} витрин · {WS_ROLES[ws.role]?.label}
                                    </div>
                                </div>
                                {ws.id === workspace?.id && (
                                    <i className="fas fa-check ws-dropdown-item-check" />
                                )}
                            </button>
                        ))}
                        <div className="ws-dropdown-divider" />
                        <button className="ws-dropdown-action" type="button" onClick={() => { onCreate(); setOpen(false); }}>
                            <i className="fas fa-plus" /> Создать пространство
                        </button>
                        <button className="ws-dropdown-action" type="button" onClick={() => { onBrowse(); setOpen(false); }}>
                            <i className="fas fa-search" /> Найти пространство
                        </button>
                    </div>
                )}
            </div>

            {workspace && (
                <>
                    <div className="ws-bar-sep" />
                    {/* Center: stats */}
                    <div className="ws-bar-center">
                        <span className={`ws-role-badge ${roleInfo.cls}`}>
                            <i className={`fas ${role === 'admin' ? 'fa-shield-alt' : role === 'developer' ? 'fa-code' : 'fa-chart-bar'}`} />
                            {roleInfo.label}
                        </span>
                        <div className="ws-stat-dot" />
                        <div className="ws-stat">
                            <i className="fas fa-users" />
                            {workspace.membersCount} участников
                        </div>
                        <div className="ws-stat-dot" />
                        <div className="ws-stat">
                            <i className="fas fa-database" />
                            {workspace.datamartsCount} витрин
                        </div>
                    </div>

                    {/* Right: actions */}
                    <div className="ws-bar-right">
                        <button className="ws-btn ws-btn-secondary" type="button" onClick={onInvite}>
                            <i className="fas fa-user-plus" /> Пригласить
                        </button>
                        {role === 'admin' && (
                            <button className="ws-btn-icon" type="button" onClick={onManage} title="Настройки пространства">
                                <i className="fas fa-cog" />
                            </button>
                        )}
                    </div>
                </>
            )}

            {!workspace && (
                <>
                    <div className="ws-bar-sep" />
                    <div className="ws-bar-center">
                        <span style={{ fontSize: 13, color: '#9aa3b2' }}>
                            Выберите пространство или создайте новое
                        </span>
                    </div>
                    <div className="ws-bar-right">
                        <button className="ws-btn ws-btn-secondary" type="button" onClick={onCreate}>
                            <i className="fas fa-plus" /> Создать
                        </button>
                        <button className="ws-btn ws-btn-secondary" type="button" onClick={onBrowse}>
                            <i className="fas fa-search" /> Найти
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
