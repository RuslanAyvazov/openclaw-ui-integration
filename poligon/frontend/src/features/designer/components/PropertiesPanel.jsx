import { useEffect, useRef, useState } from 'react';
import { TYPE_LABELS } from '../constants';
import { generateSql } from '../utils';
import SqlEditorModal from './SqlEditorModal';

// ─── small helpers ────────────────────────────────────────────────────────────

function Group({ title, children }) {
    return (
        <div className="property-group">
            <div className="property-title">{title}</div>
            {children}
        </div>
    );
}

function Field({ label, children }) {
    return (
        <div className="property-item">
            <label className="property-label">{label}</label>
            {children}
        </div>
    );
}

function Inp({ value, onChange, placeholder, type = 'text', readOnly, ...rest }) {
    return <input className="property-input" type={type} value={value ?? ''} onChange={onChange}
        placeholder={placeholder} readOnly={readOnly} {...rest} />;
}

function Sel({ value, onChange, options }) {
    return (
        <select className="property-input" value={value ?? ''} onChange={onChange}>
            {options.map(o => typeof o === 'string'
                ? <option key={o} value={o}>{o}</option>
                : <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
    );
}

function Txt({ value, onChange, placeholder, rows = 3 }) {
    return <textarea className="property-input" rows={rows} value={value ?? ''} onChange={onChange} placeholder={placeholder} />;
}

function Chk({ checked, onChange, label }) {
    return (
        <label className="property-checkbox">
            <input type="checkbox" checked={!!checked} onChange={onChange} />
            {label}
        </label>
    );
}

const btnSm = { fontSize: 11, padding: '3px 8px', marginTop: 4 };
const clusterBox = { marginBottom: 10, border: '1px solid #dbe4ef', borderRadius: 6, padding: '8px 10px', background: '#fafbfc' };
const kvRow = { display: 'flex', gap: 4, marginBottom: 4, alignItems: 'center' };

// ─── Spark panel ──────────────────────────────────────────────────────────────

function MartLabel({ label, hint }) {
    return (
        <div className="mart-label">
            {label} {hint && <span className="hint">{hint}</span>}
        </div>
    );
}

function Chevron({ collapsed }) {
    return <i className={`fas fa-chevron-${collapsed ? 'right' : 'down'}`} style={{ fontSize: 10 }}></i>;
}

function SparkPanel({ cfg, onChange }) {
    const set = (k, v) => onChange({ [k]: v });

    // ui-local collapse state
    const [collapsedCommon, setCollapsedCommon] = useState(false);
    const [collapsedIndividual, setCollapsedIndividual] = useState(false);
    const [clusterCollapsed, setClusterCollapsed] = useState({});
    const [subCollapsed, setSubCollapsed] = useState({}); // key: `${cid}:${section}`
    const [profileCollapsed, setProfileCollapsed] = useState({}); // key: `${cid}:${pid}`

    const toggle = (setter, key) => setter(prev => ({ ...prev, [key]: !prev[key] }));
    const isSubCollapsed   = (cid, s) => subCollapsed[`${cid}:${s}`];
    const isProfCollapsed  = (cid, pid) => profileCollapsed[`${cid}:${pid}`];

    // common params
    const addCommon    = () => onChange({ commonParams: [...(cfg.commonParams || []), { key: '', value: '' }] });
    const setCommon    = (i, f, v) => onChange({ commonParams: cfg.commonParams.map((p, idx) => idx === i ? { ...p, [f]: v } : p) });
    const removeCommon = (i) => onChange({ commonParams: cfg.commonParams.filter((_, idx) => idx !== i) });

    // clusters
    const addCluster = () => onChange({ clusters: [...(cfg.clusters || []), {
        id: `c${Date.now()}`, name: `cluster_${(cfg.clusters || []).length + 1}`,
        yarnQueue: '', userName: '',
        executorJavaOpts: '', driverJavaOpts: '',
        profiles: [],
    }] });
    const removeCluster = (cid) => onChange({ clusters: cfg.clusters.filter(c => c.id !== cid) });
    const setCluster    = (cid, f, v) => onChange({ clusters: cfg.clusters.map(c => c.id === cid ? { ...c, [f]: v } : c) });

    // profiles
    const addProfile = (cid) => onChange({ clusters: cfg.clusters.map(c => c.id === cid
        ? { ...c, profiles: [...c.profiles, { id: `p${Date.now()}`, name: 'spark_submit_cmd_new', tone: 'mid', params: [] }] }
        : c) });
    const removeProfile  = (cid, pid) => onChange({ clusters: cfg.clusters.map(c => c.id === cid ? { ...c, profiles: c.profiles.filter(p => p.id !== pid) } : c) });
    const setProfileName = (cid, pid, v) => onChange({ clusters: cfg.clusters.map(c => c.id === cid ? { ...c, profiles: c.profiles.map(p => p.id === pid ? { ...p, name: v } : p) } : c) });
    const addProfileParam    = (cid, pid) => onChange({ clusters: cfg.clusters.map(c => c.id === cid ? { ...c, profiles: c.profiles.map(p => p.id === pid ? { ...p, params: [...p.params, { key: '', value: '' }] } : p) } : c) });
    const setProfileParam    = (cid, pid, i, f, v) => onChange({
        clusters: cfg.clusters.map(c => c.id === cid ? {
            ...c, profiles: c.profiles.map(p => p.id === pid ? { ...p, params: p.params.map((pr, idx) => idx === i ? { ...pr, [f]: v } : pr) } : p)
        } : c)
    });
    const removeProfileParam = (cid, pid, i) => onChange({ clusters: cfg.clusters.map(c => c.id === cid ? { ...c, profiles: c.profiles.map(p => p.id === pid ? { ...p, params: p.params.filter((_, idx) => idx !== i) } : p) } : c) });

    const toneLetter = (name, tone) => {
        if (tone === 'low') return 'L';
        if (tone === 'mid') return 'M';
        if (tone === 'high') return 'H';
        if (tone === 'super') return 'S';
        return (name || '?').charAt(0).toUpperCase();
    };

    return (<>
        {/* Section 1: Common params */}
        <div className="mart-group">
            <div className="flow-title">
                <i className="fas fa-globe"></i>
                Общие параметры для всех кластеров
                <button type="button" className="mart-del" style={{ marginLeft: 'auto' }} onClick={() => setCollapsedCommon(c => !c)}>
                    <Chevron collapsed={collapsedCommon} />
                </button>
            </div>

            {!collapsedCommon && (<>
                {(cfg.commonParams || []).map((p, i) => (
                    <div key={i} className="mart-sql-row">
                        <input className="mart-input" value={p.key} onChange={e => setCommon(i, 'key', e.target.value)} placeholder="Ключ" />
                        <input className="mart-input" value={p.value} onChange={e => setCommon(i, 'value', e.target.value)} placeholder="Значение" />
                        <button type="button" className="mart-del" onClick={() => removeCommon(i)}>&#x2715;</button>
                    </div>
                ))}
                <button type="button" className="mart-add" onClick={addCommon}>
                    <i className="fas fa-plus"></i> Добавить общий параметр
                </button>
            </>)}
        </div>

        {/* Section 2: Individual cluster params */}
        <div className="mart-group">
            <div className="flow-title">
                <i className="fas fa-sitemap"></i>
                Индивидуальные параметры кластеров
                <button type="button" className="mart-del" style={{ marginLeft: 'auto' }} onClick={() => setCollapsedIndividual(c => !c)}>
                    <Chevron collapsed={collapsedIndividual} />
                </button>
            </div>

            {!collapsedIndividual && (<>
                {(cfg.clusters || []).map(c => {
                    const clusterHidden = clusterCollapsed[c.id];
                    return (
                        <div key={c.id} className="mart-group spark-cluster-level">
                            <div className="flow-title">
                                <i className="fas fa-server"></i>
                                <input className="mart-input" style={{ flex: 1, minWidth: 0, padding: '4px 8px', textTransform: 'none' }}
                                    value={c.name} onChange={e => setCluster(c.id, 'name', e.target.value)} />
                                <button type="button" className="mart-del" onClick={() => toggle(setClusterCollapsed, c.id)}>
                                    <Chevron collapsed={clusterHidden} />
                                </button>
                                <button type="button" className="mart-del" onClick={() => removeCluster(c.id)} title="Удалить кластер">
                                    &#x2715;
                                </button>
                            </div>

                            {!clusterHidden && (<>
                                {/* Infrastructure */}
                                <div className="mart-group spark-cluster-sublevel">
                                    <button type="button" className="flow-title spark-subsection-toggle" onClick={() => toggle(setSubCollapsed, `${c.id}:infra`)}>
                                        <i className="fas fa-id-badge"></i>
                                        Инфраструктура кластера
                                        <span className="spark-sub-chevron"><Chevron collapsed={isSubCollapsed(c.id, 'infra')} /></span>
                                    </button>
                                    {!isSubCollapsed(c.id, 'infra') && (
                                        <div className="mart-grid">
                                            <div className="mart-row">
                                                <MartLabel label="YARN queue" hint="YARN_QUEUE" />
                                                <input className="mart-input" value={c.yarnQueue}
                                                    onChange={e => setCluster(c.id, 'yarnQueue', e.target.value)} />
                                            </div>
                                            <div className="mart-row">
                                                <MartLabel label="Пользователь" hint="USER_NAME" />
                                                <input className="mart-input" value={c.userName}
                                                    onChange={e => setCluster(c.id, 'userName', e.target.value)} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* JVM options */}
                                <div className="mart-group spark-cluster-sublevel">
                                    <button type="button" className="flow-title spark-subsection-toggle" onClick={() => toggle(setSubCollapsed, `${c.id}:jvm`)}>
                                        <i className="fas fa-microchip"></i>
                                        JVM опции для Spark
                                        <span className="spark-sub-chevron"><Chevron collapsed={isSubCollapsed(c.id, 'jvm')} /></span>
                                    </button>
                                    {!isSubCollapsed(c.id, 'jvm') && (
                                        <div className="mart-grid">
                                            <div className="mart-row">
                                                <MartLabel label="Executor Java options" hint="spark_executor_extraJavaOptions" />
                                                <textarea className="mart-text" rows={2} value={c.executorJavaOpts}
                                                    onChange={e => setCluster(c.id, 'executorJavaOpts', e.target.value)} />
                                            </div>
                                            <div className="mart-row">
                                                <MartLabel label="Driver Java options" hint="spark_driver_extraJavaOptions" />
                                                <textarea className="mart-text" rows={2} value={c.driverJavaOpts}
                                                    onChange={e => setCluster(c.id, 'driverJavaOpts', e.target.value)} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Profiles */}
                                <div className="mart-group spark-cluster-sublevel">
                                    <button type="button" className="flow-title spark-subsection-toggle" onClick={() => toggle(setSubCollapsed, `${c.id}:profiles`)}>
                                        <i className="fas fa-layer-group"></i>
                                        Профили ресурсов Spark
                                        <span className="spark-sub-chevron"><Chevron collapsed={isSubCollapsed(c.id, 'profiles')} /></span>
                                    </button>
                                    {!isSubCollapsed(c.id, 'profiles') && (<>
                                        <div className="engine-profile-stack">
                                            {c.profiles.map(prof => {
                                                const hidden = isProfCollapsed(c.id, prof.id);
                                                return (
                                                    <div key={prof.id} className="flow-card">
                                                        <div className="flow-card-head">
                                                            <div className="flow-card-name">
                                                                <span className={`flow-prof-icon flow-prof-${prof.tone || 'mid'}`}>
                                                                    {toneLetter(prof.name, prof.tone)}
                                                                </span>
                                                                <input className="param-input monospace"
                                                                    value={prof.name}
                                                                    onChange={e => setProfileName(c.id, prof.id, e.target.value)} />
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                <button type="button" className="mart-del" onClick={() => toggle(setProfileCollapsed, `${c.id}:${prof.id}`)}>
                                                                    <Chevron collapsed={hidden} />
                                                                </button>
                                                                <button type="button" className="mart-del" onClick={() => removeProfile(c.id, prof.id)}>
                                                                    &#x2715;
                                                                </button>
                                                            </div>
                                                        </div>
                                                        {!hidden && (<>
                                                            {prof.params.map((pr, i) => (
                                                                <div key={i} className="mart-sql-row">
                                                                    <input className="mart-input" value={pr.key}
                                                                        onChange={e => setProfileParam(c.id, prof.id, i, 'key', e.target.value)} />
                                                                    <input className="mart-input" value={pr.value}
                                                                        onChange={e => setProfileParam(c.id, prof.id, i, 'value', e.target.value)} />
                                                                    <button type="button" className="mart-del" onClick={() => removeProfileParam(c.id, prof.id, i)}>&#x2715;</button>
                                                                </div>
                                                            ))}
                                                            <button type="button" className="mart-add" onClick={() => addProfileParam(c.id, prof.id)}>
                                                                <i className="fas fa-plus"></i> Добавить параметр
                                                            </button>
                                                        </>)}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <button type="button" className="mart-add" style={{ marginTop: 8 }} onClick={() => addProfile(c.id)}>
                                            <i className="fas fa-plus"></i> Добавить профиль
                                        </button>
                                    </>)}
                                </div>
                            </>)}
                        </div>
                    );
                })}
                <button type="button" className="mart-add" onClick={addCluster}>
                    <i className="fas fa-plus"></i> Добавить кластер
                </button>
            </>)}
        </div>

        {/* Section 3: Iceberg */}
        <div className="mart-group">
            <div className="flow-title">
                <i className="fas fa-link"></i>
                Настройки Iceberg подключения
            </div>
            <div className="mart-grid">
                <div className="mart-row">
                    <MartLabel label="spark.sql.catalog.iceberg" />
                    <input className="mart-input" value={cfg.icebergCatalog} onChange={e => set('icebergCatalog', e.target.value)} placeholder="hadoop_prod" />
                </div>
                <div className="mart-row">
                    <MartLabel label="spark.sql.catalog.iceberg.warehouse" />
                    <input className="mart-input" value={cfg.icebergWarehouse} onChange={e => set('icebergWarehouse', e.target.value)} placeholder="hdfs:///data/iceberg/warehouse" />
                </div>
                <div className="mart-row">
                    <MartLabel label="spark.sql.catalog.iceberg.uri" />
                    <input className="mart-input" value={cfg.icebergUri} onChange={e => set('icebergUri', e.target.value)} placeholder="thrift://hms-prod:9083" />
                </div>
                <div className="mart-row">
                    <MartLabel label="spark.sql.catalog.iceberg.default-namespace" />
                    <input className="mart-input" value={cfg.icebergNamespace} onChange={e => set('icebergNamespace', e.target.value)} placeholder="custom_b2c" />
                </div>
            </div>
        </div>
    </>);
}

// ─── Flink panel ──────────────────────────────────────────────────────────────

function FlinkPanel({ cfg, onChange }) {
    return (
        <Group title="Flink runtime">
            <Field label="parallelism.default">
                <Inp type="number" value={cfg.parallelism} onChange={e => onChange({ parallelism: e.target.value })} placeholder="4" />
            </Field>
            <Field label="execution.checkpointing.interval">
                <Inp value={cfg.checkpointInterval} onChange={e => onChange({ checkpointInterval: e.target.value })} placeholder="30s" />
            </Field>
        </Group>
    );
}

// ─── Checkpoint panel ─────────────────────────────────────────────────────────

function CheckpointPanel({ cfg, onChange }) {
    return (
        <Group title="Параметры Checkpoints">
            <div className="json-field">
                <div className="json-field-title">b2c.sql.pipelines.manager.mode</div>
                <Chk checked={true} onChange={() => {}} label="enabled (всегда включено)" />
            </div>
            <Field label="b2c.sql.pipelines.startMode">
                <Sel value={cfg.startMode} onChange={e => onChange({ startMode: e.target.value })}
                    options={['FROM_START', 'FROM_FAILED_PIPELINE']} />
            </Field>
        </Group>
    );
}

// ─── Element type-specific params ─────────────────────────────────────────────

function ElementTypeParams({ element, params, setParam }) {
    const { type, subtype } = element;

    if (type === 'data' && subtype === 'kafka2hdfs') return (<>
        <Field label="Kafka топик"><Inp value={params.kafkaTopic} onChange={e => setParam('kafkaTopic', e.target.value)} placeholder="topic.name" /></Field>
        <Field label="Kafka brokers"><Inp value={params.kafkaBrokers} onChange={e => setParam('kafkaBrokers', e.target.value)} placeholder="host:9092" /></Field>
        <Field label="HDFS путь"><Inp value={params.hdfsPath} onChange={e => setParam('hdfsPath', e.target.value)} placeholder="/data/raw/" /></Field>
        <Field label="Batch интервал (сек)"><Inp type="number" value={params.batchInterval} onChange={e => setParam('batchInterval', e.target.value)} placeholder="60" /></Field>
    </>);

    if (type === 'data' && subtype === 'getdata') return (<>
        <Field label="Источник (таблица)"><Inp value={params.sourceTable} onChange={e => setParam('sourceTable', e.target.value)} placeholder="db.table_name" /></Field>
        <Field label="Фильтр (WHERE)"><Txt rows={2} value={params.filterCond} onChange={e => setParam('filterCond', e.target.value)} placeholder="dt >= '2024-01-01'" /></Field>
        <Field label="Колонка партиции"><Inp value={params.partitionCol} onChange={e => setParam('partitionCol', e.target.value)} placeholder="dt" /></Field>
    </>);

    if (type === 'data' && subtype === 's2t') return (<>
        <Field label="Поток (stream name)"><Inp value={params.streamName} onChange={e => setParam('streamName', e.target.value)} placeholder="stream_input" /></Field>
        <Field label="Целевая таблица"><Inp value={params.targetTable} onChange={e => setParam('targetTable', e.target.value)} placeholder="db.target" /></Field>
        <Field label="Режим записи">
            <Sel value={params.writeMode || 'append'} onChange={e => setParam('writeMode', e.target.value)} options={['append', 'overwrite']} />
        </Field>
    </>);

    if (type === 'query' && subtype === 'transform') return (<>
        <Field label="SQL запрос"><Txt rows={5} value={params.sql} onChange={e => setParam('sql', e.target.value)} placeholder="SELECT * FROM source" /></Field>
        <Field label="Выходная таблица"><Inp value={params.outputTable} onChange={e => setParam('outputTable', e.target.value)} placeholder="db.result" /></Field>
    </>);

    if (type === 'query' && subtype === 'history') return (<>
        <Field label="Режим">
            <Sel value={params.mode || 'baseline'} onChange={e => setParam('mode', e.target.value)} options={[
                'baseline', 'bs_wt_delete_soft', 'bs_wt_delete_hard', 'bs_wt_delete_full',
                'full_reload', 'partial_reload', 'fs_full_reload',
                'baseline_fullcut', 'full_reload_fullcut', 'partial_reload_fullcut',
            ]} />
        </Field>
        <Field label="incr_table"><Inp value={params.incr_table} onChange={e => setParam('incr_table', e.target.value)} placeholder="stg_schema.stg_table_name" /></Field>
        <Field label="pa_table"><Inp value={params.pa_table} onChange={e => setParam('pa_table', e.target.value)} placeholder="pa_schema.pa_table_name" /></Field>
        <Field label="hist_table"><Inp value={params.hist_table} onChange={e => setParam('hist_table', e.target.value)} placeholder="hist_schema.hist_table_name" /></Field>
        <Field label="mapping_inc"><Txt rows={2} value={params.mapping_inc} onChange={e => setParam('mapping_inc', e.target.value)} placeholder="storeid, itemid, qty, price, report_dt" /></Field>
        <Field label="mapping_pa"><Txt rows={2} value={params.mapping_pa} onChange={e => setParam('mapping_pa', e.target.value)} placeholder="storeid, itemid, qty, price, start_dttm" /></Field>
        <Field label="pk_inc"><Inp value={params.pk_inc} onChange={e => setParam('pk_inc', e.target.value)} placeholder="storeid, itemid, report_dt" /></Field>
        <Field label="pk_pa"><Inp value={params.pk_pa} onChange={e => setParam('pk_pa', e.target.value)} placeholder="storeid, itemid, start_dttm" /></Field>
        <Field label="hash_policy_algo">
            <Sel value={params.hash_policy_algo || 'sha256'} onChange={e => setParam('hash_policy_algo', e.target.value)} options={['sha256', 'md5']} />
        </Field>
        <Field label="hash_policy_exclude_cols"><Inp value={params.hash_policy_exclude_cols} onChange={e => setParam('hash_policy_exclude_cols', e.target.value)} placeholder="column_a, column_b" /></Field>
        <Field label="hash_policy_hash_col"><Inp value={params.hash_policy_hash_col} onChange={e => setParam('hash_policy_hash_col', e.target.value)} placeholder="row_hash" /></Field>
        <Field label="dedup_order_by"><Inp value={params.dedup_order_by} onChange={e => setParam('dedup_order_by', e.target.value)} placeholder="report_dt asc" /></Field>
    </>);

    if (type === 'query' && subtype === 'quality') return (<>
        <Field label="Правила проверки"><Txt rows={4} value={params.rules} onChange={e => setParam('rules', e.target.value)} placeholder={"NOT NULL: id\nUNIQUE: id\nRANGE: amount > 0"} /></Field>
        <Field label="Порог качества (%)"><Inp type="number" min={0} max={100} value={params.threshold} onChange={e => setParam('threshold', e.target.value)} placeholder="95" /></Field>
    </>);

    if (type === 'query' && subtype === 'reconciliation') return (<>
        <Field label="Эталонная таблица"><Inp value={params.refTable} onChange={e => setParam('refTable', e.target.value)} placeholder="db.reference" /></Field>
        <Field label="Ключ соединения"><Inp value={params.joinKey} onChange={e => setParam('joinKey', e.target.value)} placeholder="id" /></Field>
        <Field label="Допустимое отклонение"><Inp type="number" value={params.tolerance} onChange={e => setParam('tolerance', e.target.value)} placeholder="0.01" /></Field>
    </>);

    if (type === 'insert' && subtype === 'coalesce') return (<>
        <Field label="Таблицы"><Txt rows={2} value={params.tables} onChange={e => setParam('tables', e.target.value)} placeholder="test_table1, test_table2" /></Field>
        <Field label="Схема"><Inp value={params.schema} onChange={e => setParam('schema', e.target.value)} placeholder="test_schema" /></Field>
        <Field label="target_file_size_mb"><Inp type="number" min={1} value={params.target_file_size_mb} onChange={e => setParam('target_file_size_mb', e.target.value)} placeholder="128" /></Field>
        <Field label="compression_codec">
            <Sel value={params.compression_codec || 'zstd'} onChange={e => setParam('compression_codec', e.target.value)} options={['zstd', 'snappy', 'gzip']} />
        </Field>
        <Field label="parallel_degree"><Inp type="number" min={1} value={params.parallel_degree} onChange={e => setParam('parallel_degree', e.target.value)} placeholder="4" /></Field>
        <Field label="snapshot_retention"><Inp type="number" min={0} value={params.snapshot_retention} onChange={e => setParam('snapshot_retention', e.target.value)} placeholder="7" /></Field>
        <Field label="include_partitions"><Txt rows={2} value={params.include_partitions} onChange={e => setParam('include_partitions', e.target.value)} placeholder="dt='2024-01-01'" /></Field>
        <Field label="exclude_partitions"><Txt rows={2} value={params.exclude_partitions} onChange={e => setParam('exclude_partitions', e.target.value)} placeholder="dt='2024-01-02'" /></Field>
        <Field label="analyze_by">
            <Sel value={params.analyze_by || ''} onChange={e => setParam('analyze_by', e.target.value)} options={[{ value: '', label: '—' }, { value: 'abc', label: 'abc' }]} />
        </Field>
        <Field label="custom_strategy"><Txt rows={4} value={params.custom_strategy} onChange={e => setParam('custom_strategy', e.target.value)} placeholder="optional custom strategy code" /></Field>
        <div className="json-field">
            <div className="json-field-title">Сервисные флаги</div>
            <Chk checked={params.rewrite_manifests} onChange={e => setParam('rewrite_manifests', e.target.checked)} label="rewrite_manifests" />
            <Chk checked={params.delete_orphan_files} onChange={e => setParam('delete_orphan_files', e.target.checked)} label="delete_orphan_files" />
        </div>
    </>);

    if (type === 'insert' && subtype === 'hdfs2hbase') return (<>
        <Field label="HBase таблица"><Inp value={params.hbaseTable} onChange={e => setParam('hbaseTable', e.target.value)} placeholder="namespace:table" /></Field>
        <Field label="Row key колонка"><Inp value={params.rowKeyCol} onChange={e => setParam('rowKeyCol', e.target.value)} placeholder="id" /></Field>
        <Field label="Column family"><Inp value={params.columnFamily} onChange={e => setParam('columnFamily', e.target.value)} placeholder="cf" /></Field>
    </>);

    if (type === 'insert' && subtype === 'hdfs2kafka') return (<>
        <Field label="Kafka топик"><Inp value={params.kafkaTopic} onChange={e => setParam('kafkaTopic', e.target.value)} placeholder="output.topic" /></Field>
        <Field label="Kafka brokers"><Inp value={params.kafkaBrokers} onChange={e => setParam('kafkaBrokers', e.target.value)} placeholder="host:9092" /></Field>
        <Field label="Формат сериализации">
            <Sel value={params.serializationFormat || 'json'} onChange={e => setParam('serializationFormat', e.target.value)} options={['json', 'avro', 'protobuf']} />
        </Field>
    </>);

    if (type === 'insert' && subtype === 'move2pa') return (<>
        <Field label="PA таблица"><Inp value={params.pa_table} onChange={e => setParam('pa_table', e.target.value)} placeholder="pa_schema.pa_table_name" /></Field>
        <Field label="Hist таблица"><Inp value={params.hist_table} onChange={e => setParam('hist_table', e.target.value)} placeholder="hist_schema.hist_table_name" /></Field>
    </>);

    if (type === 'recovery' && subtype === 'rollback') return (
        <Field label="Целевой чекпоинт"><Inp value={params.rollbackTarget} onChange={e => setParam('rollbackTarget', e.target.value)} placeholder="checkpoint_name" /></Field>
    );

    return null;
}

// ─── main component ───────────────────────────────────────────────────────────

export default function PropertiesPanel({
    element, panelSubject,
    sparkConfig, flinkConfig, checkpointConfig,
    onClose, onUpdate, onSparkConfigUpdate, onFlinkConfigUpdate, onCheckpointConfigUpdate,
    width, onWidthChange,
}) {
    const resizing = useRef(false);
    const startX = useRef(0);
    const startW = useRef(0);

    // Дефолтная ширина подобрана так, чтобы подписи в ячейках умещались
    // целиком; спарк-панель шире (длинные ключи spark.*). Сжать панель уже
    // дефолта нельзя — только расширить.
    const defaultWidth = panelSubject === 'spark' ? 430 : 360;
    const minWidthRef = useRef(defaultWidth);
    minWidthRef.current = defaultWidth;

    useEffect(() => {
        if (width < defaultWidth) onWidthChange(defaultWidth);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultWidth]);

    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [enabled, setEnabled] = useState(true);
    const [params, setParams] = useState({});
    const [sqlModalOpen, setSqlModalOpen] = useState(false);

    useEffect(() => {
        setTitle(element?.title || '');
        setComment(element?.moduleComment || '');
        setEnabled(element?.moduleEnabled ?? true);
        setParams(element?.params || {});
    }, [element?.id]);

    useEffect(() => {
        function onMove(e) {
            if (!resizing.current) return;
            const delta = startX.current - e.clientX;
            onWidthChange(Math.max(minWidthRef.current, Math.min(640, startW.current + delta)));
        }
        function onUp() {
            resizing.current = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    }, [onWidthChange]);

    function startResize(e) {
        resizing.current = true;
        startX.current = e.clientX;
        startW.current = width;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    }

    function setParam(key, value) { setParams(prev => ({ ...prev, [key]: value })); }

    function saveElement() {
        if (element) onUpdate(element.id, { title, moduleComment: comment, moduleEnabled: enabled, params });
    }

    const hasElement = !!element;
    const hasSubject = !!panelSubject;
    const active = hasElement || hasSubject;

    let headerTitle = 'Свойства';
    if (hasElement) headerTitle = 'Свойства элемента';
    else if (panelSubject === 'spark') headerTitle = 'Spark — настройки';
    else if (panelSubject === 'flink') headerTitle = 'Flink — настройки';
    else if (panelSubject === 'checkpoint') headerTitle = 'Checkpoints';

    const hasTypeParams = hasElement && ['data', 'query', 'insert', 'recovery'].includes(element.type);
    const hasSqlPreview = hasElement && ['history', 'coalesce', 'move2pa'].includes(element.subtype);
    const previewSql = hasSqlPreview ? generateSql({ ...element, params }) : '';
    const savedSql = element?.params?.editedSql;
    const displaySql = savedSql || previewSql;

    return (
        <>
        <div className={`properties-panel${active ? ' active' : ''}`} style={{ width, minWidth: width }}>
            <div className="properties-resizer" onMouseDown={startResize}></div>

            <div className="properties-header">
                <span className="properties-header-title">{headerTitle}</span>
                {active && <button className="properties-close-btn" onClick={onClose}>&#x2715;</button>}
            </div>

            <div className="properties-panel-scroll">
                {hasElement ? (
                    <>
                        <Group title="Настройки модуля">
                            <div className="json-field">
                                <div className="json-field-title">Статус</div>
                                <Chk checked={enabled} onChange={e => setEnabled(e.target.checked)} label="Включить модуль" />
                            </div>
                            <Field label="Комментарий">
                                <Txt rows={3} value={comment} onChange={e => setComment(e.target.value)} placeholder="Комментарий будет синхронизирован с SQL Editor" />
                            </Field>
                        </Group>

                        {hasTypeParams && (
                            <Group title="Параметры">
                                <ElementTypeParams element={element} params={params} setParam={setParam} />
                            </Group>
                        )}

                        {hasSqlPreview && (
                            <Group title="SQL Script">
                                <div className="sql-preview-wrap">
                                    <textarea
                                        className="sql-preview-text"
                                        readOnly
                                        spellCheck={false}
                                        value={displaySql}
                                        placeholder="SQL для выбранного элемента"
                                    />
                                    <div className="sql-preview-actions">
                                        <button className="btn btn-primary" type="button" onClick={() => setSqlModalOpen(true)}>
                                            Open SQL Editor
                                        </button>
                                    </div>
                                </div>
                            </Group>
                        )}
                    </>
                ) : panelSubject === 'spark' ? (
                    <SparkPanel cfg={sparkConfig} onChange={onSparkConfigUpdate} />
                ) : panelSubject === 'flink' ? (
                    <FlinkPanel cfg={flinkConfig} onChange={onFlinkConfigUpdate} />
                ) : panelSubject === 'checkpoint' ? (
                    <CheckpointPanel cfg={checkpointConfig} onChange={onCheckpointConfigUpdate} />
                ) : null}
            </div>

            {hasElement && (
                <div className="properties-footer">
                    <button className="properties-footer-btn save" onClick={saveElement}>
                        <i className="fas fa-check"></i> Сохранить
                    </button>
                    <button className="properties-footer-btn discard" onClick={onClose}>Отмена</button>
                </div>
            )}
        </div>

        {sqlModalOpen && hasSqlPreview && (
            <SqlEditorModal
                element={element}
                initialSql={displaySql}
                onSave={sql => {
                    setParam('editedSql', sql);
                    saveElement();
                }}
                onClose={() => setSqlModalOpen(false)}
            />
        )}
        </>
    );
}
