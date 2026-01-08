import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Clock, Coins, BarChart3, User } from 'lucide-react';

const tabItems = [
    { path: '/', icon: LayoutDashboard, label: 'Accueil' },
    { path: '/pointage', icon: Clock, label: 'Pointage' },
    { path: '/production', icon: Coins, label: 'Production' },
    { path: '/analytiques', icon: BarChart3, label: 'Stats' },
    { path: '/compte', icon: User, label: 'Profil' },
];

export const TabBar: React.FC = () => {
    const location = useLocation();

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-lg border-t border-gray-100 z-30 pb-safe">
            <div className="flex items-center justify-around h-full px-2">
                {tabItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className="flex flex-col items-center justify-center flex-1 py-2"
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-amber-100' : ''
                                }`}>
                                <Icon
                                    size={22}
                                    className={isActive ? 'text-amber-600' : 'text-txt-tertiary'}
                                    strokeWidth={isActive ? 2 : 1.5}
                                />
                            </div>
                            <span className={`text-[10px] mt-0.5 ${isActive ? 'text-amber-600 font-medium' : 'text-txt-tertiary'}`}>
                                {item.label}
                            </span>
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
};

export default TabBar;
