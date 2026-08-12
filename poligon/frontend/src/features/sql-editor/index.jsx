import './styles/sql-editor.css';
import './styles/ai-agent.css';
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Sidebar from '../../shared/components/Sidebar';
import ViewSelector from '../../shared/components/ViewSelector';
import DbNavigator from './components/DbNavigator';
import QueryTabs from './components/QueryTabs';
import ResultsPanel from './components/ResultsPanel';
import AiAgentPanel from './components/AiAgentPanel';
import { fetchDatamarts, fetchDatabases, fetchSparkSessions, fetchFwVersions, executeQuery, fetchMartDraft, discardMartDraft } from './api';
import { INITIAL_QUERIES } from './constants';
import { useBranchStore } from '../../shared/branchStore';
import { useDatamartState } from '../../shared/datamartStore';
import { listStreamsFromFiles, filesForStream, buildStreamElementsFromFiles, martBranchName } from '../../shared/etlTemplates';
import { importProjectIntoDatamart, resetBranchStore } from '../../shared/branchStore';
import { seedDatamartPages, resetDatamartState } from '../../shared/datamartStore';
import { createDatamart } from '../home/api';
import CreateDatamartModal from '../home/components/CreateDatamartModal';
import '../home/styles/passport.css';

export default function SqlEditorPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Standalone mode: the editor lives in the left Sidebar of the home page
    // (route /sql-editor, no datamart). Chats/state are keyed 'global', and an
    // agent-built mart becomes a NEW datamart card instead of landing in the
    // current datamart's repo.
    const standalone = !id;
    const workspaceKey = id || 'global';

    const [datamartName, setDatamartName] = useState(`Витрина #${id}`);
    const [databases, setDatabases] = useState([]);
    const [sparkSessions, setSparkSessions] = useState([]);
    const [fwVersions, setFwVersions] = useState([]);
    const [fw, setFw] = useState('');

    const [tabs, setTabs] = useState([{ id: 1, name: 'query_1.sql' }, { id: 2, name: 'query_2.sql' }]);
    const [activeTab, setActiveTab] = useState(1);
    const [queries, setQueries] = useState(INITIAL_QUERIES);

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeSession, setActiveSession] = useState(1);
    const [dbFilter, setDbFilter] = useState('');

    // Per-tab spark connection: { [tabId]: 'disconnected' | 'connecting' | 'connected' }
    const [tabConn, setTabConn] = useState({});
    const [cursor, setCursor] = useState({ line: 1, col: 1 });
    const editorRef = useRef(null);

    const [executing, setExecuting] = useState(false);
    const [results, setResults] = useState({ columns: [], rows: [], explain: '' });
    const [outputVisible, setOutputVisible] = useState(false);
    const [outputCollapsed, setOutputCollapsed] = useState(false);
    const [outputTab, setOutputTab] = useState('results');

    const [aiOpen, setAiOpen] = useState(false);
    const [aiWidth, setAiWidth] = useState(440);
    const [aiResizing, setAiResizing] = useState(false);

    // Agent project → datamart card flow: while the passport modal is open,
    // the AI panel awaits `resolve` (branch name on success, false on cancel).
    const [cardRequest, setCardRequest] = useState(null); // { project, resolve }
    // «Витрина успешно создана!» — подтверждение после создания карточки.
    const [cardSuccess, setCardSuccess] = useState(null); // { id, name, branch }

    // Repository + designer stores — receive the datamart built by the AI agent.
    const { importProjectFiles, createBranch, branches } = useBranchStore(workspaceKey);
    const { state: designerState, addPageWithFlow, replacePageFlow } = useDatamartState(workspaceKey);

    const tabCounter = useRef(3);
    const tabSessionRef = useRef({}); // { [tabId]: sessionId } — which session each tab is connected to
    const sidebarRef = useRef(null);
    const dragging = useRef(false);
    const dragStartX = useRef(0);
    const dragStartW = useRef(0);

    const aiResizingRef = useRef(false);
    const aiStartX = useRef(0);
    const aiStartW = useRef(0);

    // Load mock data + datamart name
    useEffect(() => {
        fetchDatabases().then(setDatabases).catch(() => {});
        fetchSparkSessions().then(setSparkSessions).catch(() => {});
        fetchFwVersions().then(v => { setFwVersions(v); if (v[0]) setFw(v[0]); }).catch(() => {});
        if (!standalone) {
            fetchDatamarts().then(list => {
                const found = list.find(d => String(d.id) === String(id));
                if (found?.name) setDatamartName(found.name);
            }).catch(() => {});
        }
    }, [id, standalone]);

    // Sidebar resize
    useEffect(() => {
        function onMove(e) {
            if (!dragging.current || !sidebarRef.current) return;
            const newW = Math.max(180, Math.min(420, dragStartW.current + e.clientX - dragStartX.current));
            sidebarRef.current.style.width = newW + 'px';
        }
        function onUp() {
            dragging.current = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    }, []);

    function startResize(e) {
        dragging.current = true;
        dragStartX.current = e.clientX;
        dragStartW.current = sidebarRef.current?.offsetWidth ?? 240;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    }

    // AI panel resize (drag its left edge — moving left widens it)
    useEffect(() => {
        function onMove(e) {
            if (!aiResizingRef.current) return;
            const next = Math.max(320, Math.min(760, aiStartW.current + (aiStartX.current - e.clientX)));
            setAiWidth(next);
        }
        function onUp() {
            if (!aiResizingRef.current) return;
            aiResizingRef.current = false;
            setAiResizing(false);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    }, []);

    function startAiResize(e) {
        e.preventDefault();
        aiResizingRef.current = true;
        aiStartX.current = e.clientX;
        aiStartW.current = aiWidth;
        setAiResizing(true);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    }

    async function execute() {
        if (executing) return;
        setExecuting(true);
        try {
            const res = await executeQuery({ sql: queries[activeTab], sessionId: activeSession, fwVersion: fw });
            setResults(res);
            setOutputVisible(true);
            setOutputCollapsed(false);
            setOutputTab('results');
        } finally {
            setExecuting(false);
        }
    }

    function addTab() {
        const newId = tabCounter.current++;
        const name = `query_${newId}.sql`;
        setTabs(prev => [...prev, { id: newId, name }]);
        setQueries(prev => ({ ...prev, [newId]: `-- ${name}\n\nSELECT * FROM your_table LIMIT 20;` }));
        setActiveTab(newId);
    }

    function closeTab(tabId) {
        if (tabs.length === 1) return;
        const remaining = tabs.filter(t => t.id !== tabId);
        setTabs(remaining);
        if (activeTab === tabId) setActiveTab(remaining[0]?.id ?? 1);
    }

    function insertTable(dbName, tableName) {
        setQueries(prev => ({
            ...prev,
            [activeTab]: (prev[activeTab] || '') + `\nSELECT * FROM ${dbName}.${tableName} LIMIT 100;`,
        }));
    }

    function insertSqlIntoEditor(sql) {
        setQueries(prev => {
            const cur = (prev[activeTab] || '').replace(/\s+$/, '');
            return { ...prev, [activeTab]: cur ? `${cur}\n\n${sql}` : sql };
        });
    }

    // Datamart project from the AI agent → its own branch openclaw/<mart>
    // (never main) + designer pages bound to that branch. Returns the branch
    // name on success (the chat card displays it), false on failure.
    //
    // Inside a datamart: files land in this datamart's repo.
    // Standalone (global editor): a NEW datamart card is created (or reused
    // by name) and the project lands in ITS repo + designer.
    async function loadAgentProject(project) {
        if (project?.draftId && standalone) {
            return new Promise(resolve => setCardRequest({ project, resolve }));
        }

        let files = project?.files || {};
        if (project?.draftId) {
            try {
                const draft = await fetchMartDraft(project.draftId);
                files = draft.files || {};
            } catch (error) {
                alert(error?.message || 'Черновик сборки не найден. Соберите пакет заново.');
                return false;
            }
        }
        if (Object.keys(files).length === 0) return false;

        const suggestedName = project.mart || project.summary?.tableNames?.[0]?.split('.').at(-1) || 'b2c_mart';
        const branch = martBranchName(suggestedName);
        const martLabel = project.mart ? ` «${project.mart}»` : '';
        const commitMessage = `feat: витрина${martLabel} из ИИ-ассистента`;

        const streamPages = listStreamsFromFiles(files).map(streamName => {
            const streamFiles = filesForStream(files, streamName);
            const { elements, connections } = buildStreamElementsFromFiles(streamName, streamFiles);
            return { name: streamName, elements, connections, branch, stream: streamName };
        });

        if (standalone) {
            // Сохранение требует карточку витрины: открываем паспорт новой
            // витрины и ждём решения пользователя. Отмена → false (проект
            // остаётся только в чате и никуда не сохраняется).
            return new Promise(resolve => {
                setCardRequest({ project, files, branch, commitMessage, streamPages, resolve });
            });
        }

        if (!branches[branch]) {
            // New branch is cut from main — which stays a bare skeleton.
            const created = createBranch(branch, 'main');
            if (!created) return false;
        }
        const ok = importProjectFiles(branch, files, commitMessage, { makeActive: true, ensureCanonical: !project.draftId });
        if (!ok) return false;

        for (const def of streamPages) {
            const existing = designerState.pages.find(p => p.branch === branch && p.stream === def.stream);
            if (existing) {
                replacePageFlow(existing.id, def);
            } else {
                addPageWithFlow(def);
            }
        }
        return branch;
    }

    // Паспорт заполнен → создаём карточку и импортируем в неё проект агента.
    async function handleCardCreate(data) {
        if (!cardRequest) return;
        const { project, resolve } = cardRequest;
        let files = cardRequest.files || {};
        if (project?.draftId) {
            try {
                const draft = await fetchMartDraft(project.draftId);
                files = draft.files || {};
            } catch (error) {
                alert(error?.message || 'Черновик сборки не найден. Соберите пакет заново.');
                return false;
            }
        }
        if (Object.keys(files).length === 0) {
            alert('В черновике нет файлов для создания витрины.');
            return false;
        }

        const datamartCode = data.passport?.datamartName || project?.mart || 'b2c_mart';
        const branch = martBranchName(datamartCode);
        const commitMessage = `feat: витрина «${datamartCode}» из ИИ-ассистента`;
        const streamPages = listStreamsFromFiles(files).map(streamName => {
            const streamFiles = filesForStream(files, streamName);
            const { elements, connections } = buildStreamElementsFromFiles(streamName, streamFiles);
            return { name: streamName, elements, connections, branch, stream: streamName };
        });
        let created = null;
        try {
            created = await createDatamart(data);
        } catch (err) {
            alert(`Не удалось создать карточку витрины: ${err?.message || 'backend недоступен'}. Проверьте, что backend запущен (npm run dev).`);
            return false;
        }
        if (!created?.id) {
            alert('Не удалось создать карточку витрины: backend вернул пустой ответ.');
            return false;
        }
        // Свежая карточка — чистые сторы: без наследия от старых витрин,
        // когда-то живших под тем же id (репозиторий + потоки конструктора).
        await resetBranchStore(created.id);
        await resetDatamartState(created.id);
        await importProjectIntoDatamart(created.id, branch, files, commitMessage, { ensureCanonical: !project?.draftId });
        // Spark + DDL на Ribbon сразу активны (модули собраны агентом), DDL-код
        // первого потока — в конфиге кнопки DDL.
        const firstStream = streamPages[0]?.stream;
        await seedDatamartPages(created.id, streamPages, {
            engine: 'spark',
            ddlScript: firstStream ? files[`etl/${firstStream}/DDL.sql`] : undefined,
        });
        if (project?.draftId) await discardMartDraft(project.draftId).catch(() => {});
        setCardRequest(null);
        setCardSuccess({ id: created.id, name: created.displayName || created.name, branch });
        resolve(branch);
        return true;
    }

    function handleCardCancel() {
        if (!cardRequest) return;
        const { resolve } = cardRequest;
        setCardRequest(null);
        resolve(false);
    }

    function addSparkSession() {
        const nextId = (sparkSessions.at(-1)?.id ?? 0) + 1;
        setSparkSessions(prev => [...prev, {
            id: nextId,
            name: `Spark Custom ${nextId}`,
            params: { master: 'yarn', executorMemory: '4g', executors: 2, shufflePartitions: 64 },
        }]);
    }

    // Connect a session to the active SQL tab: connecting → connected (as in prototype)
    function connectSession(sessionId) {
        const tabId = activeTab;
        setActiveSession(sessionId);
        tabSessionRef.current[tabId] = sessionId;
        setTabConn(prev => ({ ...prev, [tabId]: 'connecting' }));
        setTimeout(() => {
            setTabConn(prev => (prev[tabId] === 'connecting' && tabSessionRef.current[tabId] === sessionId
                ? { ...prev, [tabId]: 'connected' }
                : prev));
        }, 700);
    }

    // Disconnect every tab that was connected through this session
    function stopSession(sessionId) {
        if (activeSession === sessionId) setActiveSession(null);
        const tabsToDrop = Object.entries(tabSessionRef.current)
            .filter(([, sess]) => sess === sessionId)
            .map(([tab]) => tab);
        for (const tab of tabsToDrop) delete tabSessionRef.current[tab];
        if (tabsToDrop.length === 0) return;
        setTabConn(prev => {
            const next = { ...prev };
            for (const tab of tabsToDrop) next[tab] = 'disconnected';
            return next;
        });
    }

    function deleteSession(sessionId) {
        setSparkSessions(prev => prev.filter(s => s.id !== sessionId));
        if (activeSession === sessionId) setActiveSession(null);
    }

    function trackCursor(el) {
        if (!el) return;
        const before = el.value.slice(0, el.selectionStart ?? 0);
        const lines = before.split('\n');
        setCursor({ line: lines.length, col: lines[lines.length - 1].length + 1 });
    }

    const currentQuery = queries[activeTab] || '';
    const connState = tabConn[activeTab] || 'disconnected';
    const connText = connState === 'connecting' ? 'Connecting...' : connState === 'connected' ? 'Connected' : 'Disconnected';

    return (
        <div className="page active">
            <Header
                breadcrumb={standalone
                    ? [
                        { label: 'Витрины данных', onClick: () => navigate('/') },
                        { label: 'SQL редактор' },
                    ]
                    : [
                        { label: 'Витрины данных', onClick: () => navigate('/') },
                        { label: datamartName },
                        { label: 'SQL редактор' },
                    ]}
            />
            <div className="main-content">
                <Sidebar activePage="sql" />
                {!standalone && <ViewSelector activeView="sql" datamartId={id} />}

                <div className="canvas-container" style={{ padding: 0 }}>
                    <div className="sql-ide">
                        <div className="toolbar">
                            <div className="connection-info">
                                <div className={`conn-status${connState !== 'connected' ? ` ${connState}` : ''}`}>
                                    <span className="conn-dot"></span>
                                    <span>{connText}</span>
                                </div>
                            </div>
                        </div>

                        <div className="main-panel">
                            <DbNavigator
                                ref={sidebarRef}
                                collapsed={sidebarCollapsed}
                                onToggleCollapse={() => setSidebarCollapsed(c => !c)}
                                sparkSessions={sparkSessions}
                                activeSessionId={activeSession}
                                onSessionSelect={setActiveSession}
                                onSessionAdd={addSparkSession}
                                onSessionConnect={connectSession}
                                onSessionStop={stopSession}
                                onSessionDelete={deleteSession}
                                databases={databases}
                                onTableClick={insertTable}
                                filter={dbFilter}
                                onFilterChange={setDbFilter}
                            />

                            <div className="db-sidebar-resizer" onMouseDown={startResize}></div>

                            <div className="editor-area">
                                <QueryTabs
                                    tabs={tabs}
                                    activeTab={activeTab}
                                    onSelect={setActiveTab}
                                    onAdd={addTab}
                                    onClose={closeTab}
                                />

                                <div className="sql-editor-container">
                                    <textarea
                                        id="sqlEditor"
                                        ref={editorRef}
                                        spellCheck={false}
                                        value={currentQuery}
                                        onChange={e => { setQueries(prev => ({ ...prev, [activeTab]: e.target.value })); trackCursor(e.target); }}
                                        onKeyUp={e => trackCursor(e.target)}
                                        onClick={e => trackCursor(e.target)}
                                        onKeyDown={e => {
                                            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                                                e.preventDefault();
                                                execute();
                                            }
                                        }}
                                    />
                                </div>

                                <div className="results-toolbar">
                                    <button className="fake-execute" onClick={execute} disabled={executing}>
                                        {executing
                                            ? <><i className="fas fa-spinner fa-spin"></i> Выполняется…</>
                                            : <><i className="fas fa-play"></i> Execute</>}
                                    </button>
                                    <button onClick={() => setExecuting(false)} disabled={!executing}>
                                        <i className="fas fa-stop"></i> Cancel
                                    </button>
                                    <div className="fw-select">
                                        <i className="fas fa-code-branch"></i>
                                        <select value={fw} onChange={e => setFw(e.target.value)}>
                                            {fwVersions.map(v => <option key={v}>{v}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <ResultsPanel
                                    visible={outputVisible}
                                    collapsed={outputCollapsed}
                                    activeTab={outputTab}
                                    columns={results.columns}
                                    rows={results.rows}
                                    explain={results.explain}
                                    onTabChange={setOutputTab}
                                    onToggleCollapse={() => setOutputCollapsed(c => !c)}
                                    onClose={() => setOutputVisible(false)}
                                />
                            </div>

                            <div
                                className={`ai-agent-dock${aiOpen ? ' open' : ''}${aiResizing ? ' resizing' : ''}`}
                                style={{ width: aiOpen ? aiWidth : 0 }}
                            >
                                <div
                                    className="ai-agent-resizer"
                                    onMouseDown={startAiResize}
                                    title="Потяните, чтобы изменить ширину"
                                />
                                <AiAgentPanel
                                    key={workspaceKey}
                                    datamartId={workspaceKey}
                                    open={aiOpen}
                                    onClose={() => setAiOpen(false)}
                                    onInsertSql={insertSqlIntoEditor}
                                    onLoadProject={loadAgentProject}
                                    tabs={tabs}
                                    width={aiWidth}
                                />
                            </div>

                            {!aiOpen && (
                                <button
                                    type="button"
                                    className="ai-fab"
                                    onClick={() => setAiOpen(true)}
                                    aria-label="Открыть ИИ-ассистента"
                                >
                                    <span className="ai-fab-glow" aria-hidden="true" />
                                    <i className="fas fa-wand-magic-sparkles" />
                                    <span className="ai-fab-label">ИИ-ассистент</span>
                                </button>
                            )}
                        </div>

                        <div className="status-bar">
                            <span>
                                <i className="fas fa-table"></i> {results.rows.length} rows · {results.columns.length} columns
                            </span>
                            <span>Ln {cursor.line} Col {cursor.col}</span>
                        </div>
                    </div>
                </div>
            </div>

            {cardSuccess && (
                <div className="modal active" onClick={e => { if (e.target === e.currentTarget) setCardSuccess(null); }}>
                    <div className="modal-content" style={{ maxWidth: 430, width: '94%', textAlign: 'center', padding: '34px 30px 26px', borderRadius: 14 }}>
                        <div style={{
                            width: 64, height: 64, borderRadius: '50%', margin: '0 auto 14px',
                            background: '#e8f7ee', color: '#27ae60', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', fontSize: 28,
                        }}>
                            <i className="fas fa-check" />
                        </div>
                        <h3 style={{ margin: '0 0 6px', color: '#2c3e50' }}>Витрина успешно создана!</h3>
                        <p style={{ margin: '0 0 4px', color: '#5d6d7e', fontSize: 14 }}>
                            Карточка «{cardSuccess.name}» появилась на главной странице.
                        </p>
                        <p style={{ margin: '0 0 18px', color: '#8395a7', fontSize: 12.5 }}>
                            Проект загружен в ветку <code style={{ background: '#f0f4fa', padding: '1px 6px', borderRadius: 4 }}>{cardSuccess.branch}</code>
                        </p>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                            <button className="btn btn-secondary" type="button" onClick={() => setCardSuccess(null)}>Остаться в редакторе</button>
                            <button className="btn btn-primary" type="button" onClick={() => navigate(`/directory/${cardSuccess.id}`)}>
                                <i className="fas fa-folder-open" style={{ marginRight: 6 }} />Открыть витрину
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {cardRequest && (
                <CreateDatamartModal
                    open
                    requireAll
                    /* datamart_name — то имя, которое пользователь назвал агенту;
                       «Название витрины» пользователь вводит сам */
                    initial={{
                        datamartName: (
                            cardRequest.project.mart
                            || (cardRequest.project.summary?.tableNames?.length === 1
                                ? cardRequest.project.summary.tableNames[0].split('.').at(-1)
                                : 'b2c_mart')
                        ).replace(/-/g, '_'),
                    }}
                    onClose={handleCardCancel}
                    onCreate={handleCardCreate}
                />
            )}
        </div>
    );
}
