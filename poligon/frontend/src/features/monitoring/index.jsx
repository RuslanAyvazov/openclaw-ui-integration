import './styles/monitoring.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Sidebar from '../../shared/components/Sidebar';
import { fetchMonitoring } from './api';
import { fetchDatamarts } from '../home/api';
import MonitoringTable from './components/MonitoringTable';
import PaginationControls from './components/PaginationControls';

export default function MonitoringPage() {
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [datamarts, setDatamarts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDatamarts().then(setDatamarts).catch(console.error);
    }, []);

    useEffect(() => {
        fetchMonitoring(page, pageSize)
            .then(data => { setRows(data.rows); setTotal(data.total); })
            .catch(console.error);
    }, [page, pageSize]);

    const totalPages = Math.ceil(total / pageSize);

    return (
        <div className="page active" id="monitoringPage">
            <Header
                title="CI/CD"
                breadcrumb={[
                    { label: 'Витрины данных', onClick: () => navigate('/') },
                    { label: 'Monitoring CI/CD' }
                ]}
            />
            <div className="main-content">
                <Sidebar activePage="monitoring" datamarts={datamarts} />
                <main className="monitoring-shell">
                    <section className="monitoring-card">
                        <div className="monitoring-header">
                            <h2 className="monitoring-title">Monitoring CI/CD</h2>
                            <p className="monitoring-subtitle">Журнал деплоев витрин данных.</p>
                        </div>
                        <div className="monitoring-toolbar">
                            <PaginationControls
                                page={page}
                                totalPages={totalPages}
                                pageSize={pageSize}
                                onPageChange={setPage}
                                onPageSizeChange={n => { setPageSize(n); setPage(1); }}
                            />
                        </div>
                        <MonitoringTable rows={rows} />
                    </section>
                </main>
            </div>
        </div>
    );
}
