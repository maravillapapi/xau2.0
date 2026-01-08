import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useSiteConfig } from '../../context/SiteConfigContext';

interface HeaderProps {
    onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const { config } = useSiteConfig();

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-30 lg:hidden">
            <div className="flex items-center justify-between h-full px-4">
                {/* Left: Hamburger + Logo */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMenuClick}
                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <Menu size={22} className="text-txt-secondary" strokeWidth={1.5} />
                    </button>
                    <div>
                        <h1 className="text-sm font-bold bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent truncate">
                            {config.appName}
                        </h1>
                        <p className="text-xs text-txt-tertiary truncate">{config.appSubtitle}</p>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
                        <Search size={20} className="text-txt-secondary" strokeWidth={1.5} />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors relative">
                        <Bell size={20} className="text-txt-secondary" strokeWidth={1.5} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
