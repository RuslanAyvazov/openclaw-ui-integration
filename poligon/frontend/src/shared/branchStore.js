// Cross-feature store for branches, pull requests and commit history.
// Used by Directory (file tree, branch selector, PR view) and Designer
// (stream import + Save / Save As to a branch).
//
// Pattern: a tiny subscription store keyed by datamartId. Metadata is stored
// by Django/PostgreSQL, while file bodies live in the user's repository area.

import { useEffect, useState } from 'react';
import { request } from './api';
import { buildInitialBranches, INITIAL_PULL_REQUESTS } from './branchMock';
import { MOCK_COMMITS, defaultStreamCtl, defaultStreamMart } from '../features/directory/mock';
import {
    STREAM_FILES, buildConfigJson, buildStreamElementsFromFiles,
    placeholderSql, DEFAULT_DEVOPS_JSON,
} from './etlTemplates';

// Bump when the persisted shape changes — older payloads get reseeded.
// v3: canonical flat stream layout (DDL.sql, DML.sql, modules, b2c_sql_config.json).
// v4: repository starts empty — only `main` with a bare etl/ + resources/ skeleton.
// v5: agent-built marts live in their own openclaw/<mart> branches; main is
//     never written to (wipes v4 data where marts had landed in main).
const STORE_VERSION = 5;

function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

// ────────────────────────────────────────────────────────────────────────────
// Tree helpers (operate on a structure node = { name, type, children })
// ────────────────────────────────────────────────────────────────────────────

export function findNode(root, path) {
    if (!path) return null;
    let cur = root;
    for (const part of path.split('/')) {
        if (!cur.children) return null;
        cur = cur.children.find(c => c.name === part);
        if (!cur) return null;
    }
    return cur;
}

export function removeNode(root, path) {
    const parts = path.split('/').filter(Boolean);
    if (!parts.length) return false;
    const name = parts.pop();
    let parent = root;
    for (const p of parts) {
        parent = (parent.children || []).find(c => c.name === p && c.type === 'folder');
        if (!parent) return false;
    }
    if (!parent.children) return false;
    const before = parent.children.length;
    parent.children = parent.children.filter(c => c.name !== name);
    return parent.children.length < before;
}

export function addFile(root, filePath) {
    const parts = filePath.split('/').filter(Boolean);
    if (!parts.length) return false;
    const fileName = parts.pop();
    let cur = root;
    for (const p of parts) {
        let next = (cur.children || []).find(c => c.name === p && c.type === 'folder');
        if (!next) { next = { name: p, type: 'folder', children: [] }; cur.children = cur.children || []; cur.children.push(next); }
        cur = next;
    }
    cur.children = cur.children || [];
    if (cur.children.some(c => c.name === fileName)) return false;
    cur.children.push({ name: fileName, type: 'file' });
    return true;
}

// Canonical stream layout (see b2c-sql-project/SKILL.md): flat files
// DDL.sql, DML.sql, historicity.sql, move_table.sql, coalesce.sql,
// ctl.yml, mart.yml, b2c_sql_config.json. This guarantees those exist
// after any branch/stream mutation.
export function ensureStreamFolder(root, streamName) {
    let etl = (root.children || []).find(c => c.name === 'etl' && c.type === 'folder');
    if (!etl) {
        etl = { name: 'etl', type: 'folder', children: [] };
        root.children = root.children || [];
        root.children.unshift(etl);
    }
    let folder = (etl.children || []).find(c => c.name === streamName && c.type === 'folder');
    if (!folder) {
        folder = { name: streamName, type: 'folder', children: [] };
        etl.children = etl.children || [];
        etl.children.push(folder);
    }
    folder.children = folder.children || [];
    for (const fileName of STREAM_FILES) {
        if (!folder.children.some(c => c.name === fileName && c.type === 'file')) {
            folder.children.push({ name: fileName, type: 'file' });
        }
    }
    return folder;
}

// Default content for the canonical stream files; only used to fill blanks.
function ensureStreamContents(contents, streamName) {
    const base = `etl/${streamName}/`;
    const fill = (name, value) => { if (contents[base + name] == null) contents[base + name] = value; };
    fill('DDL.sql',             placeholderSql('DDL.sql', 'заполняется через кнопку DDL на Ribbon-панели конструктора'));
    fill('DML.sql',             placeholderSql('DML.sql', 'загрузка инкремента в staging (SQL Transform на Canvas)'));
    fill('historicity.sql',     placeholderSql('historicity.sql', 'модуль «Историчность данных» на Canvas'));
    fill('move_table.sql',      placeholderSql('move_table.sql', 'модуль «Move2PA» на Canvas'));
    fill('coalesce.sql',        placeholderSql('coalesce.sql', 'модуль «Coalesce» на Canvas'));
    fill('b2c_sql_config.json', buildConfigJson(streamName));
    fill('ctl.yml',             defaultStreamCtl(streamName));
    fill('mart.yml',            defaultStreamMart(streamName));
}

// List the streams (top-level subfolders of `etl/`) inside a branch.
export function listStreamsInBranch(branch) {
    if (!branch?.structure) return [];
    const etl = (branch.structure.children || []).find(c => c.name === 'etl' && c.type === 'folder');
    if (!etl) return [];
    return (etl.children || [])
        .filter(c => c.type === 'folder')
        .map(c => c.name);
}

// ────────────────────────────────────────────────────────────────────────────
// Stream flow builder — clones a template and re-prefixes ids
// ────────────────────────────────────────────────────────────────────────────

function readStoredFlow(branch, streamName) {
    const path = `etl/${streamName}/__designer_flow.json`;
    const raw = branch?.contents?.[path];
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.elements) && Array.isArray(parsed.connections)) return parsed;
    } catch {}
    return null;
}

// Returns { elements, connections }.
// Honours saved (Save / Save As) flows first, then builds a canonical flow
// from the stream's actual files (DML.sql, historicity.sql, …).
export function buildStreamFlow(branch, streamName) {
    const stored = readStoredFlow(branch, streamName);
    const prefix = `el-${Date.now().toString(36)}`;
    if (stored) {
        // Reissue ids so multiple imports do not collide.
        const idMap = {};
        const elements = stored.elements.map((e, i) => {
            const newId = `${prefix}-${i + 1}`;
            idMap[e.id] = newId;
            return { ...e, id: newId };
        });
        const connections = stored.connections.map((c, i) => ({
            id: `${prefix}-c${i + 1}`,
            from: idMap[c.from] || c.from,
            to:   idMap[c.to]   || c.to,
        }));
        return { elements, connections };
    }
    const base = `etl/${streamName}/`;
    const filesByName = {};
    for (const [path, content] of Object.entries(branch?.contents || {})) {
        if (path.startsWith(base) && !path.slice(base.length).includes('/')) {
            filesByName[path.slice(base.length)] = content;
        }
    }
    if (Object.keys(filesByName).length === 0) return { elements: [], connections: [] };
    return buildStreamElementsFromFiles(streamName, filesByName, prefix);
}

// ────────────────────────────────────────────────────────────────────────────
// Default state factory
// ────────────────────────────────────────────────────────────────────────────

function makeInitial() {
    return {
        version: STORE_VERSION,
        branches: buildInitialBranches(),
        activeBranch: 'main',
        pullRequests: deepClone(INITIAL_PULL_REQUESTS),
        commits: deepClone(MOCK_COMMITS),
    };
}

function normalizeState(parsed) {
    try {
        if (!parsed) return makeInitial();
        if (!parsed.branches || typeof parsed.branches !== 'object') return makeInitial();
        const fallback = makeInitial();
        return {
            version: STORE_VERSION,
            branches: parsed.branches,
            activeBranch: parsed.activeBranch && parsed.branches[parsed.activeBranch] ? parsed.activeBranch : 'main',
            pullRequests: Array.isArray(parsed.pullRequests) ? parsed.pullRequests : fallback.pullRequests,
            commits: Array.isArray(parsed.commits) ? parsed.commits : fallback.commits,
        };
    } catch { return makeInitial(); }
}

// ────────────────────────────────────────────────────────────────────────────
// Subscription store
// ────────────────────────────────────────────────────────────────────────────

const cache = {};                  // datamartId → state
const subscribers = new Map();     // datamartId → Set<callback>
const hydrated = new Set();
const hydrationRequests = new Map();
const persistenceQueues = new Map();
const revisions = new Map();

function getState(id) {
    if (!cache[id]) cache[id] = makeInitial();
    return cache[id];
}

function notify(id) {
    const subs = subscribers.get(id);
    if (subs) subs.forEach(fn => fn());
}

function persistState(id, state) {
    const snapshot = deepClone({ ...state, version: STORE_VERSION });
    const previous = persistenceQueues.get(id) || Promise.resolve();
    const next = previous
        .catch(() => {})
        .then(() => request(`/datamarts/${id}/repository`, {
            method: 'PUT', body: JSON.stringify(snapshot),
        }));
    persistenceQueues.set(id, next);
    next.catch(error => console.error('Не удалось сохранить репозиторий:', error));
    return next;
}

function hydrate(id) {
    if (hydrated.has(id)) return Promise.resolve(getState(id));
    if (hydrationRequests.has(id)) return hydrationRequests.get(id);
    const startRevision = revisions.get(id) || 0;
    const pending = request(`/datamarts/${id}/repository`)
        .then(payload => {
            if ((revisions.get(id) || 0) === startRevision) cache[id] = normalizeState(payload);
            hydrated.add(id);
            notify(id);
            return getState(id);
        })
        .finally(() => hydrationRequests.delete(id));
    hydrationRequests.set(id, pending);
    return pending;
}

function setState(id, updater, shouldPersist = true) {
    const prev = getState(id);
    const next = typeof updater === 'function' ? updater(prev) : updater;
    cache[id] = next;
    revisions.set(id, (revisions.get(id) || 0) + 1);
    notify(id);
    if (shouldPersist) persistState(id, next);
    return next;
}

function subscribe(id, fn) {
    if (!subscribers.has(id)) subscribers.set(id, new Set());
    subscribers.get(id).add(fn);
    return () => {
        const s = subscribers.get(id);
        if (s) s.delete(fn);
    };
}

// ────────────────────────────────────────────────────────────────────────────
// Mutations
// ────────────────────────────────────────────────────────────────────────────

function shortHash() {
    return Array.from({ length: 7 }, () => Math.floor(Math.random() * 36).toString(36)).join('');
}

const AUTHOR = { name: 'Администратор', initials: 'AD' };

// Apply a project file map to `branchName` inside a state snapshot.
// Shared by the hook (importProjectFiles) and the standalone import below.
function applyProjectImport(prev, branchName, files, commitMessage, makeActive, ensureCanonical = true) {
    const b = prev.branches[branchName];
    const ns = deepClone(b.structure);
    const nc = { ...b.contents };

    const streams = new Set();
    for (const [path, content] of Object.entries(files)) {
        const clean = path.replace(/^\/+/, '');
        addFile(ns, clean); // no-op if it already exists
        nc[clean] = content;
        const m = clean.match(/^etl\/([^/]+)\//);
        if (m) streams.add(m[1]);
    }
    if (ensureCanonical) {
        for (const streamName of streams) {
            ensureStreamFolder(ns, streamName);
            ensureStreamContents(nc, streamName);
        }
        if (nc['resources/devops.json'] == null) {
            addFile(ns, 'resources/devops.json');
            nc['resources/devops.json'] = DEFAULT_DEVOPS_JSON;
        }
    }

    return {
        ...prev,
        branches: { ...prev.branches, [branchName]: { ...b, structure: ns, contents: nc } },
        activeBranch: makeActive ? branchName : prev.activeBranch,
        commits: addCommit(
            prev,
            branchName,
            commitMessage || `feat: import datamart project (${streams.size} stream${streams.size === 1 ? '' : 's'})`,
            Object.keys(files).length * 10,
            0,
            Object.keys(files).length,
        ),
    };
}

// Wipe a datamart's branch store (fresh card must not inherit repo state
// from a previously deleted datamart that had the same id).
export async function resetBranchStore(datamartId) {
    delete cache[datamartId];
    hydrated.delete(datamartId);
    hydrationRequests.delete(datamartId);
    persistenceQueues.delete(datamartId);
    revisions.delete(datamartId);
    await request(`/datamarts/${datamartId}/repository`, { method: 'DELETE' });
    cache[datamartId] = makeInitial();
    hydrated.add(datamartId);
    notify(datamartId);
}

// Standalone (non-hook) project import — used by the global SQL editor,
// where the agent-built mart lands in a freshly created datamart card whose
// branch store isn't mounted anywhere yet. Ensures the target branch exists
// (cut from main) and makes it active.
export async function importProjectIntoDatamart(datamartId, branchName, files, commitMessage, options = {}) {
    if (!files || Object.keys(files).length === 0) return false;
    await hydrate(datamartId);
    const nextState = setState(datamartId, prev => {
        let next = prev;
        if (!next.branches[branchName]) {
            next = {
                ...next,
                branches: {
                    ...next.branches,
                    [branchName]: {
                        structure: deepClone(next.branches.main.structure),
                        contents: deepClone(next.branches.main.contents),
                        baseBranch: 'main',
                        createdAt: new Date().toISOString(),
                        author: AUTHOR.name,
                    },
                },
                commits: addCommit(next, branchName, `chore: branch ${branchName} created from main`, 0, 0, 0),
            };
        }
        return applyProjectImport(next, branchName, files, commitMessage, true, options.ensureCanonical !== false);
    }, false);
    await persistState(datamartId, nextState);
    return true;
}

function addCommit(prev, branchName, message, additions, deletions, changedFiles) {
    const commit = {
        hash: shortHash(),
        message,
        author: AUTHOR.name,
        initials: AUTHOR.initials,
        time: 'just now',
        additions,
        deletions,
        changedFiles,
        branch: branchName,
    };
    return [commit, ...prev.commits];
}

// ────────────────────────────────────────────────────────────────────────────
// Hook
// ────────────────────────────────────────────────────────────────────────────

export function useBranchStore(datamartId) {
    const [, force] = useState(0);

    useEffect(() => {
        const unsub = subscribe(datamartId, () => force(n => n + 1));
        hydrate(datamartId).catch(error => console.error('Не удалось загрузить репозиторий:', error));
        return unsub;
    }, [datamartId]);

    const state = getState(datamartId);

    // ── Branch operations ──────────────────────────────────────────────────
    function switchBranch(name) {
        if (!state.branches[name]) return;
        setState(datamartId, prev => ({ ...prev, activeBranch: name }));
    }

    // Create a new branch by cloning `fromBranch` (defaults to active).
    // Returns the new branch name on success, or null if it already exists.
    function createBranch(name, fromBranch) {
        const trimmed = (name || '').trim();
        if (!trimmed) return null;
        if (state.branches[trimmed]) return null;
        const src = state.branches[fromBranch || state.activeBranch];
        if (!src) return null;
        setState(datamartId, prev => ({
            ...prev,
            branches: {
                ...prev.branches,
                [trimmed]: {
                    structure: deepClone(src.structure),
                    contents:  deepClone(src.contents),
                    baseBranch: fromBranch || prev.activeBranch,
                    createdAt: new Date().toISOString(),
                    author: AUTHOR.name,
                },
            },
            commits: addCommit(prev, trimmed, `chore: branch ${trimmed} created from ${fromBranch || prev.activeBranch}`, 0, 0, 0),
        }));
        return trimmed;
    }

    function deleteBranch(name) {
        if (name === 'main') return false;
        if (!state.branches[name]) return false;
        setState(datamartId, prev => {
            const next = { ...prev.branches };
            delete next[name];
            return {
                ...prev,
                branches: next,
                activeBranch: prev.activeBranch === name ? 'main' : prev.activeBranch,
                pullRequests: prev.pullRequests.filter(pr => pr.sourceBranch !== name && pr.targetBranch !== name),
            };
        });
        return true;
    }

    // ── File operations (used by directory) ───────────────────────────────
    function saveFile(branchName, path, content) {
        setState(datamartId, prev => {
            const branch = prev.branches[branchName];
            if (!branch) return prev;
            return {
                ...prev,
                branches: {
                    ...prev.branches,
                    [branchName]: { ...branch, contents: { ...branch.contents, [path]: content } },
                },
            };
        });
    }

    function deleteFile(branchName, path) {
        setState(datamartId, prev => {
            const branch = prev.branches[branchName];
            if (!branch) return prev;
            const ns = deepClone(branch.structure);
            removeNode(ns, path);
            const nc = { ...branch.contents };
            delete nc[path];
            return {
                ...prev,
                branches: { ...prev.branches, [branchName]: { ...branch, structure: ns, contents: nc } },
            };
        });
    }

    function createFile(branchName, path, initialContent) {
        let ok = false;
        setState(datamartId, prev => {
            const branch = prev.branches[branchName];
            if (!branch) return prev;
            const ns = deepClone(branch.structure);
            if (!addFile(ns, path)) return prev;
            ok = true;
            return {
                ...prev,
                branches: {
                    ...prev.branches,
                    [branchName]: {
                        ...branch,
                        structure: ns,
                        contents: { ...branch.contents, [path]: initialContent ?? '' },
                    },
                },
            };
        });
        return ok;
    }

    // ── Stream operations (used by designer Save / Save As) ───────────────
    function streamExists(branchName, streamName) {
        return listStreamsInBranch(state.branches[branchName]).includes(streamName);
    }

    // Persist the designer flow (elements + connections) into a branch.
    // The flow blob is stored under `etl/{stream}/__designer_flow.json` in
    // the contents map (an internal artifact — kept out of the displayed
    // tree). The structure is normalised to the canonical flat layout and
    // `files` ({ 'DDL.sql': content, ... }) generated from the flow are
    // written into the stream folder.
    function commitStream(branchName, streamName, flow, commitMessage, files) {
        const branch = state.branches[branchName];
        if (!branch) return false;
        const flowPath = `etl/${streamName}/__designer_flow.json`;
        const existed = !!branch.contents[flowPath];
        setState(datamartId, prev => {
            const b = prev.branches[branchName];
            const ns = deepClone(b.structure);
            ensureStreamFolder(ns, streamName);
            const nc = { ...b.contents };
            for (const [fileName, content] of Object.entries(files || {})) {
                if (content != null) nc[`etl/${streamName}/${fileName}`] = content;
            }
            ensureStreamContents(nc, streamName);
            nc[flowPath] = JSON.stringify({
                name: streamName,
                elements: flow.elements,
                connections: flow.connections,
                savedAt: new Date().toISOString(),
            }, null, 2);
            const additions = flow.elements.length + flow.connections.length;
            return {
                ...prev,
                branches: { ...prev.branches, [branchName]: { ...b, structure: ns, contents: nc } },
                commits: addCommit(
                    prev,
                    branchName,
                    commitMessage || `feat(${streamName}): ${existed ? 'update' : 'add'} stream`,
                    additions,
                    existed ? Math.min(additions, 4) : 0,
                    Object.keys(files || {}).length + 1,
                ),
            };
        });
        return true;
    }

    // Write a whole project file map (paths relative to the mart root, e.g.
    // 'etl/<stream>/DDL.sql') into a branch when importing a generated
    // datamart. Missing canonical stream files are filled with defaults;
    // resources/devops.json is ensured.
    // options.makeActive — switch the directory tab to this branch after import.
    // Reads fresh store state (not the render closure): the caller may have
    // just created the target branch in the same tick (createBranch → import).
    function importProjectFiles(branchName, files, commitMessage, options = {}) {
        const branch = getState(datamartId).branches[branchName];
        if (!branch || !files || Object.keys(files).length === 0) return false;
        setState(datamartId, prev => applyProjectImport(
            prev,
            branchName,
            files,
            commitMessage,
            !!options.makeActive,
            options.ensureCanonical !== false,
        ));
        return true;
    }

    // ── Pull requests ──────────────────────────────────────────────────────
    function createPullRequest({ title, description, sourceBranch, targetBranch }) {
        const id = `pr-${Date.now().toString(36)}`;
        const number = 100 + Math.floor(Math.random() * 900);
        const pr = {
            id,
            number,
            title: title.trim(),
            description: (description || '').trim(),
            sourceBranch,
            targetBranch,
            author: AUTHOR,
            status: 'open',
            createdAt: new Date().toISOString(),
            comments: [],
            changedFiles: 1,
            additions: 0,
            deletions: 0,
        };
        setState(datamartId, prev => ({ ...prev, pullRequests: [pr, ...prev.pullRequests] }));
        return pr;
    }

    function approvePullRequest(prId, comment) {
        setState(datamartId, prev => ({
            ...prev,
            pullRequests: prev.pullRequests.map(pr => pr.id === prId ? {
                ...pr,
                status: 'approved',
                approvedAt: new Date().toISOString(),
                comments: comment ? [
                    ...pr.comments,
                    { id: `c-${Date.now().toString(36)}`, author: AUTHOR.name, initials: AUTHOR.initials, text: comment, createdAt: new Date().toISOString() },
                ] : pr.comments,
            } : pr),
        }));
    }

    function rejectPullRequest(prId, comment) {
        setState(datamartId, prev => ({
            ...prev,
            pullRequests: prev.pullRequests.map(pr => pr.id === prId ? {
                ...pr,
                status: 'rejected',
                rejectedAt: new Date().toISOString(),
                comments: comment ? [
                    ...pr.comments,
                    { id: `c-${Date.now().toString(36)}`, author: AUTHOR.name, initials: AUTHOR.initials, text: comment, createdAt: new Date().toISOString() },
                ] : pr.comments,
            } : pr),
        }));
    }

    function addPullRequestComment(prId, text) {
        const trimmed = (text || '').trim();
        if (!trimmed) return;
        setState(datamartId, prev => ({
            ...prev,
            pullRequests: prev.pullRequests.map(pr => pr.id === prId ? {
                ...pr,
                comments: [
                    ...pr.comments,
                    { id: `c-${Date.now().toString(36)}`, author: AUTHOR.name, initials: AUTHOR.initials, text: trimmed, createdAt: new Date().toISOString() },
                ],
            } : pr),
        }));
    }

    return {
        // state
        branches: state.branches,
        activeBranch: state.activeBranch,
        pullRequests: state.pullRequests,
        commits: state.commits,
        // selectors
        listStreamsInBranch: (name) => listStreamsInBranch(state.branches[name]),
        buildStreamFlow:     (branchName, streamName) => buildStreamFlow(state.branches[branchName], streamName),
        streamExists,
        // branch ops
        switchBranch, createBranch, deleteBranch,
        // file ops
        saveFile, deleteFile, createFile,
        // stream ops (designer)
        commitStream,
        // project import (AI agent → repository)
        importProjectFiles,
        // PR ops
        createPullRequest, approvePullRequest, rejectPullRequest, addPullRequestComment,
    };
}
