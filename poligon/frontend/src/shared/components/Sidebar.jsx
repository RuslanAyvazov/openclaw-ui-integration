import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDatamarts } from '../../features/home/api';

export default function Sidebar({ activePage, datamarts: propDatamarts }) {
    const [collapsed, setCollapsed] = useState(false);
    const [datamartMenuOpen, setDatamartMenuOpen] = useState(false);
    const [datamarts, setDatamarts] = useState(propDatamarts || []);
    const navigate = useNavigate();

    useEffect(() => {
        if (propDatamarts) { setDatamarts(propDatamarts); return; }
        fetchDatamarts().then(setDatamarts).catch(() => {});
    }, [propDatamarts]);

    return (
        <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
            <button className="sidebar-toggle" onClick={() => setCollapsed(c => !c)}>
                <i className="fas fa-bars"></i>
            </button>
            <nav className="sidebar-nav">
                <div className="nav-section">
                    <div className="nav-title">Основное</div>

                    <button
                        className="nav-item nav-dropdown-toggle"
                        type="button"
                        aria-expanded={datamartMenuOpen}
                        onClick={() => setDatamartMenuOpen(o => !o)}
                    >
                        <i className="fas fa-table"></i>
                        <span className="nav-text">Витрины данных</span>
                        <i className={`fas fa-chevron-down nav-chevron${datamartMenuOpen ? ' open' : ''}`}></i>
                    </button>

                    {datamartMenuOpen && (
                        <div className="nav-submenu open">
                            {datamarts.length === 0 && (
                                <span className="nav-subitem" style={{ opacity: 0.6, cursor: 'default' }}>
                                    Нет витрин
                                </span>
                            )}
                            {datamarts.map(d => (
                                <a
                                    key={d.id}
                                    className="nav-subitem"
                                    href="#"
                                    onClick={e => { e.preventDefault(); navigate(`/directory/${d.id}`); }}
                                >
                                    {d.name}
                                </a>
                            ))}
                        </div>
                    )}

                    <a
                        className={`nav-item${activePage === 'sql' ? ' active' : ''}`}
                        href="#"
                        onClick={e => { e.preventDefault(); navigate('/sql-editor'); }}
                    >
                        <i className="fas fa-database"></i>
                        <span className="nav-text">SQL редактор</span>
                    </a>

                    <a
                        className={`nav-item${activePage === 'monitoring' ? ' active' : ''}`}
                        href="#"
                        onClick={e => { e.preventDefault(); navigate('/monitoring'); }}
                    >
                        <i className="fas fa-cube"></i>
                        <span className="nav-text">Monitoring CI/CD</span>
                    </a>
                    <a className="nav-item" href="#">
                        <i className="fas fa-cube"></i>
                        <span className="nav-text">Monitoring CTL</span>
                    </a>
                    <a className="nav-item" href="#">
                        <i className="fas fa-cube"></i>
                        <span className="nav-text">Doc</span>
                    </a>
                    <a className="nav-item" href="#">
                        <i className="fas fa-cube"></i>
                        <span className="nav-text">Support</span>
                    </a>
                </div>
            </nav>
        </aside>
    );
}
