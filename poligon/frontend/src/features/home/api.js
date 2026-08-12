import { request } from '../../shared/api';

export const fetchDatamarts = () => request('/datamarts');
export const createDatamart = (data) => request('/datamarts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
});
export const updateDatamart = (id, data) => request(`/datamarts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
});
export const deleteDatamart = (id) => request(`/datamarts/${id}`, { method: 'DELETE' });

export const fetchWorkspaces = () => request('/workspaces');
export const fetchPublicWorkspaces = () => request('/workspaces/public');
export const createWorkspace = data => request('/workspaces', {
    method: 'POST', body: JSON.stringify(data),
});
export const updateWorkspace = (id, data) => request(`/workspaces/${id}`, {
    method: 'PUT', body: JSON.stringify(data),
});
export const fetchWorkspaceMembers = id => request(`/workspaces/${id}/members`);
export const addWorkspaceMember = (id, email, role) => request(`/workspaces/${id}/members`, {
    method: 'POST', body: JSON.stringify({ email, role }),
});
export const updateWorkspaceMember = (id, userId, role) => request(`/workspaces/${id}/members/${userId}`, {
    method: 'PUT', body: JSON.stringify({ role }),
});
export const removeWorkspaceMember = (id, userId) => request(`/workspaces/${id}/members/${userId}`, {
    method: 'DELETE',
});
export const fetchWorkspaceRequests = id => request(`/workspaces/${id}/requests`);
export const joinWorkspace = (id, message = '') => request(`/workspaces/${id}/requests`, {
    method: 'POST', body: JSON.stringify({ message }),
});
export const resolveWorkspaceRequest = (id, requestId, action) => request(`/workspaces/${id}/requests/${requestId}`, {
    method: 'PUT', body: JSON.stringify({ action }),
});
