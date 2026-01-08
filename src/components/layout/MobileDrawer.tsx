import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { X, LayoutDashboard, Clock, Gem, Users, Package, BarChart3, FileText, ShoppingCart, Receipt, Settings, User } from 'lucide-react';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { useAuth } from '../../context/AuthContext';

const navItems = [
    { path: '/', label: 'Tableau de bord', icon: LayoutDashboard, module: 'dashboard' as const },
    { path: '/pointage', label: 'Pointage', icon: Clock, module: 'pointage' as const },
    { path: '/production', label: 'Production', icon: Gem, module: 'production' as const },
    { path: '/personnel', label: 'Personnel', icon: Users, module: 'personnel' as const },
    { path: '/inventaire', label: 'Inventaire', icon: Package, module: 'inventaire' as const },
    { path: '/analytiques', label: 'Analytiques', icon: BarChart3, module: 'analytiques' as const },
    { path: '/rapports', label: 'Rapports', icon: FileText, module: 'rapports' as const },
    { path: '/achats', label: 'Achats', icon: ShoppingCart, module: 'achats' as const },
    { path: '/depenses', label: 'Dépenses', icon: Receipt, module: 'depenses' as const },
    { path: '/parametres', label: 'Paramètres', icon: Settings, module: 'parametres' as const },
];

interface MobileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
    const location = useLocation();
    const { config } = useSiteConfig();
    const { canAccess } = useAuth();

    const filteredNavItems = navItems.filter(item => canAccess(item.module));

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                onClick={onClose}
            />

            {/* Drawer */}
            <aside className="fixed top-0 left-0 w-72 h-full bg-white shadow-2xl z-50 lg:hidden animate-drawer-slide-in overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {config.appLogo ? (
                            <img src={config.appLogo} alt="Logo" className="w-10 h-10 rounded-xl object-cover" />
                        ) : (
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                                <Gem size={20} className="text-white" strokeWidth={1.5} />
                            </div>
                        )}
                        <div>
                            <h1 className="text-base font-bold text-txt-primary">{config.appName}</h1>
                            <p className="text-xs text-txt-secondary">{config.appSubtitle}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
                        <X size={20} className="text-txt-secondary" strokeWidth={1.5} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-3">
                    {filteredNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-colors ${isActive ? 'bg-blue-50 text-accent-blue' : 'text-txt-secondary hover:bg-gray-50'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-accent-blue' : 'text-txt-tertiary'} strokeWidth={1.5} />
                                <span className="text-sm font-medium">{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">AP</div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-txt-primary truncate">Administrateur</p>
                            <p className="text-xs text-txt-tertiary">Admin</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default MobileDrawer;
