import { useEffect, useRef, useState } from 'react';

export default function SqlEditorModal({ element, initialSql, onSave, onClose }) {
    const [code, setCode] = useState(initialSql || '');
    const [dirty, setDirty] = useState(false);
    const [showWarn, setShowWarn] = useState(false);
    const textareaRef = useRef(null);

    useEffect(() => {
        setCode(initialSql || '');
        setDirty(false);
        setTimeout(() => textareaRef.current?.focus(), 50);
    }, [initialSql]);

    function handleKeyDown(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const el = e.target;
            const start = el.selectionStart;
            const next = code.substring(0, start) + '    ' + code.substring(el.selectionEnd);
            setCode(next);
            setDirty(true);
            requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = start + 4; });
        }
        if (e.key === 'Escape') handleClose();
    }

    function handleSave() {
        onSave(code);
        setDirty(false);
    }

    function handleClose() {
        if (dirty) setShowWarn(true);
        else onClose();
    }

    return (
        <div className="sql-modal active" onClick={e => { if (e.target === e.currentTarget) handleClose(); }}>
            <div className="sql-modal-dialog" style={{ position: 'relative' }}>
                <div className="sql-modal-header">
                    <div>
                        <div className="sql-modal-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <i className="fas fa-code" style={{ color: '#1976d2', fontSize: 18 }}></i>
                            <span>SQL Editor</span>
                        </div>
                        <div className="sql-modal-subtitle">{element?.title || 'Модуль'}</div>
                    </div>
                    <button className="sql-modal-close" type="button" onClick={handleClose}>&times;</button>
                </div>

                <div className="sql-modal-body">
                    <div className="ddl-editor-area" style={{ padding: 0, background: 'transparent' }}>
                        <textarea
                            ref={textareaRef}
                            className="sql-modal-editor"
                            spellCheck={false}
                            placeholder="Введите SQL скрипт..."
                            value={code}
                            onChange={e => { setCode(e.target.value); setDirty(true); }}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>

                <div className="sql-modal-footer">
                    <div className="sql-modal-validation"></div>
                    <button className="btn btn-secondary" type="button" onClick={handleClose}>Отмена</button>
                    <button className="btn btn-primary" type="button" onClick={handleSave}>Сохранить</button>
                </div>

                {showWarn && (
                    <div style={{
                        position: 'absolute', inset: 0, zIndex: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(0,0,0,0.35)',
                    }}>
                        <div style={{
                            background: '#fff', borderRadius: 10,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                            width: 380, padding: '24px 24px 20px',
                        }}>
                            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8, color: '#1a2533' }}>
                                Несохранённые изменения
                            </div>
                            <div style={{ fontSize: 13, color: '#5d6d7e', marginBottom: 20 }}>
                                Есть несохранённые изменения. Что хотите сделать?
                            </div>
                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                <button className="btn btn-secondary" onClick={() => setShowWarn(false)}>Отмена</button>
                                <button className="btn btn-secondary" style={{ whiteSpace: 'nowrap' }} onClick={() => { setShowWarn(false); onClose(); }}>Не сохранять</button>
                                <button className="btn btn-primary" onClick={() => { handleSave(); setShowWarn(false); onClose(); }}>Сохранить</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
