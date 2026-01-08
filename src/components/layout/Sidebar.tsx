import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Clock, Coins, Users, Package, BarChart3, FileText, ShoppingCart, Receipt, Settings, User, ChevronDown, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';

const navItems = [
    { section: 'PRINCIPAL', items: [{ path: '/', label: 'Tableau de bord', icon: LayoutDashboard, color: 'text-accent-blue', module: 'dashboard' as const }] },
    {
        section: 'OPÉRATIONNEL', items: [
            { path: '/pointage', label: 'Pointage', icon: Clock, color: 'text-orange-500', module: 'pointage' as const },
            { path: '/production', label: 'Production', icon: Coins, color: 'text-amber-500', module: 'production' as const },
            { path: '/personnel', label: 'Personnel', icon: Users, color: 'text-green-500', module: 'personnel' as const },
        ]
    },
    {
        section: 'GESTION', items: [
            { path: '/inventaire', label: 'Inventaire', icon: Package, color: 'text-purple-500', module: 'inventaire' as const },
            { path: '/analytiques', label: 'Analytiques', icon: BarChart3, color: 'text-pink-500', module: 'analytiques' as const },
            { path: '/rapports', label: 'Rapports', icon: FileText, color: 'text-blue-500', module: 'rapports' as const },
        ]
    },
    {
        section: 'FINANCES', items: [
            { path: '/achats', label: 'Achats', icon: ShoppingCart, color: 'text-cyan-500', module: 'achats' as const },
            { path: '/depenses', label: 'Dépenses', icon: Receipt, color: 'text-red-500', module: 'depenses' as const },
        ]
    },
    {
        section: 'ADMINISTRATION', items: [
            { path: '/admin', label: 'Admin Hub', icon: Shield, color: 'text-amber-600', module: 'admin' as const },
            { path: '/parametres', label: 'Paramètres', icon: Settings, color: 'text-gray-500', module: 'parametres' as const },
            { path: '/compte', label: 'Mon Compte', icon: User, color: 'text-indigo-500', module: 'dashboard' as const },
        ]
    },
];

export const Sidebar: React.FC = () => {
    const location = useLocation();
    const { config } = useSiteConfig();
    const { canAccess, effectiveRole } = useAuth();
    const { isExpanded, toggleSidebar } = useSidebar();

    const filteredNavItems = navItems.map(section => ({
        ...section,
        items: section.items.filter(item => canAccess(item.module))
    })).filter(section => section.items.length > 0);

    return (
        <aside className={`
            ${isExpanded ? 'w-72' : 'w-20'} 
            bg-white h-screen flex flex-col border-r border-gray-100 fixed left-0 top-0 overflow-hidden z-30
            transition-all duration-300 ease-in-out
        `}>
            {/* Logo - Golden Branding */}
            <div className="p-4 border-b border-gray-100">
                <div className={`flex items-center ${isExpanded ? 'gap-3' : 'justify-center'}`}>
                    {config.appLogo ? (
                        <img src={config.appLogo} alt="Logo" className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                    ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-lg flex-shrink-0">
                            <Coins size={20} className="text-white drop-shadow" strokeWidth={1.5} />
                        </div>
                    )}
                    {isExpanded && (
                        <div className="truncate min-w-0">
                            <h1 className="text-base font-bold bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">{config.appName}</h1>
                            <p className="text-xs text-txt-secondary truncate">{config.appSubtitle}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all z-40"
                title={isExpanded ? 'Réduire la sidebar' : 'Étendre la sidebar'}
            >
                {isExpanded ? (
                    <ChevronLeft size={14} className="text-txt-secondary" strokeWidth={2} />
                ) : (
                    <ChevronRight size={14} className="text-txt-secondary" strokeWidth={2} />
                )}
            </button>

            {/* Site Selector */}
            {isExpanded && (
                <div className="px-4 py-2">
                    <button className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg text-sm hover:bg-gray-100 transition-colors">
                        <span className="text-txt-primary font-medium truncate">Site Kolwezi</span>
                        <ChevronDown size={14} className="text-txt-secondary flex-shrink-0" strokeWidth={1.5} />
                    </button>
                </div>
            )}

            {/* Navigation */}
            <nav className={`flex-1 overflow-y-auto py-2 ${isExpanded ? 'px-3' : 'px-2'}`}>
                {filteredNavItems.map((section) => (
                    <div key={section.section} className="mb-4">
                        {isExpanded && (
                            <h3 className="text-[10px] font-semibold text-txt-tertiary uppercase tracking-wider px-3 mb-1">{section.section}</h3>
                        )}
                        {section.items.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    title={!isExpanded ? item.label : undefined}
                                    className={`
                                        flex items-center ${isExpanded ? 'gap-3 px-3' : 'justify-center px-2'} py-2 rounded-xl mb-0.5 transition-all duration-200
                                        ${isActive ? 'bg-amber-50 text-amber-700' : 'text-txt-secondary hover:bg-gray-50'}
                                    `}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-gradient-to-br from-amber-400 to-amber-600' : 'bg-gray-100'
                                        }`}>
                                        <Icon size={16} className={isActive ? 'text-white' : item.color} strokeWidth={1.5} />
                                    </div>
                                    {isExpanded && (
                                        <span className="text-sm font-medium truncate">{item.label}</span>
                                    )}
                                </NavLink>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-gray-100">
                <div className={`flex items-center ${isExpanded ? 'gap-3' : 'justify-center'}`}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">AP</div>
                    {isExpanded && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-txt-primary truncate">Administrateur</p>
                            <p className="text-xs text-txt-tertiary capitalize">{effectiveRole}</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
