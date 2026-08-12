import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './features/auth';
import HomePage from './features/home';
import MonitoringPage from './features/monitoring';
import DesignerPage from './features/designer';
import SqlEditorPage from './features/sql-editor';
import DirectoryPage from './features/directory';
import { AuthProvider, PublicOnly, RequireAuth } from './features/auth/AuthContext';

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<PublicOnly><AuthPage /></PublicOnly>} />
                    <Route element={<RequireAuth />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/monitoring" element={<MonitoringPage />} />
                        <Route path="/designer/:id" element={<DesignerPage />} />
                        <Route path="/sql-editor" element={<SqlEditorPage />} />
                        <Route path="/sql-editor/:id" element={<SqlEditorPage />} />
                        <Route path="/directory/:id" element={<DirectoryPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
