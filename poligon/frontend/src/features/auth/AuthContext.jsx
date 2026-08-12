import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getCurrentUser, loginUser, logoutUser, registerUser } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        getCurrentUser()
            .then(result => { if (active) setUser(result.user); })
            .catch(() => { if (active) setUser(null); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);

    const value = useMemo(() => ({
        user,
        loading,
        async signIn(credentials) {
            const result = await loginUser(credentials);
            setUser(result.user);
            return result.user;
        },
        async signUp(fields) {
            const result = await registerUser(fields);
            setUser(result.user);
            return result.user;
        },
        async signOut() {
            await logoutUser().catch(() => {});
            setUser(null);
        },
    }), [user, loading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used inside AuthProvider');
    return context;
}

function LoadingGate() {
    return (
        <div className="auth-route-loading" role="status" aria-live="polite">
            <span className="auth-route-spinner" />
            Проверяем вход…
        </div>
    );
}

export function RequireAuth() {
    const { user, loading } = useAuth();
    const location = useLocation();
    if (loading) return <LoadingGate />;
    if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    return <Outlet />;
}

export function PublicOnly({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <LoadingGate />;
    return user ? <Navigate to="/" replace /> : children;
}
