import { useState } from 'react';

export default function WorkspaceBrowseModal({ open, onClose, onJoin, workspaces = [] }) {
    const [query, setQuery] = useState('');
    const [requested, setRequested] = useState({});

    if (!open) return null;

    const filtered = workspaces.filter(ws =>
        !query ||
        ws.name.toLowerCase().includes(query.toLowerCase()) ||
        ws.description.toLowerCase().includes(query.toLowerCase())
    );

    async function handleJoin(ws) {
        try {
            await onJoin?.(ws);
            setRequested(prev => ({ ...prev, [ws.id]: true }));
        } catch (error) {
            alert(error?.message || 'Не удалось отправить заявку.');
        }
    }

    return (
        <div className="modal active" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal-content" style={{ maxWidth: 520, width: '96%', maxHeight: '90vh', overflowY: 'auto', borderRadius: 12, overflow: 'hidden' }}>

                {/* Hero */}
                <div className="ws-hero">
                    <div className="ws-hero-row">
                        <div className="ws-hero-icon">
                            <i className="fas fa-compass" style={{ fontSize: 20 }} />
                        </div>
                        <div className="ws-hero-text">
                            <div className="ws-hero-title">Найти пространство</div>
                            <div className="ws-hero-sub">Публичные пространства вашей организации</div>
                        </div>
                        <button className="ws-hero-close" onClick={onClose} type="button" aria-label="Закрыть">
                            <i className="fas fa-times" />
                        </button>
                    </div>
                    <div className="ws-hero-stats">
                        <div className="ws-hero-stat">
                            <i className="fas fa-layer-group" />
                            <span className="ws-hero-stat-val">{workspaces.length}</span>
                            <span className="ws-hero-stat-lbl">пространств</span>
                        </div>
                        <div className="ws-hero-stat">
                            <i className="fas fa-users" />
                            <span className="ws-hero-stat-val">{workspaces.reduce((s, w) => s + w.membersCount, 0)}</span>
                            <span className="ws-hero-stat-lbl">участников</span>
                        </div>
                    </div>
                </div>

                <div className="ws-modal-body">
                    <div className="ws-browse-search">
                        <i className="fas fa-search" />
                        <input
                            autoFocus
                            placeholder="Поиск по названию или описанию…"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={() => setQuery('')}
                                style={{ border: 'none', background: 'none', color: '#9aa3b2', cursor: 'pointer', padding: 0, fontSize: 13 }}
                            >
                                <i className="fas fa-times" />
                            </button>
                        )}
                    </div>

                    <div className="ws-browse-list">
                        {filtered.length === 0 && (
                            <div className="ws-empty">
                                <div className="ws-empty-icon">
                                    <i className="fas fa-search" />
                                </div>
                                <div className="ws-empty-title">Ничего не найдено</div>
                                <div className="ws-empty-desc">Попробуйте изменить запрос</div>
                            </div>
                        )}
                        {filtered.map(ws => (
                            <div key={ws.id} className="ws-browse-item">
                                <div className="ws-browse-icon" style={{ background: ws.color }}>
                                    {ws.name[0]}
                                </div>
                                <div className="ws-browse-info">
                                    <div className="ws-browse-name">{ws.name}</div>
                                    <div className="ws-browse-desc">{ws.description}</div>
                                    <div className="ws-browse-meta">
                                        <i className="fas fa-users" />
                                        {ws.membersCount} участников
                                        <span style={{ margin: '0 4px', color: '#dce3ec' }}>·</span>
                                        <i className="fas fa-database" />
                                        {ws.datamartsCount} витрин
                                    </div>
                                </div>
                                <button
                                    className={`ws-join-btn${requested[ws.id] ? ' requested' : ''}`}
                                    type="button"
                                    disabled={requested[ws.id]}
                                    onClick={() => !requested[ws.id] && handleJoin(ws)}
                                >
                                    {requested[ws.id]
                                        ? <><i className="fas fa-clock" /> Заявка отправлена</>
                                        : <><i className="fas fa-sign-in-alt" /> Вступить</>
                                    }
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="ws-modal-footer">
                    <button className="btn btn-secondary" type="button" onClick={onClose}>Закрыть</button>
                </div>
            </div>
        </div>
    );
}
