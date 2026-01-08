import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Check, Settings, Lock, Eye, Palette } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useData } from '../context/DataContext';
import { useAuth, UserRole } from '../context/AuthContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { Navigate } from 'react-router-dom';

const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

type ModuleKey = 'dashboard' | 'pointage' | 'production' | 'personnel' | 'inventaire' | 'analytiques' | 'rapports' | 'achats' | 'depenses' | 'parametres';

const allModules: { key: ModuleKey; label: string }[] = [
    { key: 'dashboard', label: 'Tableau de bord' },
    { key: 'pointage', label: 'Pointage' },
    { key: 'production', label: 'Production' },
    { key: 'personnel', label: 'Personnel' },
    { key: 'inventaire', label: 'Inventaire' },
    { key: 'analytiques', label: 'Analytiques' },
    { key: 'rapports', label: 'Rapports' },
    { key: 'achats', label: 'Achats' },
    { key: 'depenses', label: 'Dépenses' },
    { key: 'parametres', label: 'Paramètres' },
];

export const Admin: React.FC = () => {
    const { closedDays, toggleClosedDay } = useData();
    const { canAccess, permissions, updatePermissions, setImpersonatedRole, isSimulating, effectiveRole } = useAuth();
    const { config, setConfig } = useSiteConfig();
    const [currentMonth, setCurrentMonth] = useState(0);
    const [currentYear] = useState(2026);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Access control
    if (!canAccess('admin')) {
        return <Navigate to="/" replace />;
    }

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const firstDayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const calendarDays: (number | null)[] = [];
    for (let i = 0; i < firstDayOffset; i++) calendarDays.push(null);
    for (let day = 1; day <= daysInMonth; day++) calendarDays.push(day);

    const getDateStr = (day: number) =>
        `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const toggleModuleForRole = (role: 'superviseur' | 'travailleur', moduleKey: ModuleKey) => {
        const currentModules = permissions[role] || [];
        const newModules = currentModules.includes(moduleKey)
            ? currentModules.filter(m => m !== moduleKey)
            : [...currentModules, moduleKey];
        updatePermissions(role, newModules);
    };

    const handleSimulation = (role: UserRole | null) => {
        setImpersonatedRole(role);
        if (role) {
            setToastMessage(`Mode simulation activé : vue ${role}`);
        } else {
            setToastMessage('Mode simulation désactivé');
        }
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setConfig({ ...config, appLogo: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6">
            {/* Toast */}
            {showToast && (
                <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-3 rounded-xl shadow-lg z-50">
                    {toastMessage}
                </div>
            )}

            <div>
                <h1 className="text-xl font-bold text-txt-primary">Administration</h1>
                <p className="text-sm text-txt-secondary">Gestion du site, permissions et simulation</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Closure Calendar */}
                <Card className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Settings size={20} className="text-amber-600" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-txt-primary">Calendrier de Fermeture</h2>
                            <p className="text-xs text-txt-secondary">Cliquez sur un jour pour basculer</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                        <button onClick={() => setCurrentMonth(p => p > 0 ? p - 1 : 11)} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
                            <ChevronLeft size={16} className="text-txt-secondary" />
                        </button>
                        <span className="text-sm font-semibold text-txt-primary">{months[currentMonth]} {currentYear}</span>
                        <button onClick={() => setCurrentMonth(p => p < 11 ? p + 1 : 0)} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
                            <ChevronRight size={16} className="text-txt-secondary" />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {weekDays.map((day, i) => (
                            <div key={i} className="text-center text-xs text-txt-tertiary font-medium py-1">{day}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((day, i) => {
                            if (day === null) return <div key={i} className="aspect-square" />;
                            const dateStr = getDateStr(day);
                            const isClosed = closedDays.includes(dateStr);

                            return (
                                <button
                                    key={i}
                                    onClick={() => toggleClosedDay(dateStr)}
                                    className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${isClosed
                                            ? 'bg-gray-300 text-gray-900'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                        }`}
                                >
                                    {isClosed ? <X size={14} strokeWidth={2.5} /> : day}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-green-100" /><span className="text-xs text-txt-secondary">Ouvert</span></div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-gray-300 flex items-center justify-center"><X size={8} strokeWidth={3} /></div><span className="text-xs text-txt-secondary">Fermé</span></div>
                    </div>
                </Card>

                {/* Site Identity */}
                <Card className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Palette size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-txt-primary">Identité du Site</h2>
                            <p className="text-xs text-txt-secondary">Personnalisez l'apparence</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-txt-secondary mb-1">Nom de l'Application</label>
                            <input
                                type="text"
                                value={config.appName}
                                onChange={(e) => setConfig({ ...config, appName: e.target.value })}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-txt-secondary mb-1">Sous-titre</label>
                            <input
                                type="text"
                                value={config.appSubtitle}
                                onChange={(e) => setConfig({ ...config, appSubtitle: e.target.value })}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-txt-secondary mb-1">Logo</label>
                            <div className="flex items-center gap-3">
                                {config.appLogo ? (
                                    <img src={config.appLogo} alt="Logo" className="w-12 h-12 rounded-xl object-cover" />
                                ) : (
                                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-txt-tertiary">?</div>
                                )}
                                <label className="cursor-pointer px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-txt-secondary">
                                    Choisir un fichier
                                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                                </label>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Simulation Mode */}
            <Card className="p-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Eye size={20} className="text-orange-600" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-txt-primary">Mode Simulation</h2>
                        <p className="text-xs text-txt-secondary">Testez l'application avec un autre rôle</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button
                        variant={isSimulating && effectiveRole === 'superviseur' ? 'primary' : 'secondary'}
                        onClick={() => handleSimulation(isSimulating && effectiveRole === 'superviseur' ? null : 'superviseur')}
                        className={isSimulating && effectiveRole === 'superviseur' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                    >
                        {isSimulating && effectiveRole === 'superviseur' ? 'Quitter' : 'Voir comme Superviseur'}
                    </Button>
                    <Button
                        variant={isSimulating && effectiveRole === 'travailleur' ? 'primary' : 'secondary'}
                        onClick={() => handleSimulation(isSimulating && effectiveRole === 'travailleur' ? null : 'travailleur')}
                        className={isSimulating && effectiveRole === 'travailleur' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                    >
                        {isSimulating && effectiveRole === 'travailleur' ? 'Quitter' : 'Voir comme Travailleur'}
                    </Button>
                </div>
            </Card>

            {/* Permissions Matrix */}
            <Card className="p-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Lock size={20} className="text-purple-600" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-txt-primary">Matrice de Permissions</h2>
                        <p className="text-xs text-txt-secondary">Configurez les accès par rôle</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-3 text-txt-secondary font-medium">Module</th>
                                <th className="text-center py-3 px-3 text-txt-secondary font-medium w-24">Admin</th>
                                <th className="text-center py-3 px-3 text-txt-secondary font-medium w-24">Superviseur</th>
                                <th className="text-center py-3 px-3 text-txt-secondary font-medium w-24">Travailleur</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allModules.map((module) => (
                                <tr key={module.key} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="py-3 px-3 text-txt-primary">{module.label}</td>
                                    {/* Admin - Always checked, disabled */}
                                    <td className="text-center py-3 px-3">
                                        <div className="flex justify-center">
                                            <input
                                                type="checkbox"
                                                checked={true}
                                                disabled={true}
                                                className="w-5 h-5 rounded border-gray-300 text-green-500 opacity-50 cursor-not-allowed"
                                            />
                                        </div>
                                    </td>
                                    {/* Superviseur */}
                                    <td className="text-center py-3 px-3">
                                        <div className="flex justify-center">
                                            <input
                                                type="checkbox"
                                                checked={permissions.superviseur?.includes(module.key) ?? false}
                                                onChange={() => toggleModuleForRole('superviseur', module.key)}
                                                className="w-5 h-5 rounded border-gray-300 text-accent-blue cursor-pointer"
                                            />
                                        </div>
                                    </td>
                                    {/* Travailleur */}
                                    <td className="text-center py-3 px-3">
                                        <div className="flex justify-center">
                                            <input
                                                type="checkbox"
                                                checked={permissions.travailleur?.includes(module.key) ?? false}
                                                onChange={() => toggleModuleForRole('travailleur', module.key)}
                                                className="w-5 h-5 rounded border-gray-300 text-accent-blue cursor-pointer"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Admin;
