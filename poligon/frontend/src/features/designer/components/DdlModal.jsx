import { useEffect, useRef, useState } from 'react';

const META = {
    script: {
        title: 'DDL Editor',
        subtitle: 'Скрипты создания и изменения структур данных (CREATE, ALTER, DROP)',
        placeholder: '-- DDL скрипты...\n\nCREATE TABLE IF NOT EXISTS schema.table_name (\n    id BIGINT,\n    ...\n);',
        showVars: true,
    },
    source: {
        title: 'Source Editor',
        subtitle: 'Скрипты источника/инжеста для Flink Source',
        placeholder: '-- Source скрипт...',
        showVars: false,
    },
    sync: {
        title: 'Sync Editor',
        subtitle: 'Скрипты синхронизации и служебной оркестрации',
        placeholder: '-- Sync скрипт...',
        showVars: false,
    },
};

// Parse ${$varName} markers from code
function extractVars(code) {
    const matches = [...code.matchAll(/\$\{\$(\w+)\}/g)];
    const names = [...new Set(matches.map(m => m[1]))];
    return names;
}

function VarsSidebar({ code, vars, onChange, collapsed, onToggle }) {
    const detectedNames = extractVars(code);

    // Merge detected names into vars (add missing, keep existing)
    useEffect(() => {
        const existing = vars.map(v => v.key);
        const newVars = detectedNames.filter(n => !existing.includes(n));
        if (newVars.length > 0) {
            onChange([...vars, ...newVars.map(k => ({ key: k, value: '' }))]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code]);

    function setVar(i, field, val) {
        onChange(vars.map((v, idx) => idx === i ? { ...v, [field]: val } : v));
    }
    function delVar(i) { onChange(vars.filter((_, idx) => idx !== i)); }
    function addVar() { onChange([...vars, { key: '', value: '' }]); }

    return (
        <div className={`ddl-vars-sidebar${collapsed ? ' collapsed' : ''}`}>
            <div className="ddl-vars-sidebar-header">
                <div className="ddl-vars-sidebar-title">
                    <i className="fas fa-sliders-h"></i> Переменные
                </div>
                <button type="button" className="ddl-vars-sidebar-toggle" onClick={onToggle} title="Скрыть/показать">
                    <i className={`fas fa-chevron-${collapsed ? 'left' : 'right'}`}></i>
                </button>
            </div>
            {!collapsed && (
                <div className="ddl-vars-sidebar-body">
                    <div className="ddl-vars-section">
                        <div className="ddl-vars-section-title">Общие переменные</div>
                        {vars.map((v, i) => (
                            <div key={i} className="ddl-kv-row">
                                <input className="ddl-kv-input" placeholder="Ключ" value={v.key}
                                    onChange={e => setVar(i, 'key', e.target.value)} />
                                <input className="ddl-kv-input" placeholder="Значение" value={v.value}
                                    onChange={e => setVar(i, 'value', e.target.value)} />
                                <button type="button" className="ddl-kv-del" onClick={() => delVar(i)}>&#x2715;</button>
                            </div>
                        ))}
                        <button type="button" className="ddl-kv-add" onClick={addVar}>
                            <i className="fas fa-plus"></i> Добавить
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function DdlModal({ subtype, content, vars, onSave, onClose }) {
    const [code, setCode] = useState(content || '');
    const [localVars, setLocalVars] = useState(vars || []);
    const [varsCollapsed, setVarsCollapsed] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [showWarn, setShowWarn] = useState(false);
    const textareaRef = useRef(null);
    const meta = META[subtype] || META.script;

    useEffect(() => {
        setCode(content || '');
        setLocalVars(vars || []);
        setDirty(false);
        setTimeout(() => textareaRef.current?.focus(), 50);
    }, [subtype, content]);

    function handleChange(val) {
        setCode(val);
        setDirty(true);
    }

    function handleKeyDown(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const el = e.target;
            const start = el.selectionStart;
            const end = el.selectionEnd;
            const next = code.substring(0, start) + '    ' + code.substring(end);
            setCode(next);
            setDirty(true);
            requestAnimationFrame(() => {
                el.selectionStart = el.selectionEnd = start + 4;
            });
        }
        if (e.key === 'Escape') {
            handleClose();
        }
    }

    function handleSave() {
        onSave({ code, vars: localVars });
        setDirty(false);
    }

    function handleClose() {
        if (dirty) { setShowWarn(true); } else { onClose(); }
    }

    return (
        <div className="sql-modal active" onClick={e => { if (e.target === e.currentTarget) handleClose(); }}>
            <div className="sql-modal-dialog" style={{ position: 'relative' }}>
                <div className="sql-modal-header">
                    <div>
                        <div className="sql-modal-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <i className="fas fa-file-code" style={{ color: '#e65100', fontSize: 18 }}></i>
                            <span>{meta.title}</span>
                        </div>
                        <div className="sql-modal-subtitle">{meta.subtitle}</div>
                    </div>
                    <button className="sql-modal-close" type="button" onClick={handleClose} aria-label="Закрыть">&times;</button>
                </div>

                <div className="ddl-modal-body-split">
                    <div className="ddl-editor-area">
                        <textarea
                            ref={textareaRef}
                            className="sql-modal-editor"
                            spellCheck={false}
                            placeholder={meta.placeholder}
                            value={code}
                            onChange={e => handleChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    {meta.showVars && (
                        <VarsSidebar
                            code={code}
                            vars={localVars}
                            onChange={setLocalVars}
                            collapsed={varsCollapsed}
                            onToggle={() => setVarsCollapsed(v => !v)}
                        />
                    )}
                </div>

                <div className="sql-modal-footer">
                    <div className="sql-modal-validation"></div>
                    <button className="btn btn-secondary" type="button" onClick={handleClose}>Отмена</button>
                    <button className="btn btn-primary" type="button" onClick={handleSave}>Сохранить</button>
                </div>
            </div>

            {showWarn && (
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.35)',
                }}>
                    <div style={{
                        background: '#fff', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
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
    );
}
