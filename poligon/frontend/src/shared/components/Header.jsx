import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';

function initials(name) {
    const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    return (parts.slice(0, 2).map(part => part[0]).join('') || 'U').toUpperCase();
}

export default function Header({ title, breadcrumb }) {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        if (!menuOpen) return undefined;
        function close(event) {
            if (!menuRef.current?.contains(event.target)) setMenuOpen(false);
        }
        function closeOnEscape(event) {
            if (event.key === 'Escape') setMenuOpen(false);
        }
        document.addEventListener('mousedown', close);
        document.addEventListener('keydown', closeOnEscape);
        return () => {
            document.removeEventListener('mousedown', close);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [menuOpen]);

    async function logout() {
        setMenuOpen(false);
        await signOut();
        navigate('/login', { replace: true });
    }

    return (
        <header className="header">
            <div className="header-left">
                <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <i className="fas fa-database"></i>
                    <span>B2CSQL Studio</span>
                </div>
                {title && <div className="app-title">{title}</div>}
                {breadcrumb && (
                    <div className="breadcrumb">
                        {breadcrumb.map((item, i) => (
                            <span key={i}>
                                {i > 0 && <span className="breadcrumb-separator">/</span>}
                                <span
                                    className="breadcrumb-item"
                                    onClick={item.onClick}
                                    style={item.onClick ? { cursor: 'pointer' } : {}}
                                >
                                    {item.label}
                                </span>
                            </span>
                        ))}
                    </div>
                )}
            </div>
            <div className="header-right">
                <div className="user-menu" ref={menuRef}>
                    <button type="button" className="user-info" onClick={() => setMenuOpen(open => !open)}
                            aria-expanded={menuOpen} aria-haspopup="menu">
                        <span className="user-avatar">{initials(user?.name)}</span>
                        <span className="user-name">{user?.name || user?.login}</span>
                        <i className={`fas fa-chevron-${menuOpen ? 'up' : 'down'} user-menu-caret`} />
                    </button>
                    {menuOpen && (
                        <div className="user-dropdown" role="menu">
                            <div className="user-dropdown-head">
                                <strong>{user?.name}</strong>
                                <span>{user?.email}</span>
                                <code>{user?.login}</code>
                            </div>
                            <button type="button" role="menuitem" onClick={logout}>
                                <i className="fas fa-arrow-right-from-bracket" /> Выйти
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
