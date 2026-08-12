import { request } from '../../shared/api';

export const fetchDatamart = (id) => request(`/datamarts/${id}`);
export const fetchDatamarts = () => request('/datamarts');
export const startDeploy = (data) => request('/deploy', { method: 'POST', body: JSON.stringify(data) });
