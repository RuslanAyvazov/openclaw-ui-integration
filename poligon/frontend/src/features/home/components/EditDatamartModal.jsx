import { useState, useEffect, useMemo } from 'react';
import PassportSection from './PassportSection';
import { checkedToNames, namesToChecked, makeFrameworkDefaults, clusterName } from '../utils';

const CONTOUR_ORDER = ['dev','ift','psi','rdt','prom'];

function passportToForm(datamart) {
    const p = datamart.passport || {};
    return {
        displayName: p.displayName || datamart.displayName || datamart.name || '',
        owner: p.owner || datamart.owner || '',
        block: p.block || '',
        datamartGroup: p.datamartGroup || '',
        datamartName: p.datamartName || datamart.name || '',
        ciItService: p.ciItService || '',
        ciAsFp: p.ciAsFp || '',
        sqPrKey: p.sqPrKey || '',
        emails: p.emails || '',
        externalLibs: p.externalLibs || '',
        lineup: p.lineup || 'cxb2c',
        clusterChecked: namesToChecked(p.lineup || 'cxb2c', p.clusters || []),
    };
}

function FrameworkPane({ passport, clusterFrameworkVars, onChange, readonly, pages }) {
    const [activeCluster, setActiveCluster] = useState('');
    const [activeStream, setActiveStream] = useState('');
    const [clusterCollapsed, setClusterCollapsed] = useState(false);
    const [streamCollapsed, setStreamCollapsed] = useState(false);
    const [sectionOpen, setSectionOpen] = useState(true);

    const streams = useMemo(() => (
        Array.isArray(pages) && pages.length > 0
            ? pages.map(p => ({ id: p.id, name: p.name }))
            : [{ id: 'page-1', name: 'Поток 1' }]
    ), [pages]);

    const clusters = useMemo(() => {
        return Object.keys(passport.clusterChecked || {})
            .filter(id => passport.clusterChecked[id])
            .map(id => ({
                name: clusterName(id),
                contour: id.split('__')[1] || 'dev',
            }));
    }, [passport.clusterChecked]);

    // Set active cluster/stream when they change
    useEffect(() => {
        if (clusters.length && (!activeCluster || !clusters.some(c => c.name === activeCluster))) {
            setActiveCluster(clusters[0]?.name || '');
        }
    }, [clusters]);

    useEffect(() => {
        if (streams.length && (!activeStream || !streams.some(s => s.id === activeStream))) {
            setActiveStream(streams[0]?.id || '');
        }
    }, [streams]);

    const csKey = `${activeCluster}::${activeStream}`;

    // Auto-initialize defaults the first time a cluster×stream combo is viewed
    useEffect(() => {
        if (!activeCluster || !activeStream) return;
        onChange(prev => {
            if (prev[csKey] !== undefined) return prev;
            return {
                ...prev,
                [csKey]: makeFrameworkDefaults(
                    passport.block,
                    passport.datamartGroup,
                    passport.datamartName,
                ),
            };
        });
    }, [csKey]);

    const currentVars = clusterFrameworkVars[csKey] || [];

    function setVars(vars) {
        onChange(prev => ({ ...prev, [csKey]: vars }));
    }

    function updateRow(i, field, val) {
        setVars(currentVars.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
    }
    function addRow() { setVars([...currentVars, { key: '', value: '' }]); }
    function delRow(i) { setVars(currentVars.filter((_, idx) => idx !== i)); }
    function fillDefaults() {
        setVars(makeFrameworkDefaults(passport.block, passport.datamartGroup, passport.datamartName));
    }

    if (!clusters.length) {
        return (
            <div className="mart-empty">
                <b>Не выбраны кластеры для деплоя.</b><br />
                Выберите кластер в разделе «Паспорт витрины» → «Линейка и кластеры».
            </div>
        );
    }

    const grouped = CONTOUR_ORDER.map(contour => ({
        contour,
        items: clusters.filter(c => c.contour === contour),
    })).filter(g => g.items.length > 0);

    return (
        <div className="mart-pane">
            <div className="mart-layout">
                {/* Cluster sidebar */}
                <div className={`mart-sidebar${clusterCollapsed ? ' mart-sidebar-collapsed' : ''}`}>
                    <div className="mart-sidebar-header">
                        {!clusterCollapsed && (
                            <>
                                <span className="mart-sidebar-title">Кластеры</span>
                                <span className="mart-count">{clusters.length}</span>
                            </>
                        )}
                        <button
                            type="button"
                            className="mart-collapse-btn"
                            onClick={() => setClusterCollapsed(v => !v)}
                            title={clusterCollapsed ? 'Развернуть' : 'Свернуть'}
                        >
                            <i className={`fas fa-angle-double-${clusterCollapsed ? 'right' : 'left'}`}></i>
                        </button>
                    </div>
                    {grouped.map(g => (
                        <div key={g.contour}>
                            <div className="mart-group-label">
                                <span className={`mart-group-dot mart-dot-${g.contour}`}></span>
                                {g.contour.toUpperCase()}
                            </div>
                            {g.items.map(item => (
                                <div
                                    key={item.name}
                                    className={`mart-item${item.name === activeCluster ? ' active' : ''}`}
                                    onClick={() => setActiveCluster(item.name)}
                                    title={item.name}
                                >
                                    <span className={`mart-dot mart-dot-${item.contour}`}></span>
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Stream sidebar */}
                <div className={`mart-sidebar${streamCollapsed ? ' mart-sidebar-collapsed' : ''}`}>
                    <div className="mart-sidebar-header">
                        {!streamCollapsed && (
                            <>
                                <span className="mart-sidebar-title">Потоки</span>
                                <span className="mart-count">{streams.length}</span>
                            </>
                        )}
                        <button
                            type="button"
                            className="mart-collapse-btn"
                            onClick={() => setStreamCollapsed(v => !v)}
                            title={streamCollapsed ? 'Развернуть' : 'Свернуть'}
                        >
                            <i className={`fas fa-angle-double-${streamCollapsed ? 'right' : 'left'}`}></i>
                        </button>
                    </div>
                    {streams.map(s => (
                        <div
                            key={s.id}
                            className={`mart-item${s.id === activeStream ? ' active' : ''}`}
                            onClick={() => setActiveStream(s.id)}
                            title={s.name}
                        >
                            <i className="fas fa-stream" style={{ fontSize: 10, color: '#888', flexShrink: 0 }}></i>
                            {s.name}
                        </div>
                    ))}
                </div>

                {/* Content */}
                <div className="mart-content">
                    {activeCluster && activeStream && (
                        <div className="mart-group">
                            <button
                                type="button"
                                className="mart-title mart-title-toggle"
                                onClick={() => setSectionOpen(v => !v)}
                            >
                                <i className="fas fa-sliders-h"></i>
                                Параметры фреймворка
                                <span className="mart-chevron">{sectionOpen ? '▼' : '▶'}</span>
                            </button>

                            {sectionOpen && (
                                <>
                                    {currentVars.map((row, i) => (
                                        <div key={i} className="mart-sql-row">
                                            <input
                                                className="mart-input"
                                                placeholder="Ключ"
                                                value={row.key}
                                                disabled={readonly}
                                                onChange={e => updateRow(i, 'key', e.target.value)}
                                            />
                                            <input
                                                className="mart-input"
                                                placeholder="Значение"
                                                value={row.value}
                                                disabled={readonly}
                                                onChange={e => updateRow(i, 'value', e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                className="mart-del"
                                                disabled={readonly}
                                                onClick={() => delRow(i)}
                                                title="Удалить"
                                            >✕</button>
                                        </div>
                                    ))}
                                    <div style={{ marginTop: 10 }}>
                                        <button
                                            type="button"
                                            className="mart-add"
                                            disabled={readonly}
                                            onClick={addRow}
                                        >
                                            <i className="fas fa-plus"></i> Добавить параметр
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function EditDatamartModal({ datamart, onClose, onSave, onDelete }) {
    const [tab, setTab] = useState('passport');
    const [readonly, setReadonly] = useState(true);
    const [passport, setPassport] = useState(() => passportToForm(datamart));
    const [clusterFrameworkVars, setClusterFrameworkVars] = useState(
        () => datamart.passport?.clusterFrameworkVars || {}
    );

    // Reset to passport tab only when a different datamart is opened
    useEffect(() => {
        setTab('passport');
    }, [datamart.id]);

    // Sync form state when datamart data changes (e.g. after save), keep readonly as-is
    useEffect(() => {
        setPassport(passportToForm(datamart));
        setClusterFrameworkVars(datamart.passport?.clusterFrameworkVars || {});
    }, [datamart]);

    function handleEdit() { setReadonly(false); }

    function handleDiscard() {
        setPassport(passportToForm(datamart));
        setClusterFrameworkVars(datamart.passport?.clusterFrameworkVars || {});
        setReadonly(true);
    }

    async function handleSave() {
        const clusters = checkedToNames(passport.clusterChecked);
        await onSave(datamart.id, {
            name: passport.datamartName.trim() || datamart.name,
            displayName: passport.displayName.trim() || passport.datamartName.trim() || datamart.name,
            owner: passport.owner.trim() || datamart.owner,
            passport: {
                displayName: passport.displayName.trim(),
                owner: passport.owner.trim(),
                block: passport.block.trim(),
                datamartGroup: passport.datamartGroup.trim(),
                datamartName: passport.datamartName.trim(),
                ciItService: passport.ciItService.trim(),
                ciAsFp: passport.ciAsFp.trim(),
                sqPrKey: passport.sqPrKey.trim(),
                emails: passport.emails.trim(),
                externalLibs: passport.externalLibs.trim(),
                lineup: passport.lineup,
                clusters,
                clusterFrameworkVars,
            },
        });
        setReadonly(true);
    }

    return (
        <div
            id="editModal"
            className="modal passport-modal active"
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="modal-content passport-modal-content" style={{ overflow: 'hidden' }}>
                <div className="modal-header passport-modal-header">
                    <div className="passport-modal-title-wrap">
                        <i className="fas fa-id-card passport-modal-icon"></i>
                        <div>
                            <div className="modal-title">Редактирование витрины</div>
                            <div className="passport-modal-subtitle">Просмотр и редактирование параметров витрины</div>
                        </div>
                    </div>
                    <button className="modal-close" type="button" onClick={onClose}>&times;</button>
                </div>

                {/* body: flex:1 + minHeight:0 ensures it never pushes the footer off screen */}
                <div
                    className="modal-body passport-modal-body"
                    style={{ flex: '1 1 0', minHeight: 0, overflowY: 'auto' }}
                >
                    <div className="modal-tab-nav">
                        <button
                            type="button"
                            className={`modal-tab-btn${tab === 'passport' ? ' active' : ''}`}
                            onClick={() => setTab('passport')}
                        >Паспорт витрины</button>
                        <button
                            type="button"
                            className={`modal-tab-btn${tab === 'framework' ? ' active' : ''}`}
                            onClick={() => setTab('framework')}
                        >Параметры фреймворка</button>
                    </div>

                    {tab === 'passport' && (
                        <div className="modal-tab-pane active" style={{ minHeight: 'unset' }}>
                            <PassportSection values={passport} onChange={setPassport} readonly={readonly} />
                        </div>
                    )}

                    {tab === 'framework' && (
                        <div className="modal-tab-pane active" style={{ minHeight: 'unset' }}>
                            <FrameworkPane
                                passport={passport}
                                clusterFrameworkVars={clusterFrameworkVars}
                                onChange={setClusterFrameworkVars}
                                readonly={readonly}
                                pages={datamart.designerState?.pages || datamart.pages || []}
                            />
                        </div>
                    )}
                </div>

                <div className="modal-footer" style={{ justifyContent: 'space-between', flexShrink: 0 }}>
                    {readonly ? (
                        <>
                            <button
                                className="btn btn-danger-soft"
                                type="button"
                                onClick={() => onDelete(datamart.id)}
                            >Удалить витрину</button>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button className="btn btn-secondary" type="button" onClick={onClose}>Отмена</button>
                                <button
                                    className="btn btn-secondary"
                                    type="button"
                                    onClick={handleEdit}
                                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                                >
                                    <i className="fas fa-pencil-alt"></i> Редактировать
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
                            <button className="btn btn-secondary" type="button" onClick={handleDiscard}>
                                Отменить
                            </button>
                            <button className="btn btn-primary" type="button" onClick={handleSave}>
                                Сохранить
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
