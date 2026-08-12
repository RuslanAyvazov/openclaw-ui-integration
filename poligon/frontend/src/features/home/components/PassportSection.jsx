import ClusterMatrix from './ClusterMatrix';

function HdfsPathPreview({ block, group, name, dataPath }) {
    function fix(t) { return <span className="hdfs-seg-fixed">{t}</span>; }
    function sep(t) { return <span className="hdfs-seg-sep">{t}</span>; }
    function par(v, ph) { return <span className="hdfs-seg-param">{v || `{${ph}}`}</span>; }

    if (dataPath) {
        return <>{fix('hdfs:///data/custom')}{sep('/')}{par(block,'block')}{sep('/')}{par(name,'datamart_name')}</>;
    }
    return <>{fix('hdfs:///oozie-app')}{sep('/')}{par(block,'block')}{sep('/')}{par(group,'group')}{sep('/')}{par(name,'datamart_name')}</>;
}

export default function PassportSection({ values, onChange, readonly = false }) {
    function f(key) {
        return {
            value: values[key] || '',
            onChange: e => !readonly && onChange({ ...values, [key]: e.target.value }),
            disabled: readonly,
        };
    }

    return (
        <>
            <div className="devops-section">
                <div className="devops-section-header">
                    <div className="devops-section-icon icon-blue"><i className="fas fa-id-card"></i></div>
                    <span className="devops-section-title">Идентификаторы витрины</span>
                    <span className="devops-section-desc">Задаются один раз при создании</span>
                </div>
                <div className="devops-section-body">
                    <div className="dv-grid col2">
                        <div className="param-row">
                            <div className="param-label">Название витрины</div>
                            <input className="param-input" placeholder="Например: Модель продаж" {...f('displayName')} />
                        </div>
                        <div className="param-row">
                            <div className="param-label">Владелец витрины</div>
                            <input className="param-input" placeholder="Например: user@company.ru" {...f('owner')} />
                        </div>
                    </div>
                    <hr className="dv-divider" />
                    <div className="dv-grid col3">
                        <div className="param-row">
                            <div className="param-label">Блок <span className="param-hint">block</span></div>
                            <input className="param-input" placeholder="Например: CX" {...f('block')} />
                        </div>
                        <div className="param-row">
                            <div className="param-label">Группа витрины <span className="param-hint">datamart_group</span></div>
                            <input className="param-input" placeholder="Например: autopay" {...f('datamartGroup')} />
                        </div>
                        <div className="param-row">
                            <div className="param-label">Имя витрины <span className="param-hint">datamart_name</span></div>
                            <input className="param-input" placeholder="Например: custom_b2c_agg_base" {...f('datamartName')} />
                        </div>
                    </div>
                    <div className="hdfs-inline-preview">
                        <div className="pm-preview-label">Путь в HDFS для витрины</div>
                        <div className="hdfs-path">
                            <HdfsPathPreview block={values.block} group={values.datamartGroup} name={values.datamartName} />
                        </div>
                    </div>
                    <div className="hdfs-inline-preview" style={{ marginTop: 8 }}>
                        <div className="pm-preview-label">Путь в HDFS для данных витрины</div>
                        <div className="hdfs-path">
                            <HdfsPathPreview block={values.block} name={values.datamartName} dataPath />
                        </div>
                    </div>
                    <hr className="dv-divider" />
                    <div className="dv-grid col2">
                        <div className="param-row">
                            <div className="param-label">КЭ ИТ-Услуга <span className="param-hint">ci_it_service</span></div>
                            <input className="param-input monospace" placeholder="CI05000000" {...f('ciItService')} />
                        </div>
                        <div className="param-row">
                            <div className="param-label">КЭ АС/ФП/Модуля <span className="param-hint">ci_as_fp</span></div>
                            <input className="param-input monospace" placeholder="CI05000000" {...f('ciAsFp')} />
                        </div>
                    </div>
                    <hr className="dv-divider" />
                    <div className="dv-grid col2">
                        <div className="param-row">
                            <div className="param-label">SonarQube Project Key <span className="param-hint">sq_pr_key</span></div>
                            <input className="param-input monospace" placeholder="b2c-sql-my_project" {...f('sqPrKey')} />
                        </div>
                        <div className="param-row">
                            <div className="param-label">Уведомления <span className="param-hint">emails</span></div>
                            <input className="param-input" placeholder="user@company.ru user2@company.ru" {...f('emails')} />
                            <div style={{ fontSize: 11, color: '#aaa', marginTop: 3 }}>Разделяются пробелом</div>
                        </div>
                    </div>
                    <hr className="dv-divider" />
                    <div className="param-row">
                        <div className="param-label">
                            Внешние библиотеки <span className="param-hint">external_libs</span>
                            <span className="dv-opt-badge">опц.</span>
                        </div>
                        <textarea
                            className="param-textarea"
                            rows={2}
                            placeholder="путь/к/lib1.jar путь/к/lib2.jar"
                            {...f('externalLibs')}
                        />
                    </div>
                </div>
            </div>

            <div className="devops-section" style={{ marginTop: 14 }}>
                <div className="devops-section-header">
                    <div className="devops-section-icon icon-teal"><i className="fas fa-th"></i></div>
                    <span className="devops-section-title">Линейка и кластеры</span>
                    <span className="devops-section-desc" style={{ marginLeft: 'auto' }}>stand_name + целевые кластеры</span>
                </div>
                <div className="devops-section-body">
                    <div className="info-banner" style={{ background: '#e8f4fd', borderColor: '#b3d7f5', color: '#1565c0' }}>
                        <i className="fas fa-info-circle"></i>
                        <div><b>Линейка (stand_name)</b> — группа контуров с кластерами. По оси X — контуры (dev, ift, psi, rdt, prom), по оси Y — кластеры внутри каждого контура. Выберите линейку и отметьте конкретные кластеры для деплоя.</div>
                    </div>
                    <ClusterMatrix
                        lineup={values.lineup || 'cxb2c'}
                        checked={values.clusterChecked || {}}
                        onLineupChange={v => onChange({ ...values, lineup: v, clusterChecked: {} })}
                        onToggle={id => {
                            const prev = values.clusterChecked || {};
                            onChange({ ...values, clusterChecked: { ...prev, [id]: !prev[id] } });
                        }}
                        readonly={readonly}
                    />
                </div>
            </div>
        </>
    );
}
