import './styles/ribbon.css';
import './styles/canvas.css';
import './styles/properties.css';
import './styles/designer-ddl.css';
import './styles/branch.css';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Sidebar from '../../shared/components/Sidebar';
import ViewSelector from '../../shared/components/ViewSelector';
import { useDatamartState, isPageDirty } from '../../shared/datamartStore';
import { useBranchStore } from '../../shared/branchStore';
import { fetchDatamarts } from '../sql-editor/api';
import Ribbon from './components/Ribbon';
import Canvas from './components/Canvas';
import CanvasPageTabs from './components/CanvasPageTabs';
import PropertiesPanel from './components/PropertiesPanel';
import DdlModal from './components/DdlModal';
import BranchStreamBar from './components/BranchStreamBar';
import StreamImportModal from './components/StreamImportModal';
import SaveAsModal from './components/SaveAsModal';
import { DEFAULT_ELEMENT_W, DEFAULT_ELEMENT_H } from './constants';
import { buildStreamFilesFromPage } from './utils';

let elCounter = Date.now();
function nextElementId()    { return `el-${++elCounter}`; }
function nextConnectionId() { return `conn-${++elCounter}`; }

export default function DesignerPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        state, updatePage, addPage, addPageWithFlow, renamePage, deletePage,
        setEngine, ensureEngineWithDdl, toggleDdl, toggleCheckpoint,
        updateSparkConfig, updateFlinkConfig, updateCheckpointConfig, updateDdlConfig,
        setPageLock, replacePageFlow, markPageClean,
    } = useDatamartState(id);

    const {
        branches, activeBranch,
        listStreamsInBranch, buildStreamFlow, streamExists,
        createBranch, commitStream, createPullRequest,
    } = useBranchStore(id);

    const [datamartName, setDatamartName] = useState(`Витрина #${id}`);
    const [ribbonTab, setRibbonTab] = useState('main');
    const [activePageId, setActivePageId] = useState(state.pages[0]?.id);
    const [selectedId, setSelectedId] = useState(null);
    const [panelSubject, setPanelSubject] = useState(null);
    const [propsWidth, setPropsWidth] = useState(360);
    const [ddlModal, setDdlModal] = useState(null);
    const [importOpen, setImportOpen] = useState(false);
    const [saveAsOpen, setSaveAsOpen] = useState(false);

    useEffect(() => {
        fetchDatamarts().then(list => {
            const found = list.find(d => String(d.id) === String(id));
            if (found?.name) setDatamartName(found.name);
        }).catch(() => {});
    }, [id]);

    useEffect(() => {
        if (!state.pages.find(p => p.id === activePageId)) {
            setActivePageId(state.pages[0]?.id);
        }
    }, [state.pages, activePageId]);

    // CJM: если в витрине уже есть модули (например, её собрал ИИ-агент),
    // Spark и DDL на Ribbon должны быть активны — иначе остальные модули
    // навсегда заблокированы. Достраиваем состояние для старых витрин.
    useEffect(() => {
        const hasModules = state.pages.some(p => (p.elements?.length || 0) > 0);
        if (hasModules && !state.selectedEngine) {
            ensureEngineWithDdl('spark');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const activePage = state.pages.find(p => p.id === activePageId) || state.pages[0] || null;
    const selectedElement = activePage?.elements.find(el => el.id === selectedId) || null;
    const isReadOnly = !activePage || !activePage.locked;
    const hasStream = !!(activePage?.branch && activePage?.stream);

    // ── Element operations ─────────────────────────────────────────────────
    function addElement(item, x, y) {
        if (isReadOnly) return;
        const el = {
            id: nextElementId(),
            type: item.type, subtype: item.subtype,
            title: item.label, x, y,
            w: DEFAULT_ELEMENT_W, h: DEFAULT_ELEMENT_H,
            moduleEnabled: true, moduleComment: '',
            params: {},
        };
        updatePage(activePage.id, p => ({ elements: [...p.elements, el] }));
    }

    function moveElement(elId, x, y) {
        if (isReadOnly) return;
        updatePage(activePage.id, p => ({
            elements: p.elements.map(el => el.id === elId ? { ...el, x, y } : el),
        }));
    }

    function resizeElement(elId, w, h) {
        if (isReadOnly) return;
        updatePage(activePage.id, p => ({
            elements: p.elements.map(el => el.id === elId ? { ...el, w, h } : el),
        }));
    }

    function updateElement(elId, fields) {
        if (isReadOnly) return;
        updatePage(activePage.id, p => ({
            elements: p.elements.map(el => el.id === elId ? { ...el, ...fields } : el),
        }));
    }

    function deleteElement(elId) {
        if (isReadOnly) return;
        updatePage(activePage.id, p => ({
            elements: p.elements.filter(el => el.id !== elId),
            connections: p.connections.filter(c => c.from !== elId && c.to !== elId),
        }));
        if (selectedId === elId) { setSelectedId(null); setPanelSubject(null); }
    }

    function duplicateElement(elId) {
        if (isReadOnly) return;
        const src = activePage.elements.find(el => el.id === elId);
        if (!src) return;
        const copy = { ...src, id: nextElementId(), x: src.x + 30, y: src.y + 30 };
        updatePage(activePage.id, p => ({ elements: [...p.elements, copy] }));
    }

    function openProps(elId) {
        setSelectedId(elId);
        setPanelSubject(null);
    }

    function addConnection(fromId, toId) {
        if (isReadOnly) return;
        updatePage(activePage.id, p => {
            if (p.connections.some(c => c.from === fromId && c.to === toId)) return {};
            return { connections: [...p.connections, { id: nextConnectionId(), from: fromId, to: toId }] };
        });
    }

    function deleteConnection(connId) {
        if (isReadOnly) return;
        updatePage(activePage.id, p => ({ connections: p.connections.filter(c => c.id !== connId) }));
    }

    function handleRibbonDragStart(e, item) {
        if (isReadOnly) { e.preventDefault(); return; }
        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('application/x-ribbon-item', JSON.stringify(item));
    }

    function handleDeploy() {
        alert('Deploy запущен (mock). Позже здесь будет вызов CI/CD пайплайна.');
    }

    function handleEngineClick(subtype) {
        if (isReadOnly) return;
        const wasActive = state.selectedEngine === subtype;
        setEngine(subtype);
        if (!wasActive) {
            setSelectedId(null);
            setPanelSubject(subtype);
        } else {
            if (panelSubject === subtype) setPanelSubject(null);
        }
    }

    function handleDdlClick(subtype) {
        if (isReadOnly) return;
        toggleDdl(subtype);
        setDdlModal(subtype);
    }

    function handleCheckpointClick() {
        if (isReadOnly) return;
        toggleCheckpoint();
        const willBeActive = !state.checkpointActive;
        if (willBeActive) {
            setSelectedId(null);
            setPanelSubject('checkpoint');
        } else {
            if (panelSubject === 'checkpoint') setPanelSubject(null);
        }
    }

    function handleAddPage() {
        const newId = addPage();
        setActivePageId(newId);
        setSelectedId(null);
        setPanelSubject(null);
    }
    function handleClosePage(pageId) {
        if (!window.confirm('Удалить этот поток?')) return;
        deletePage(pageId);
        if (activePageId === pageId) {
            const remaining = state.pages.filter(p => p.id !== pageId);
            setActivePageId(remaining[0]?.id);
            setSelectedId(null);
        }
    }

    function handleCanvasClick() {
        setSelectedId(null);
        setPanelSubject(null);
    }

    // ── Branch / stream operations ─────────────────────────────────────────

    // Блокировка доступна и для потока без привязки к ветке (ручной сценарий:
    // «Добавить поток» → заблокировать → настроить Spark/DDL/модули →
    // «Сохранить как…» в ветку).
    function handleToggleLock() {
        if (!activePage) return;
        setPageLock(activePage.id, !activePage.locked);
    }

    function handleStreamImport({ branch, stream, target, tabName }) {
        const flow = buildStreamFlow(branch, stream);
        if (target === 'new' || !activePage) {
            const newId = addPageWithFlow({
                name: tabName || stream,
                elements: flow.elements,
                connections: flow.connections,
                branch, stream,
            });
            setActivePageId(newId);
            setSelectedId(null);
            setPanelSubject(null);
        } else {
            if ((activePage.elements?.length > 0 || activePage.connections?.length > 0)
                && !window.confirm('Текущая вкладка содержит элементы. Они будут заменены. Продолжить?')) return;
            replacePageFlow(activePage.id, {
                elements: flow.elements,
                connections: flow.connections,
                branch, stream,
            });
            setSelectedId(null);
            setPanelSubject(null);
            // Reset lock — imported stream starts in read-only.
            setPageLock(activePage.id, false);
        }
        setImportOpen(false);
    }

    function showToast(text) {
        const banner = document.createElement('div');
        banner.textContent = text;
        banner.className = 'branch-toast';
        document.body.appendChild(banner);
        setTimeout(() => banner.remove(), 1800);
    }

    function handleSave() {
        if (!hasStream) { alert('Поток не привязан к ветке. Используйте «Сохранить как».'); return; }
        if (!activePage.locked) { alert('Заблокируйте поток для редактирования прежде чем сохранять.'); return; }
        const ok = commitStream(activePage.branch, activePage.stream, {
            elements: activePage.elements,
            connections: activePage.connections,
        }, `feat(${activePage.stream}): update stream`,
        buildStreamFilesFromPage(activePage, state.ddlConfig, activePage.stream));
        if (ok) {
            markPageClean(activePage.id);
            showToast(`Сохранено в ветку ${activePage.branch}`);
        } else {
            alert('Не удалось сохранить — ветка не найдена.');
        }
    }

    function handleSaveAsConfirm({ branch, stream, replaceExisting, createPR, prStrategy }) {
        // Direct commit (no PR) — original behaviour.
        if (!createPR) {
            const ok = commitStream(branch, stream, {
                elements: activePage.elements,
                connections: activePage.connections,
            }, `feat(${stream}): ${replaceExisting ? 'overwrite' : 'add'} stream`,
            buildStreamFilesFromPage(activePage, state.ddlConfig, stream));
            if (!ok) { alert('Не удалось сохранить.'); return; }
            replacePageFlow(activePage.id, { branch, stream });
            markPageClean(activePage.id);
            setPageLock(activePage.id, true);
            setSaveAsOpen(false);
            showToast(`Сохранено в ${branch}/etl/${stream}/`);
            return;
        }

        // PR flow — `branch` is the PR merge target. Commit goes elsewhere
        // (current source branch, a fresh branch, or nowhere if clean).
        let prSource = null;
        if (prStrategy?.target === 'current') {
            const dest = activePage?.branch;
            if (!dest || !branches[dest]) { alert('Текущая ветка недоступна.'); return; }
            const ok = commitStream(dest, stream, {
                elements: activePage.elements,
                connections: activePage.connections,
            }, `feat(${stream}): update stream (for PR -> ${branch})`,
            buildStreamFilesFromPage(activePage, state.ddlConfig, stream));
            if (!ok) { alert('Не удалось сохранить в текущую ветку.'); return; }
            replacePageFlow(activePage.id, { branch: dest, stream });
            markPageClean(activePage.id);
            prSource = dest;
        } else if (prStrategy?.target === 'new') {
            const parent = (activePage?.branch && branches[activePage.branch]) ? activePage.branch : 'main';
            const created = createBranch(prStrategy.name, parent);
            if (!created) { alert('Не удалось создать ветку (возможно, имя уже занято).'); return; }
            const ok = commitStream(created, stream, {
                elements: activePage.elements,
                connections: activePage.connections,
            }, `feat(${stream}): proposal for ${branch}`,
            buildStreamFilesFromPage(activePage, state.ddlConfig, stream));
            if (!ok) { alert('Не удалось сохранить в новую ветку.'); return; }
            replacePageFlow(activePage.id, { branch: created, stream });
            markPageClean(activePage.id);
            prSource = created;
        } else {
            // Clean + bound: PR from current source, no commit.
            prSource = activePage?.branch;
            if (!prSource || !branches[prSource]) {
                alert('Не удалось определить исходную ветку для PR.');
                return;
            }
        }

        if (prSource === branch) {
            alert('Source и target PR совпали — пропускаю создание.');
            setSaveAsOpen(false);
            return;
        }

        const pr = createPullRequest({
            title: `feat(${stream}): merge ${prSource} → ${branch}`,
            description: `Designer flow для потока «${stream}». Изменения собраны в ветке ${prSource}, предлагается слить в ${branch}.`,
            sourceBranch: prSource,
            targetBranch: branch,
        });

        setPageLock(activePage.id, true);
        setSaveAsOpen(false);
        showToast(`PR #${pr.number} создан: ${prSource} → ${branch}`);
    }

    function handleCreateBranchFromSaveAs(name, parent) {
        return createBranch(name, parent);
    }

    return (
        <>
        <div className="page active">
            <Header
                breadcrumb={[
                    { label: 'Витрины данных', onClick: () => navigate('/') },
                    { label: datamartName },
                    { label: 'Конструктор' },
                ]}
            />
            <div className="main-content">
                <Sidebar activePage="designer" />
                <ViewSelector activeView="designer" datamartId={id} />

                <div className="canvas-container" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <Ribbon
                        activeTab={ribbonTab}
                        onTabChange={setRibbonTab}
                        selectedEngine={state.selectedEngine}
                        ddlState={state.ddlState}
                        checkpointActive={state.checkpointActive}
                        onEngineClick={handleEngineClick}
                        onDdlClick={handleDdlClick}
                        onCheckpointClick={handleCheckpointClick}
                        onDeployClick={handleDeploy}
                        onItemDragStart={handleRibbonDragStart}
                        readOnly={isReadOnly}
                    />

                    <div className="designer-main" style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
                            <BranchStreamBar
                                page={activePage}
                                onOpenImport={() => setImportOpen(true)}
                                onToggleLock={handleToggleLock}
                                onSave={handleSave}
                                onSaveAs={() => setSaveAsOpen(true)}
                            />

                            <div style={{ flex: 1, overflow: 'auto', padding: '12px 14px 0' }}>
                                {!activePage && (
                                    <div className="designer-empty-state">
                                        <div className="designer-empty-icon"><i className="fas fa-diagram-project" /></div>
                                        <h3>В витрине пока нет потоков</h3>
                                        <p>Создайте новый поток или импортируйте существующий из ветки репозитория.</p>
                                        <div className="designer-empty-actions">
                                            <button className="branch-bar-cta" onClick={handleAddPage}>
                                                <i className="fas fa-plus" /> Добавить поток
                                            </button>
                                            <button className="branch-bar-cta designer-empty-secondary" onClick={() => setImportOpen(true)}>
                                                <i className="fas fa-cloud-download-alt" /> Импортировать из ветки…
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {activePage && (
                                    <Canvas
                                        page={activePage}
                                        selectedId={selectedId}
                                        onSelect={setSelectedId}
                                        onMove={moveElement}
                                        onResize={resizeElement}
                                        onDuplicate={duplicateElement}
                                        onDelete={deleteElement}
                                        onOpenProps={openProps}
                                        onAddElement={addElement}
                                        onAddConnection={addConnection}
                                        onDeleteConnection={deleteConnection}
                                        onCanvasClick={handleCanvasClick}
                                        readOnly={isReadOnly}
                                    />
                                )}
                            </div>

                            <CanvasPageTabs
                                pages={state.pages}
                                activePageId={activePage?.id}
                                onSelect={pid => { setActivePageId(pid); setSelectedId(null); setPanelSubject(null); }}
                                onAdd={handleAddPage}
                                onClose={handleClosePage}
                                onRename={renamePage}
                            />
                        </div>

                        <PropertiesPanel
                            element={selectedElement}
                            panelSubject={panelSubject}
                            sparkConfig={state.sparkConfig}
                            flinkConfig={state.flinkConfig}
                            checkpointConfig={state.checkpointConfig}
                            width={propsWidth}
                            onWidthChange={setPropsWidth}
                            onClose={() => { setSelectedId(null); setPanelSubject(null); }}
                            onUpdate={updateElement}
                            onSparkConfigUpdate={updateSparkConfig}
                            onFlinkConfigUpdate={updateFlinkConfig}
                            onCheckpointConfigUpdate={updateCheckpointConfig}
                        />
                    </div>
                </div>
            </div>
        </div>

        {ddlModal && (
            <DdlModal
                subtype={ddlModal}
                content={state.ddlConfig[ddlModal]?.code || ''}
                vars={state.ddlConfig[ddlModal]?.vars || []}
                onSave={({ code, vars }) => {
                    updateDdlConfig(ddlModal, { code, vars });
                }}
                onClose={() => setDdlModal(null)}
            />
        )}

        <StreamImportModal
            open={importOpen}
            branches={branches}
            activeBranch={activePage?.branch || activeBranch}
            pages={state.pages}
            activePageId={activePage?.id}
            listStreamsInBranch={listStreamsInBranch}
            onConfirm={handleStreamImport}
            onClose={() => setImportOpen(false)}
        />

        <SaveAsModal
            open={saveAsOpen}
            branches={branches}
            activeBranch={activePage?.branch || activeBranch}
            currentStream={activePage?.stream || ''}
            sourceBranch={activePage?.branch || null}
            isDirty={isPageDirty(activePage)}
            listStreamsInBranch={listStreamsInBranch}
            onCreateBranch={handleCreateBranchFromSaveAs}
            onConfirm={handleSaveAsConfirm}
            onClose={() => setSaveAsOpen(false)}
        />
        </>
    );
}
