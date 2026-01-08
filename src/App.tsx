import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SiteConfigProvider } from './context/SiteConfigContext';
import { DataProvider } from './context/DataContext';
import { PurchaseProvider } from './context/PurchaseContext';
import { ToastProvider } from './context/ToastContext';
import ScrollToTop from './components/utils/ScrollToTop';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './views/Dashboard';
import { Pointage } from './views/Pointage';
import { Production } from './views/Production';
import { Personnel } from './views/Personnel';
import { Inventaire } from './views/Inventaire';
import { Analytiques } from './views/Analytiques';
import { Rapports } from './views/Rapports';
import { Achats } from './views/Achats';
import { Depenses } from './views/Depenses';
import { Parametres } from './views/Parametres';
import { Admin } from './views/Admin';

// Protected Route Component
const ProtectedRoute: React.FC<{ module: string; children: React.ReactNode }> = ({ module, children }) => {
    const { canAccess } = useAuth();
    if (!canAccess(module as any)) {
        return <Navigate to="/" replace />;
    }
    return <>{children}</>;
};

// Simple Compte view
const Compte = () => (
    <div className="space-y-4 max-w-xl">
        <div><h1 className="text-xl font-bold text-txt-primary">Mon Compte</h1><p className="text-sm text-txt-secondary">Profil et préférences</p></div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-2xl font-bold mb-4">AP</div>
            <h2 className="text-lg font-semibold text-txt-primary">Administrateur Principal</h2>
            <p className="text-sm text-txt-secondary">admin@minedor.cd</p>
        </div>
    </div>
);

// 403 Forbidden Page
const Forbidden = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-6xl font-bold text-red-500 mb-2">403</div>
        <h1 className="text-xl font-semibold text-txt-primary mb-2">Accès Refusé</h1>
        <p className="text-txt-secondary mb-4">Vous n'avez pas les permissions pour accéder à cette page.</p>
        <a href="/" className="text-accent-blue hover:underline">Retour au tableau de bord</a>
    </div>
);

function App() {
    return (
        <AuthProvider>
            <SiteConfigProvider>
                <DataProvider>
                    <PurchaseProvider>
                        <ToastProvider>
                            <BrowserRouter>
                                <ScrollToTop />
                                <Routes>
                                    <Route element={<MainLayout />}>
                                        <Route path="/" element={<Dashboard />} />
                                        <Route path="/pointage" element={<ProtectedRoute module="pointage"><Pointage /></ProtectedRoute>} />
                                        <Route path="/production" element={<ProtectedRoute module="production"><Production /></ProtectedRoute>} />
                                        <Route path="/personnel" element={<ProtectedRoute module="personnel"><Personnel /></ProtectedRoute>} />
                                        <Route path="/inventaire" element={<ProtectedRoute module="inventaire"><Inventaire /></ProtectedRoute>} />
                                        <Route path="/analytiques" element={<ProtectedRoute module="analytiques"><Analytiques /></ProtectedRoute>} />
                                        <Route path="/rapports" element={<ProtectedRoute module="rapports"><Rapports /></ProtectedRoute>} />
                                        <Route path="/achats" element={<ProtectedRoute module="achats"><Achats /></ProtectedRoute>} />
                                        <Route path="/depenses" element={<ProtectedRoute module="depenses"><Depenses /></ProtectedRoute>} />
                                        <Route path="/parametres" element={<ProtectedRoute module="parametres"><Parametres /></ProtectedRoute>} />
                                        <Route path="/admin" element={<ProtectedRoute module="admin"><Admin /></ProtectedRoute>} />
                                        <Route path="/compte" element={<Compte />} />
                                        <Route path="/403" element={<Forbidden />} />
                                    </Route>
                                </Routes>
                            </BrowserRouter>
                        </ToastProvider>
                    </PurchaseProvider>
                </DataProvider>
            </SiteConfigProvider>
        </AuthProvider>
    );
}

export default App;
