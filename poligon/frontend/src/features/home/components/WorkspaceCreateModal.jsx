import { useState } from 'react';

const COLORS = ['#3498db','#27ae60','#e74c3c','#9b59b6','#f39c12','#1abc9c','#e67e22','#2c3e50'];

export default function WorkspaceCreateModal({ open, onClose, onCreate }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [color, setColor] = useState(COLORS[0]);
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    async function handleCreate(e) {
        e.preventDefault();
        if (!name.trim()) return;
        setLoading(true);
        await new Promise(r => setTimeout(r, 600));
        onCreate({ name: name.trim(), description: description.trim(), isPublic, color });
        setName(''); setDescription(''); setIsPublic(false); setColor(COLORS[0]);
        setLoading(false);
        onClose();
    }

    return (
        <div className="modal active" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal-content" style={{ maxWidth: 460, width: '96%', maxHeight: '90vh', overflowY: 'auto', borderRadius: 12, overflow: 'hidden' }}>

                {/* Hero header */}
                <div className="ws-hero">
                    <div className="ws-hero-row">
                        <div className="ws-hero-icon" style={{ background: color }}>
                            {name ? name[0].toUpperCase() : <i className="fas fa-layer-group" style={{ fontSize: 18 }} />}
                        </div>
                        <div className="ws-hero-text">
                            <div className="ws-hero-title">{name || 'Новое пространство'}</div>
                            <div className="ws-hero-sub">Настройте рабочее пространство команды</div>
                        </div>
                        <button className="ws-hero-close" onClick={onClose} type="button" aria-label="Закрыть">
                            <i className="fas fa-times" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleCreate}>
                    <div className="ws-modal-body">

                        {/* Main fields */}
                        <div className="ws-card">
                            <div className="ws-field">
                                <label>Название</label>
                                <input
                                    autoFocus
                                    placeholder="Например: CX B2C Analytics"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    maxLength={60}
                                />
                            </div>
                            <div className="ws-field">
                                <label>Описание</label>
                                <textarea
                                    placeholder="Кратко опишите назначение пространства"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    maxLength={200}
                                    rows={2}
                                />
                            </div>
                        </div>

                        {/* Color */}
                        <div className="ws-card">
                            <div className="ws-card-title">Цвет пространства</div>
                            <div className="ws-swatch-grid">
                                {COLORS.map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        className={`ws-swatch${color === c ? ' active' : ''}`}
                                        style={{ background: c }}
                                        onClick={() => setColor(c)}
                                        aria-label={c}
                                    />
                                ))}
                            </div>
                            <div style={{ height: 4 }} />
                        </div>

                        {/* Visibility */}
                        <div className="ws-visibility-options" style={{ marginBottom: 16 }}>
                            <button
                                type="button"
                                className={`ws-vis-option${!isPublic ? ' active' : ''}`}
                                onClick={() => setIsPublic(false)}
                            >
                                <div className="ws-vis-icon"><i className="fas fa-lock" /></div>
                                <div className="ws-vis-info">
                                    <div className="ws-vis-title">Приватное</div>
                                    <div className="ws-vis-desc">Только по приглашению</div>
                                </div>
                                {!isPublic && <i className="fas fa-check-circle" style={{ color: '#3498db', fontSize: 14, flexShrink: 0 }} />}
                            </button>
                            <button
                                type="button"
                                className={`ws-vis-option${isPublic ? ' active' : ''}`}
                                onClick={() => setIsPublic(true)}
                            >
                                <div className="ws-vis-icon"><i className="fas fa-globe" /></div>
                                <div className="ws-vis-info">
                                    <div className="ws-vis-title">Публичное</div>
                                    <div className="ws-vis-desc">Открыто для заявок</div>
                                </div>
                                {isPublic && <i className="fas fa-check-circle" style={{ color: '#3498db', fontSize: 14, flexShrink: 0 }} />}
                            </button>
                        </div>

                        <button className="ws-submit-btn" type="submit" disabled={!name.trim() || loading}>
                            {loading
                                ? <><i className="fas fa-spinner fa-spin" /> Создание…</>
                                : <><i className="fas fa-layer-group" /> Создать пространство</>
                            }
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            style={{ width: '100%', marginTop: 8, padding: '9px', border: 'none', background: 'none', color: '#9aa3b2', fontSize: 13, cursor: 'pointer', borderRadius: 7, transition: 'background 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#eef1f5'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
