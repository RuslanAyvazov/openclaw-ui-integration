import { useState } from 'react';
import { WS_ROLES } from '../constants';

const AVATAR_COLORS = [
    'linear-gradient(135deg,#3498db,#2471a3)',
    'linear-gradient(135deg,#27ae60,#1a7a43)',
    'linear-gradient(135deg,#8e44ad,#6c3483)',
    'linear-gradient(135deg,#e67e22,#ca6f1e)',
    'linear-gradient(135deg,#e74c3c,#c0392b)',
    'linear-gradient(135deg,#16a085,#117a65)',
];
const avatarColor = id => AVATAR_COLORS[id.charCodeAt(id.length - 1) % AVATAR_COLORS.length];

const ROLE_COLORS = {
    admin:     { bg: 'rgba(37,99,235,0.1)',  color: '#2563eb' },
    developer: { bg: 'rgba(124,58,237,0.1)', color: '#7c3aed' },
    analyst:   { bg: 'rgba(5,150,105,0.1)',  color: '#059669' },
};

export default function WorkspaceManageModal({ open, onClose, workspace, members, requests, onRoleChange, onRemove, onApprove, onDecline, onAddMember, onUpdateWorkspace }) {
    const [tab, setTab] = useState('members');
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('analyst');
    const [wsName, setWsName] = useState(workspace?.name || '');
    const [wsDesc, setWsDesc] = useState(workspace?.description || '');
    const [wsPublic, setWsPublic] = useState(workspace?.isPublic || false);

    if (!open || !workspace) return null;

    function handleInvite(e) {
        e.preventDefault();
        if (!inviteEmail.trim()) return;
        onAddMember?.(inviteEmail.trim(), inviteRole);
        setInviteEmail('');
    }

    function handleSaveSettings(e) {
        e.preventDefault();
        onUpdateWorkspace?.({ name: wsName.trim(), description: wsDesc.trim(), isPublic: wsPublic });
    }

    return (
        <div className="modal active" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal-content" style={{ maxWidth: 580, width: '96%', maxHeight: '88vh', overflowY: 'auto', borderRadius: 12, overflow: 'hidden' }}>

                {/* Hero */}
                <div className="ws-hero">
                    <div className="ws-hero-row">
                        <div className="ws-hero-icon" style={{ background: workspace.color, fontSize: 22, letterSpacing: -0.5 }}>
                            {workspace.name[0]}
                        </div>
                        <div className="ws-hero-text">
                            <div className="ws-hero-title">{workspace.name}</div>
                            <div className="ws-hero-sub">{workspace.description || 'Управление пространством'}</div>
                        </div>
                        <button className="ws-hero-close" onClick={onClose} type="button" aria-label="Закрыть">
                            <i className="fas fa-times" />
                        </button>
                    </div>
                    <div className="ws-hero-stats">
                        <div className="ws-hero-stat">
                            <i className="fas fa-users" />
                            <span className="ws-hero-stat-val">{members.length}</span>
                            <span className="ws-hero-stat-lbl">участников</span>
                        </div>
                        <div className="ws-hero-stat">
                            <i className="fas fa-database" />
                            <span className="ws-hero-stat-val">{workspace.datamartsCount}</span>
                            <span className="ws-hero-stat-lbl">витрин</span>
                        </div>
                        {requests.length > 0 && (
                            <div className="ws-hero-stat">
                                <i className="fas fa-bell" />
                                <span className="ws-hero-stat-val" style={{ color: '#ffd700' }}>{requests.length}</span>
                                <span className="ws-hero-stat-lbl">заявок</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sticky tabs */}
                <div className="ws-manage-tabs">
                    {[
                        { key: 'members',  label: 'Участники', count: members.length },
                        { key: 'requests', label: 'Заявки',    count: requests.length, alert: requests.length > 0 },
                        { key: 'settings', label: 'Настройки', count: null },
                    ].map(t => (
                        <button
                            key={t.key}
                            className={`ws-manage-tab${tab === t.key ? ' active' : ''}`}
                            type="button"
                            onClick={() => setTab(t.key)}
                        >
                            {t.label}
                            {t.count != null && (
                                <span
                                    className="ws-manage-badge"
                                    style={t.alert ? { background: 'rgba(231,76,60,0.12)', color: '#e74c3c' } : undefined}
                                >
                                    {t.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Members tab */}
                {tab === 'members' && (
                    <div className="ws-modal-body">
                        <div className="ws-card" style={{ padding: '4px 8px' }}>
                            <div className="ws-members-list">
                                {members.map(m => {
                                    const rc = ROLE_COLORS[m.role] || {};
                                    return (
                                        <div key={m.id} className="ws-member-row">
                                            <div className="ws-member-avatar" style={{ background: avatarColor(m.id) }}>
                                                {m.initials}
                                            </div>
                                            <div className="ws-member-info">
                                                <div className="ws-member-name">{m.name}</div>
                                                <div className="ws-member-email">{m.email}</div>
                                            </div>
                                            <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 10, background: rc.bg, color: rc.color, whiteSpace: 'nowrap' }}>
                                                {WS_ROLES[m.role]?.label}
                                            </span>
                                            <select
                                                className="ws-member-role-select"
                                                value={m.role}
                                                onChange={e => onRoleChange?.(m.id, e.target.value)}
                                                disabled={m.id === 'u1'}
                                            >
                                                {Object.entries(WS_ROLES).map(([key, r]) => (
                                                    <option key={key} value={key}>{r.label}</option>
                                                ))}
                                            </select>
                                            <button
                                                className="ws-member-remove"
                                                type="button"
                                                onClick={() => onRemove?.(m.id)}
                                                disabled={m.id === 'u1'}
                                                title="Удалить участника"
                                            >
                                                <i className="fas fa-times" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <form className="ws-add-member-form" onSubmit={handleInvite}>
                            <i className="fas fa-user-plus" style={{ color: '#9aa3b2', fontSize: 13, alignSelf: 'center', flexShrink: 0 }} />
                            <input
                                type="email"
                                placeholder="email@company.ru"
                                value={inviteEmail}
                                onChange={e => setInviteEmail(e.target.value)}
                            />
                            <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
                                {Object.entries(WS_ROLES).map(([key, r]) => (
                                    <option key={key} value={key}>{r.label}</option>
                                ))}
                            </select>
                            <button
                                className="btn btn-primary"
                                type="submit"
                                disabled={!inviteEmail.trim()}
                                style={{ padding: '8px 14px', fontSize: 13, whiteSpace: 'nowrap', borderRadius: 7 }}
                            >
                                <i className="fas fa-paper-plane" /> Отправить
                            </button>
                        </form>
                    </div>
                )}

                {/* Requests tab */}
                {tab === 'requests' && (
                    <div className="ws-modal-body">
                        {requests.length === 0 ? (
                            <div className="ws-empty">
                                <div className="ws-empty-icon">
                                    <i className="fas fa-inbox" />
                                </div>
                                <div className="ws-empty-title">Нет входящих заявок</div>
                                <div className="ws-empty-desc">Когда кто-то подаст заявку на вступление, она появится здесь</div>
                            </div>
                        ) : (
                            <div className="ws-request-list">
                                {requests.map(r => (
                                    <div key={r.id} className="ws-request-item">
                                        <div className="ws-member-avatar" style={{ background: avatarColor(r.user.id), flexShrink: 0 }}>
                                            {r.user.initials}
                                        </div>
                                        <div className="ws-request-info">
                                            <div className="ws-request-name">{r.user.name}</div>
                                            <div className="ws-request-email">{r.user.email}</div>
                                            {r.message && <div className="ws-request-msg">«{r.message}»</div>}
                                        </div>
                                        <div className="ws-request-actions">
                                            <button className="ws-req-btn approve" type="button" onClick={() => onApprove?.(r.id)}>
                                                <i className="fas fa-check" /> Принять
                                            </button>
                                            <button className="ws-req-btn decline" type="button" onClick={() => onDecline?.(r.id)}>
                                                Отклонить
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Settings tab */}
                {tab === 'settings' && (
                    <div className="ws-modal-body">
                        <form onSubmit={handleSaveSettings}>
                            <div className="ws-card">
                                <div className="ws-field">
                                    <label>Название</label>
                                    <input value={wsName} onChange={e => setWsName(e.target.value)} maxLength={60} />
                                </div>
                                <div className="ws-field">
                                    <label>Описание</label>
                                    <textarea value={wsDesc} onChange={e => setWsDesc(e.target.value)} maxLength={200} rows={3} />
                                </div>
                            </div>

                            <div className="ws-visibility-options" style={{ marginBottom: 16 }}>
                                <button type="button" className={`ws-vis-option${!wsPublic ? ' active' : ''}`} onClick={() => setWsPublic(false)}>
                                    <div className="ws-vis-icon"><i className="fas fa-lock" /></div>
                                    <div className="ws-vis-info">
                                        <div className="ws-vis-title">Приватное</div>
                                        <div className="ws-vis-desc">Только по приглашению</div>
                                    </div>
                                    {!wsPublic && <i className="fas fa-check-circle" style={{ color: '#3498db', fontSize: 14, flexShrink: 0 }} />}
                                </button>
                                <button type="button" className={`ws-vis-option${wsPublic ? ' active' : ''}`} onClick={() => setWsPublic(true)}>
                                    <div className="ws-vis-icon"><i className="fas fa-globe" /></div>
                                    <div className="ws-vis-info">
                                        <div className="ws-vis-title">Публичное</div>
                                        <div className="ws-vis-desc">Открыто для заявок</div>
                                    </div>
                                    {wsPublic && <i className="fas fa-check-circle" style={{ color: '#3498db', fontSize: 14, flexShrink: 0 }} />}
                                </button>
                            </div>

                            <button className="ws-submit-btn" type="submit" disabled={!wsName.trim()}>
                                <i className="fas fa-save" /> Сохранить изменения
                            </button>
                        </form>

                        <div className="ws-danger-zone">
                            <div className="ws-danger-title"><i className="fas fa-exclamation-triangle" style={{ marginRight: 6 }} />Опасная зона</div>
                            <button className="ws-btn-danger" type="button">
                                <i className="fas fa-trash" /> Удалить пространство
                            </button>
                        </div>
                    </div>
                )}

                <div className="ws-modal-footer">
                    <button className="btn btn-secondary" type="button" onClick={onClose}>Закрыть</button>
                </div>
            </div>
        </div>
    );
}
