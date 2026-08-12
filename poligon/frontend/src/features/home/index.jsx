import './styles/home-tiles.css';
import './styles/passport.css';
import './styles/workspace.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Sidebar from '../../shared/components/Sidebar';
import {
    fetchDatamarts, createDatamart, updateDatamart, deleteDatamart,
    fetchWorkspaces, fetchPublicWorkspaces, createWorkspace, updateWorkspace,
    fetchWorkspaceMembers, addWorkspaceMember, updateWorkspaceMember, removeWorkspaceMember,
    fetchWorkspaceRequests, joinWorkspace, resolveWorkspaceRequest,
} from './api';
import DatamartTile from './components/DatamartTile';
import CreateDatamartModal from './components/CreateDatamartModal';
import EditDatamartModal from './components/EditDatamartModal';
import WorkspaceBar from './components/WorkspaceBar';
import WorkspaceOnboarding from './components/WorkspaceOnboarding';
import WorkspaceCreateModal from './components/WorkspaceCreateModal';
import WorkspaceBrowseModal from './components/WorkspaceBrowseModal';
import WorkspaceManageModal from './components/WorkspaceManageModal';

export default function HomePage() {
    const navigate = useNavigate();

    // Datamarts
    const [datamarts, setDatamarts] = useState([]);
    const [addMenuOpen, setAddMenuOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editDatamart, setEditDatamart] = useState(null);
    const addTileRef = useRef(null);

    // Workspaces
    const [workspaces, setWorkspaces] = useState([]);
    const [publicWorkspaces, setPublicWorkspaces] = useState([]);
    const [activeWorkspaceId, setActiveWorkspaceId] = useState(null);
    const [members, setMembers] = useState([]);
    const [requests, setRequests] = useState([]);

    // Workspace modal states
    const [wsCreateOpen, setWsCreateOpen] = useState(false);
    const [wsBrowseOpen, setWsBrowseOpen] = useState(false);
    const [wsManageOpen, setWsManageOpen] = useState(false);

    const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || null;

    useEffect(() => {
        Promise.all([fetchDatamarts(), fetchWorkspaces(), fetchPublicWorkspaces()])
            .then(([marts, spaces, publicSpaces]) => {
                setDatamarts(marts);
                setWorkspaces(spaces);
                setPublicWorkspaces(publicSpaces);
                setActiveWorkspaceId(current => current || spaces[0]?.id || null);
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (!activeWorkspaceId) {
            setMembers([]);
            setRequests([]);
            return;
        }
        Promise.all([
            fetchWorkspaceMembers(activeWorkspaceId),
            fetchWorkspaceRequests(activeWorkspaceId).catch(() => []),
        ]).then(([nextMembers, nextRequests]) => {
            setMembers(nextMembers);
            setRequests(nextRequests);
        }).catch(console.error);
    }, [activeWorkspaceId]);

    useEffect(() => {
        if (!addMenuOpen) return;
        function onOutsideClick(e) {
            if (addTileRef.current && !addTileRef.current.contains(e.target)) {
                setAddMenuOpen(false);
            }
        }
        document.addEventListener('click', onOutsideClick);
        return () => document.removeEventListener('click', onOutsideClick);
    }, [addMenuOpen]);

    async function handleDelete(id) {
        await deleteDatamart(id);
        setDatamarts(prev => prev.filter(d => d.id !== id));
        setEditDatamart(null);
    }

    async function handleCreate(payload) {
        const created = await createDatamart({ ...payload, workspaceId: activeWorkspaceId });
        setDatamarts(prev => [...prev, created]);
        navigate(`/directory/${created.id}`);
    }

    async function handleUpdate(id, payload) {
        const updated = await updateDatamart(id, payload);
        setDatamarts(prev => prev.map(d => d.id === updated.id ? updated : d));
        setEditDatamart(updated);
    }

    // Workspace handlers
    async function handleCreateWorkspace(data) {
        const ws = await createWorkspace(data);
        setWorkspaces(prev => [...prev, ws]);
        setActiveWorkspaceId(ws.id);
    }

    async function handleJoinRequest(ws) {
        await joinWorkspace(ws.id);
        setPublicWorkspaces(prev => prev.filter(item => item.id !== ws.id));
    }

    async function handleRoleChange(userId, role) {
        await updateWorkspaceMember(activeWorkspaceId, userId, role);
        setMembers(prev => prev.map(m => m.id === userId ? { ...m, role } : m));
    }

    async function handleRemoveMember(userId) {
        await removeWorkspaceMember(activeWorkspaceId, userId);
        setMembers(prev => prev.filter(m => m.id !== userId));
        setWorkspaces(prev => prev.map(w => w.id === activeWorkspaceId ? { ...w, membersCount: w.membersCount - 1 } : w));
    }

    async function handleApproveRequest(requestId) {
        const req = requests.find(r => r.id === requestId);
        await resolveWorkspaceRequest(activeWorkspaceId, requestId, 'approve');
        if (req) {
            const newMember = { ...req.user, role: 'analyst', joinedAt: new Date().toISOString().slice(0, 10) };
            setMembers(prev => [...prev, newMember]);
            setWorkspaces(prev => prev.map(w => w.id === activeWorkspaceId ? { ...w, membersCount: w.membersCount + 1 } : w));
        }
        setRequests(prev => prev.filter(r => r.id !== requestId));
    }

    async function handleDeclineRequest(requestId) {
        await resolveWorkspaceRequest(activeWorkspaceId, requestId, 'decline');
        setRequests(prev => prev.filter(r => r.id !== requestId));
    }

    async function handleAddMember(email, role) {
        const newMember = await addWorkspaceMember(activeWorkspaceId, email, role);
        setMembers(prev => [...prev, newMember]);
        setWorkspaces(prev => prev.map(w => w.id === activeWorkspaceId ? { ...w, membersCount: w.membersCount + 1 } : w));
    }

    async function handleUpdateWorkspace(data) {
        const updated = await updateWorkspace(activeWorkspaceId, data);
        setWorkspaces(prev => prev.map(w => w.id === activeWorkspaceId ? updated : w));
        setWsManageOpen(false);
    }

    return (
        <div className="page active" id="homePage">
            <Header title="Витрины данных" />
            <div className="main-content">
                <Sidebar activePage="home" datamarts={datamarts} />
                <div className="canvas-container">
                    <WorkspaceBar
                        workspace={activeWorkspace}
                        workspaces={workspaces}
                        onSwitch={setActiveWorkspaceId}
                        onCreate={() => setWsCreateOpen(true)}
                        onBrowse={() => setWsBrowseOpen(true)}
                        onManage={() => setWsManageOpen(true)}
                        onInvite={() => setWsManageOpen(true)}
                    />

                    {workspaces.length === 0 ? (
                        <WorkspaceOnboarding
                            onCreate={() => setWsCreateOpen(true)}
                            onBrowse={() => setWsBrowseOpen(true)}
                        />
                    ) : (
                        <div className="ws-content-area">
                            <div className="ws-content-header">
                                <span className="ws-content-title">
                                    Витрины данных
                                </span>
                                <span className="ws-content-count">{datamarts.length} витрин</span>
                            </div>

                            <div className="tiles-container" id="tilesContainer">
                                {datamarts.map(d => (
                                    <DatamartTile
                                        key={d.id}
                                        datamart={d}
                                        onClick={() => navigate(`/directory/${d.id}`)}
                                        onDelete={() => handleDelete(d.id)}
                                        onEdit={dm => setEditDatamart(dm)}
                                    />
                                ))}

                                <div
                                    ref={addTileRef}
                                    className="tile tile-add"
                                    onClick={e => { e.stopPropagation(); setAddMenuOpen(o => !o); }}
                                >
                                    <div className="add-icon"><i className="fas fa-plus" /></div>
                                    <div className="add-text">Создать витрину</div>

                                    {addMenuOpen && (
                                        <div className="tile-context-menu tile-add-context-menu open">
                                            <button
                                                className="tile-context-item"
                                                type="button"
                                                onClick={e => { e.stopPropagation(); setAddMenuOpen(false); setCreateModalOpen(true); }}
                                            >
                                                <i className="fas fa-plus-circle" />
                                                <span>Создать новую витрину</span>
                                            </button>
                                            <button
                                                className="tile-context-item"
                                                type="button"
                                                onClick={e => { e.stopPropagation(); setAddMenuOpen(false); alert('Импорт пока не реализован'); }}
                                            >
                                                <i className="fas fa-file-import" />
                                                <span>Импортировать витрину</span>
                                            </button>
                                            <button
                                                className="tile-context-item"
                                                type="button"
                                                onClick={e => { e.stopPropagation(); setAddMenuOpen(false); alert('Миграция с Hermes пока не реализована'); }}
                                            >
                                                <i className="fas fa-rocket" />
                                                <span>Мигрировать с Hermes</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Datamart modals */}
            <CreateDatamartModal
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onCreate={handleCreate}
            />
            {editDatamart && (
                <EditDatamartModal
                    datamart={editDatamart}
                    onClose={() => setEditDatamart(null)}
                    onSave={handleUpdate}
                    onDelete={handleDelete}
                />
            )}

            {/* Workspace modals */}
            <WorkspaceCreateModal
                open={wsCreateOpen}
                onClose={() => setWsCreateOpen(false)}
                onCreate={handleCreateWorkspace}
            />
            <WorkspaceBrowseModal
                open={wsBrowseOpen}
                onClose={() => setWsBrowseOpen(false)}
                onJoin={handleJoinRequest}
                workspaces={publicWorkspaces}
            />
            <WorkspaceManageModal
                open={wsManageOpen}
                onClose={() => setWsManageOpen(false)}
                workspace={activeWorkspace}
                members={members}
                requests={requests}
                onRoleChange={handleRoleChange}
                onRemove={handleRemoveMember}
                onApprove={handleApproveRequest}
                onDecline={handleDeclineRequest}
                onAddMember={handleAddMember}
                onUpdateWorkspace={handleUpdateWorkspace}
            />
        </div>
    );
}
