import { useEffect, useState, useCallback, useRef } from 'react';
import { request } from './api';

let pageSeq = 0;
// Date.now() alone collides when several pages are added in the same tick
// (e.g. loading a multi-stream project from the AI agent).
function nextPageId() { return `page-${Date.now().toString(36)}-${++pageSeq}`; }

function makeBlankPage(id, name) {
    const elements = [];
    const connections = [];
    return {
        id, name, elements, connections,
        branch: null, stream: null, locked: false,
        cleanFlow: JSON.stringify({ elements, connections }),
    };
}

// True when the page has unsaved changes vs its last import/save snapshot.
export function isPageDirty(page) {
    if (!page) return false;
    if (page.cleanFlow == null) return true; // legacy / never imported — treat as dirty
    return JSON.stringify({ elements: page.elements, connections: page.connections }) !== page.cleanFlow;
}

function makeInitialState() {
    return {
        // Новая витрина начинается БЕЗ потоков: они создаются кнопкой
        // «Добавить поток» или импортом ветки/потока (BranchStreamBar).
        pages: [],
        selectedEngine: null,
        ddlState: { script: false, source: false, sync: false },
        checkpointActive: false,
        sparkConfig: {
            commonParams: [
                { key: 'spark.submit.deployMode', value: '${b2c.sql.engine.spark.deploy}' },
                { key: 'spark.master', value: 'yarn' },
                { key: 'spark.yarn.maxAppAttempts', value: '1' },
                { key: 'spark.port.maxRetries', value: '50' },
                { key: 'spark.network.timeout', value: '600s' },
                { key: 'spark.serializer', value: 'org.apache.spark.serializer.KryoSerializer' },
                { key: 'spark.kryoserializer.buffer.max', value: '128M' },
                { key: 'spark.debug.maxToStringFields', value: '100' },
                { key: 'spark.dynamicAllocation.enabled', value: 'true' },
                { key: 'spark.dynamicAllocation.shuffleTracking.enabled', value: 'true' },
                { key: 'spark.shuffle.service.enabled', value: 'true' },
                { key: 'spark.hadoop.hive.exec.dynamic.partition', value: 'true' },
                { key: 'spark.hadoop.hive.exec.dynamic.partition.mode', value: 'nonstrict' },
                { key: 'spark.hadoop.mapreduce.input.fileinputformat.input.dir.recursive', value: 'true' },
                { key: 'spark.sql.broadcastTimeout', value: '6000' },
                { key: 'spark.sql.catalogImplementation', value: 'hive' },
                { key: 'spark.sql.inMemoryColumnarStorage.compressed', value: 'true' },
                { key: 'spark.sql.hive.convertMetastoreParquet', value: 'false' },
                { key: 'spark.sql.hive.manageFilesourcePartitions', value: 'false' },
                { key: 'spark.sql.mapKeyDedupPolicy', value: 'LAST_WIN' },
            ],
            clusters: [{
                id: 'c1', name: 'default',
                yarnQueue: '', userName: '',
                executorJavaOpts: '-XX:+UseCompressedOops -XX:+UseG1GC -XX:+UseNUMA -Dlog4j2.configurationFile=log4j2.xml',
                driverJavaOpts: '-XX:+UseCompressedOops -Dlog4j2.configurationFile=log4j2.xml',
                profiles: [
                    { id: 'p_low',   name: 'spark_submit_cmd_low',   tone: 'low', params: [
                        { key: 'executor-memory',                     value: '4g'   },
                        { key: 'executor-cores',                      value: '2'    },
                        { key: 'dynamicAllocation.maxExecutors',      value: '20'   },
                        { key: 'sql.shuffle.partitions',              value: '200'  },
                    ] },
                    { id: 'p_mid',   name: 'spark_submit_cmd_mid',   tone: 'mid', params: [
                        { key: 'executor-memory',                     value: '8g'   },
                        { key: 'executor-cores',                      value: '3'    },
                        { key: 'dynamicAllocation.maxExecutors',      value: '40'   },
                        { key: 'sql.shuffle.partitions',              value: '500'  },
                    ] },
                    { id: 'p_high',  name: 'spark_submit_cmd_high',  tone: 'high', params: [
                        { key: 'executor-memory',                     value: '12g'  },
                        { key: 'executor-cores',                      value: '4'    },
                        { key: 'dynamicAllocation.maxExecutors',      value: '80'   },
                        { key: 'sql.shuffle.partitions',              value: '1000' },
                    ] },
                    { id: 'p_super', name: 'spark_submit_cmd_super', tone: 'super', params: [
                        { key: 'executor-memory',                     value: '18g'  },
                        { key: 'executor-cores',                      value: '5'    },
                        { key: 'dynamicAllocation.maxExecutors',      value: '140'  },
                        { key: 'sql.shuffle.partitions',              value: '1600' },
                    ] },
                ],
            }],
            icebergCatalog: 'hadoop_prod',
            icebergWarehouse: 'hdfs:///data/iceberg/warehouse',
            icebergUri: 'thrift://hms-prod:9083',
            icebergNamespace: 'custom_b2c',
        },
        flinkConfig: {
            parallelism: 4,
            checkpointInterval: '30s',
        },
        checkpointConfig: {
            startMode: 'FROM_START',
        },
        ddlConfig: {
            script: { code: '', vars: [] },
            source: { code: '', vars: [] },
            sync:   { code: '', vars: [] },
        },
    };
}

function normalizeState(parsed) {
    try {
        if (!parsed?.pages || !Array.isArray(parsed.pages)) return makeInitialState();
        const defaults = makeInitialState();
        const pages = parsed.pages.map(p => ({
            elements: [], connections: [],
            branch: null, stream: null, locked: false,
            cleanFlow: null,
            ...p,
        }));
        return {
            ...defaults,
            ...parsed,
            pages,
            sparkConfig: parsed.sparkConfig ? {
                ...defaults.sparkConfig,
                ...parsed.sparkConfig,
                // Fall back to defaults if stored arrays are empty (from earlier app versions)
                commonParams: parsed.sparkConfig.commonParams?.length
                    ? parsed.sparkConfig.commonParams
                    : defaults.sparkConfig.commonParams,
                clusters: parsed.sparkConfig.clusters?.length
                    ? parsed.sparkConfig.clusters.map(c => ({
                        ...c,
                        profiles: c.profiles?.length
                            ? c.profiles
                            : defaults.sparkConfig.clusters[0].profiles,
                        executorJavaOpts: c.executorJavaOpts || defaults.sparkConfig.clusters[0].executorJavaOpts,
                        driverJavaOpts: c.driverJavaOpts || defaults.sparkConfig.clusters[0].driverJavaOpts,
                    }))
                    : defaults.sparkConfig.clusters,
            } : defaults.sparkConfig,
            flinkConfig: { ...defaults.flinkConfig, ...(parsed.flinkConfig || {}) },
            checkpointConfig: { ...defaults.checkpointConfig, ...(parsed.checkpointConfig || {}) },
            ddlConfig: parsed.ddlConfig ? {
                script: { ...defaults.ddlConfig.script, ...parsed.ddlConfig.script },
                source: { ...defaults.ddlConfig.source, ...parsed.ddlConfig.source },
                sync:   { ...defaults.ddlConfig.sync,   ...parsed.ddlConfig.sync   },
            } : defaults.ddlConfig,
        };
    } catch { return makeInitialState(); }
}

async function loadFromApi(id) {
    return normalizeState(await request(`/datamarts/${id}/designer-state`));
}

function saveToApi(id, state) {
    return request(`/datamarts/${id}/designer-state`, {
        method: 'PUT', body: JSON.stringify(state),
    });
}

// Wipe a datamart's designer state (fresh card must not inherit pages from
// a previously deleted datamart that had the same id).
export function resetDatamartState(datamartId) {
    return request(`/datamarts/${datamartId}/designer-state`, { method: 'DELETE' });
}

// Standalone (non-hook) helper: seed designer pages for a datamart whose
// store isn't mounted anywhere — used when the global SQL editor turns an
// agent-built project into a fresh datamart card. Pages bound to the same
// branch/stream are replaced, others appended.
// options.engine / options.ddlScript — CJM: у собранной агентом витрины
// Spark и DDL на Ribbon сразу активны (модули уже существуют), а DDL-код
// потока лежит в конфиге кнопки DDL.
export async function seedDatamartPages(datamartId, pageDefs = [], options = {}) {
    const state = await loadFromApi(datamartId);
    const pages = [...state.pages];
    for (const def of pageDefs) {
        const elements = def.elements || [];
        const connections = def.connections || [];
        const page = {
            ...makeBlankPage(nextPageId(), def.name || def.stream || 'Поток'),
            elements, connections,
            branch: def.branch || null,
            stream: def.stream || null,
            cleanFlow: JSON.stringify({ elements, connections }),
        };
        const idx = pages.findIndex(p => p.branch === def.branch && p.stream === def.stream);
        if (idx >= 0) pages[idx] = { ...page, id: pages[idx].id };
        else pages.push(page);
    }
    const next = { ...state, pages };
    if (options.engine) {
        next.selectedEngine = options.engine;
        next.ddlState = { ...next.ddlState, [options.engine === 'flink' ? 'source' : 'script']: true };
    }
    if (options.ddlScript) {
        next.ddlConfig = {
            ...next.ddlConfig,
            script: { ...next.ddlConfig.script, code: options.ddlScript },
        };
    }
    await saveToApi(datamartId, next);
    return next;
}

export function useDatamartState(id) {
    const [state, setState] = useState(makeInitialState);
    const idRef = useRef(id);
    const hydratedIdRef = useRef(null);

    useEffect(() => {
        let active = true;
        idRef.current = id;
        hydratedIdRef.current = null;
        setState(makeInitialState());
        loadFromApi(id)
            .then(next => {
                if (!active) return;
                hydratedIdRef.current = String(id);
                setState(next);
            })
            .catch(error => console.error('Не удалось загрузить состояние конструктора:', error));
        return () => { active = false; };
    }, [id]);

    useEffect(() => {
        if (hydratedIdRef.current !== String(id)) return undefined;
        const timer = setTimeout(() => {
            saveToApi(id, state).catch(error => console.error('Не удалось сохранить состояние конструктора:', error));
        }, 250);
        return () => clearTimeout(timer);
    }, [id, state]);

    const updatePage = useCallback((pageId, updater) => {
        setState(prev => ({
            ...prev,
            pages: prev.pages.map(p => p.id === pageId ? { ...p, ...updater(p) } : p),
        }));
    }, []);

    const addPage = useCallback((name) => {
        const newId = nextPageId();
        setState(prev => {
            const nextIdx = prev.pages.length + 1;
            const newPage = makeBlankPage(newId, name || `Поток ${nextIdx}`);
            return { ...prev, pages: [...prev.pages, newPage] };
        });
        return newId;
    }, []);

    // Atomic helper: append a new page with full initial flow + binding.
    const addPageWithFlow = useCallback(({ name, elements, connections, branch, stream }) => {
        const newId = nextPageId();
        setState(prev => {
            const nextIdx = prev.pages.length + 1;
            const elems = elements || [];
            const conns = connections || [];
            const newPage = {
                ...makeBlankPage(newId, name || `Поток ${nextIdx}`),
                elements: elems,
                connections: conns,
                branch: branch || null,
                stream: stream || null,
                locked: false,
                cleanFlow: JSON.stringify({ elements: elems, connections: conns }),
            };
            return { ...prev, pages: [...prev.pages, newPage] };
        });
        return newId;
    }, []);

    const renamePage = useCallback((pageId, name) => {
        setState(prev => ({ ...prev, pages: prev.pages.map(p => p.id === pageId ? { ...p, name } : p) }));
    }, []);

    const deletePage = useCallback((pageId) => {
        setState(prev => ({ ...prev, pages: prev.pages.filter(p => p.id !== pageId) }));
    }, []);

    // Идемпотентная активация «движок + его DDL» (в отличие от toggle-функций
    // ниже безопасна в StrictMode/повторных вызовах). Используется, когда в
    // витрине уже есть модули и Ribbon обязан быть доступен.
    const ensureEngineWithDdl = useCallback((engine) => {
        const ddlKey = engine === 'flink' ? 'source' : 'script';
        setState(prev => {
            if (prev.selectedEngine === engine && prev.ddlState[ddlKey]) return prev;
            return {
                ...prev,
                selectedEngine: engine,
                ddlState: { ...prev.ddlState, [ddlKey]: true },
            };
        });
    }, []);

    const setEngine = useCallback((engine) => {
        setState(prev => {
            const next = prev.selectedEngine === engine ? null : engine;
            // reset DDL buttons that don't belong to the newly selected engine
            let ddlState = prev.ddlState;
            if (next === 'spark')  ddlState = { ...ddlState, source: false, sync: false };
            if (next === 'flink')  ddlState = { ...ddlState, script: false };
            if (next === null)     ddlState = { script: false, source: false, sync: false };
            return { ...prev, selectedEngine: next, ddlState };
        });
    }, []);

    const toggleDdl = useCallback((kind) => {
        setState(prev => ({ ...prev, ddlState: { ...prev.ddlState, [kind]: !prev.ddlState[kind] } }));
    }, []);

    const toggleCheckpoint = useCallback(() => {
        setState(prev => ({ ...prev, checkpointActive: !prev.checkpointActive }));
    }, []);

    const updateSparkConfig = useCallback((fields) => {
        setState(prev => ({ ...prev, sparkConfig: { ...prev.sparkConfig, ...fields } }));
    }, []);

    const updateFlinkConfig = useCallback((fields) => {
        setState(prev => ({ ...prev, flinkConfig: { ...prev.flinkConfig, ...fields } }));
    }, []);

    const updateCheckpointConfig = useCallback((fields) => {
        setState(prev => ({ ...prev, checkpointConfig: { ...prev.checkpointConfig, ...fields } }));
    }, []);

    const updateDdlConfig = useCallback((kind, fields) => {
        setState(prev => ({
            ...prev,
            ddlConfig: { ...prev.ddlConfig, [kind]: { ...prev.ddlConfig[kind], ...fields } },
        }));
    }, []);

    // ── Per-page branch/stream/lock helpers ────────────────────────────────

    const setPageBranch = useCallback((pageId, branch) => {
        setState(prev => ({
            ...prev,
            pages: prev.pages.map(p => p.id === pageId ? { ...p, branch } : p),
        }));
    }, []);

    const setPageStream = useCallback((pageId, stream) => {
        setState(prev => ({
            ...prev,
            pages: prev.pages.map(p => p.id === pageId ? { ...p, stream } : p),
        }));
    }, []);

    const setPageLock = useCallback((pageId, locked) => {
        setState(prev => ({
            ...prev,
            pages: prev.pages.map(p => p.id === pageId ? { ...p, locked: !!locked } : p),
        }));
    }, []);

    // Replace the page's flow (elements + connections) and bind it to a
    // branch/stream. Used by the stream-import modal and Save-As flow.
    // When elements/connections are passed, refreshes the cleanFlow snapshot
    // so the new state is treated as the dirty-detection baseline.
    const replacePageFlow = useCallback((pageId, { elements, connections, branch, stream, name }) => {
        setState(prev => ({
            ...prev,
            pages: prev.pages.map(p => {
                if (p.id !== pageId) return p;
                const next = {
                    ...p,
                    elements: elements ?? p.elements,
                    connections: connections ?? p.connections,
                    branch: branch !== undefined ? branch : p.branch,
                    stream: stream !== undefined ? stream : p.stream,
                    ...(name ? { name } : {}),
                };
                if (elements !== undefined || connections !== undefined) {
                    next.cleanFlow = JSON.stringify({ elements: next.elements, connections: next.connections });
                }
                return next;
            }),
        }));
    }, []);

    // Mark the page as clean — call after a successful commit so that future
    // dirty checks compare against the just-committed state.
    const markPageClean = useCallback((pageId) => {
        setState(prev => ({
            ...prev,
            pages: prev.pages.map(p => p.id === pageId ? {
                ...p,
                cleanFlow: JSON.stringify({ elements: p.elements, connections: p.connections }),
            } : p),
        }));
    }, []);

    return {
        state,
        updatePage, addPage, addPageWithFlow, renamePage, deletePage,
        setEngine, ensureEngineWithDdl, toggleDdl, toggleCheckpoint,
        updateSparkConfig, updateFlinkConfig, updateCheckpointConfig, updateDdlConfig,
        setPageBranch, setPageStream, setPageLock, replacePageFlow, markPageClean,
    };
}
