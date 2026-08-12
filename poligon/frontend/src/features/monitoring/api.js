import { request } from '../../shared/api';

export const fetchMonitoring = (page = 1, pageSize = 20) =>
    request(`/monitoring?page=${page}&pageSize=${pageSize}`);
