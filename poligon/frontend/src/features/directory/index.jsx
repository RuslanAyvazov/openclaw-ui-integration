import './styles/directory.css';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Sidebar from '../../shared/components/Sidebar';
import ViewSelector from '../../shared/components/ViewSelector';
import { useBranchStore, findNode } from '../../shared/branchStore';
import FileTree from './components/FileTree';
import FilePanel from './components/FilePanel';
import CommitHistory from './components/CommitHistory';
import { C } from './constants';
import { fetchDatamarts } from '../home/api';

const TREE_WIDTH_KEY = 'b2csql_directory_tree_width';
const TREE_WIDTH_DEFAULT = 260;
const TREE_WIDTH_MIN = 220;
const TREE_WIDTH_MAX = 640;

function buildDefaultContent(path) { return `# ${path}\n\n# Демо-содержимое файла`; }

function countFiles(node) {
    if (!node) return 0;
    if (node.type === 'file') return 1;
    return (node.children || []).reduce((s, c) => s + countFiles(c), 0);
}

function StatChip({ icon, label }) {
    return (
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: C.mono, fontSize: 11.5, color: C.textSecondary, padding: '2px 8px', background: C.bgElevated, border: `1px solid ${C.borderFaint}`, borderRadius: 20 }}>
            <i className={icon} style={{ fontSize: 10, color: C.textMuted }} />
            {label}
        </span>
    );
}

export default function DirectoryPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        branches, activeBranch, pullRequests, commits,
        switchBranch, createBranch, deleteBranch,
        saveFile, deleteFile, createFile,
        createPullRequest, approvePullRequest, rejectPullRequest, addPullRequestComment,
    } = useBranchStore(id);

    const [selectedPath, setSelectedPath] = useState(null);
    const [collapsedFolders, setCollapsedFolders] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [commitOpen, setCommitOpen] = useState(true);
    const [commitWidth, setCommitWidth] = useState(320);
    const [datamartName, setDatamartName] = useState(`Витрина #${id}`);
    const [treeWidth, setTreeWidth] = useState(() => {
        const savedValue = localStorage.getItem(TREE_WIDTH_KEY);
        const saved = Number(savedValue);
        return savedValue !== null && Number.isFinite(saved)
            ? Math.max(TREE_WIDTH_MIN, Math.min(TREE_WIDTH_MAX, saved))
            : TREE_WIDTH_DEFAULT;
    });
    const [treeResizing, setTreeResizing] = useState(false);
    const panelsRef = useRef(null);
    const treeResizeStartX = useRef(0);
    const treeResizeStartWidth = useRef(TREE_WIDTH_DEFAULT);

    function getMaxTreeWidth() {
        const panelsWidth = panelsRef.current?.getBoundingClientRect().width || window.innerWidth;
        const activityWidth = commitOpen ? commitWidth : 38;
        return Math.max(TREE_WIDTH_MIN, Math.min(TREE_WIDTH_MAX, panelsWidth - activityWidth - 320));
    }

    useEffect(() => {
        fetchDatamarts().then(list => {
            const found = list.find(d => String(d.id) === String(id));
            if (found?.name) setDatamartName(found.name);
        }).catch(() => {});
    }, [id]);

    useEffect(() => {
        localStorage.setItem(TREE_WIDTH_KEY, String(Math.round(treeWidth)));
    }, [treeWidth]);

    useEffect(() => {
        if (!treeResizing) return undefined;

        function onPointerMove(event) {
            const nextWidth = treeResizeStartWidth.current + event.clientX - treeResizeStartX.current;
            setTreeWidth(Math.max(TREE_WIDTH_MIN, Math.min(getMaxTreeWidth(), nextWidth)));
        }

        function stopResize() {
            setTreeResizing(false);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }

        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', stopResize);
        document.addEventListener('pointercancel', stopResize);
        return () => {
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', stopResize);
            document.removeEventListener('pointercancel', stopResize);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [treeResizing, commitOpen, commitWidth]);

    function startTreeResize(event) {
        event.preventDefault();
        treeResizeStartX.current = event.clientX;
        treeResizeStartWidth.current = treeWidth;
        setTreeResizing(true);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    }

    function resizeTreeByKeyboard(event) {
        const step = event.shiftKey ? 48 : 16;
        const maxWidth = getMaxTreeWidth();
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            setTreeWidth(width => Math.max(TREE_WIDTH_MIN, width - step));
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            setTreeWidth(width => Math.min(maxWidth, width + step));
        } else if (event.key === 'Home') {
            event.preventDefault();
            setTreeWidth(TREE_WIDTH_MIN);
        } else if (event.key === 'End') {
            event.preventDefault();
            setTreeWidth(maxWidth);
        }
    }

    const branch = branches[activeBranch];
    const structure = branch?.structure;
    const fileContents = branch?.contents || {};

    // inject fonts + keyframes
    useEffect(() => {
        if (!document.getElementById('git-ui-fonts')) {
            const link = document.createElement('link');
            link.id = 'git-ui-fonts';
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;1,400&family=Syne:wght@400;500;600;700;800&display=swap';
            document.head.appendChild(link);
        }
        if (!document.getElementById('git-ui-styles')) {
            const style = document.createElement('style');
            style.id = 'git-ui-styles';
            style.textContent = `
                @keyframes gitSlideDown { from { opacity:0; transform:translateY(-5px) scaleY(0.97); } to { opacity:1; transform:translateY(0) scaleY(1); } }
                @keyframes gitFadeIn    { from { opacity:0; transform:translateX(-3px); } to { opacity:1; transform:translateX(0); } }
                @keyframes gitPulse     { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
                .git-scrollbar::-webkit-scrollbar        { width:5px; height:5px; }
                .git-scrollbar::-webkit-scrollbar-track  { background:transparent; }
                .git-scrollbar::-webkit-scrollbar-thumb  { background:#d4deee; border-radius:3px; }
                .git-scrollbar::-webkit-scrollbar-thumb:hover { background:#b0bfd0; }
            `;
            document.head.appendChild(style);
        }
    }, []);

    function getContent(path) { return fileContents[path] ?? buildDefaultContent(path); }

    function toggleFolder(path) {
        setCollapsedFolders(prev => { const n = new Set(prev); n.has(path) ? n.delete(path) : n.add(path); return n; });
    }

    function handleSwitchBranch(name) {
        switchBranch(name);
        setSelectedPath(null);
    }

    function handleCreateBranch() {
        const name = prompt('Название новой ветки:', 'feature/new-mart');
        if (!name) return;
        if (branches[name.trim()]) { alert('Ветка уже существует'); return; }
        const created = createBranch(name);
        if (created) setSelectedPath(null);
    }

    function handleDeleteBranch(name) {
        if (name === 'main') { alert('Нельзя удалить ветку main'); return; }
        if (!confirm(`Удалить ветку «${name}»?`)) return;
        deleteBranch(name);
        if (activeBranch === name) setSelectedPath(null);
    }

    function handleSaveFile(path, content) {
        saveFile(activeBranch, path, content);
    }

    function handleDeleteFile(path) {
        if (!confirm(`Удалить ${path}?`)) return;
        deleteFile(activeBranch, path);
        if (selectedPath === path) setSelectedPath(null);
    }

    function handleCreateFile() {
        const hint = selectedPath
            ? (findNode(structure, selectedPath)?.type === 'folder' ? selectedPath : selectedPath.includes('/') ? selectedPath.substring(0, selectedPath.lastIndexOf('/')) : '')
            : '';
        const filePath = prompt('Путь нового файла:', hint ? `${hint}/new_file.sql` : 'new_file.sql');
        if (!filePath) return;
        const ok = createFile(activeBranch, filePath, buildDefaultContent(filePath));
        if (!ok) { alert('Файл уже существует'); return; }
        setSelectedPath(filePath);
    }

    if (!branch) {
        return (
            <div className="page active">
                <Header breadcrumb={[{ label: 'Витрины данных', onClick: () => navigate('/') }]} />
                <div style={{ padding: 40, textAlign: 'center' }}>Ветка не найдена.</div>
            </div>
        );
    }

    const fileCount = countFiles(structure);

    return (
        <div className="page active">
            <Header
                breadcrumb={[
                    { label: 'Витрины данных', onClick: () => navigate('/') },
                    { label: datamartName },
                    { label: 'Структура директорий' },
                ]}
            />
            <div className="main-content">
                <Sidebar activePage="directory" />
                <ViewSelector activeView="directory" datamartId={id} />

                <div className="canvas-container" style={{ padding: 0, overflow: 'hidden', background: C.bgPage, display: 'flex', flexDirection: 'column' }}>

                    {/* Repo top bar */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px',
                        borderBottom: `1px solid ${C.border}`, background: C.bg, flexShrink: 0,
                        boxShadow: '0 1px 3px rgba(44,62,80,0.05)',
                    }}>
                        <i className="fab fa-github" style={{ fontSize: 15, color: C.textSecondary }} />
                        <span style={{ fontFamily: C.syne, fontSize: 14, fontWeight: 700, color: C.text, letterSpacing: '-0.015em' }}>
                            {structure.repo}
                        </span>
                        <div style={{ width: 1, height: 14, background: C.border }} />
                        <span style={{ fontFamily: C.mono, fontSize: 12, padding: '2px 9px', background: C.accentBg, border: `1px solid rgba(52,152,219,0.2)`, borderRadius: 20, color: C.accent }}>
                            {activeBranch}
                        </span>
                        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                            <StatChip icon="fas fa-history" label={`${commits.length} коммитов`} />
                            <StatChip icon="fas fa-code-branch" label={`${Object.keys(branches).length} веток`} />
                            <StatChip icon="fas fa-exchange-alt" label={`${pullRequests.filter(pr => pr.status === 'open').length} открытых PR`} />
                            <StatChip icon="fas fa-file-code" label={`${fileCount} файлов`} />
                        </div>
                    </div>

                    {/* 3-panel layout */}
                    <div ref={panelsRef} style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
                        <FileTree
                            structure={structure} branches={branches} activeBranch={activeBranch}
                            collapsedFolders={collapsedFolders} selectedPath={selectedPath} searchTerm={searchTerm}
                            onFileSelect={setSelectedPath} onFolderToggle={toggleFolder}
                            onBranchSwitch={handleSwitchBranch} onBranchCreate={handleCreateBranch} onBranchDelete={handleDeleteBranch}
                            onSearchChange={setSearchTerm} onCreateFile={handleCreateFile}
                            width={treeWidth}
                        />

                        <div
                            className={`directory-tree-resizer${treeResizing ? ' dragging' : ''}`}
                            role="separator"
                            aria-label="Изменить ширину списка каталогов и файлов"
                            aria-orientation="vertical"
                            aria-valuemin={TREE_WIDTH_MIN}
                            aria-valuemax={Math.round(getMaxTreeWidth())}
                            aria-valuenow={Math.round(treeWidth)}
                            tabIndex={0}
                            title="Потяните, чтобы изменить ширину. Двойной щелчок — сбросить"
                            onPointerDown={startTreeResize}
                            onDoubleClick={() => setTreeWidth(Math.min(TREE_WIDTH_DEFAULT, getMaxTreeWidth()))}
                            onKeyDown={resizeTreeByKeyboard}
                        />

                        <FilePanel
                            repoName={structure.name}
                            selectedPath={selectedPath}
                            content={selectedPath ? getContent(selectedPath) : null}
                            onSave={handleSaveFile} onDelete={handleDeleteFile} onCreateFile={handleCreateFile}
                        />

                        <CommitHistory
                            commits={commits}
                            pullRequests={pullRequests}
                            branches={branches}
                            activeBranch={activeBranch}
                            width={commitWidth}
                            onWidthChange={setCommitWidth}
                            isOpen={commitOpen}
                            onToggle={() => setCommitOpen(o => !o)}
                            onApprovePR={approvePullRequest}
                            onRejectPR={rejectPullRequest}
                            onCommentPR={addPullRequestComment}
                            onCreatePR={createPullRequest}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
