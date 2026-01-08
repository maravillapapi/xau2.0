import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileDrawer } from './MobileDrawer';
import { TabBar } from './TabBar';
import { useAuth } from '../../context/AuthContext';
import { SidebarProvider, useSidebar } from '../../context/SidebarContext';

const MainLayoutContent: React.FC = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { isSimulating, effectiveRole } = useAuth();
    const { isExpanded } = useSidebar();

    // Close drawer on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setIsDrawerOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-surface-secondary">
            {/* Simulation Banner */}
            {isSimulating && (
                <div className="fixed top-0 left-0 right-0 bg-orange-500 text-white text-center py-2 text-sm font-medium z-[60]">
                    Mode Simulation : Vous voyez l'application en tant que "{effectiveRole}"
                </div>
            )}

            {/* Desktop Sidebar - Hidden on mobile */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            {/* Mobile Header - Visible only on mobile/tablet */}
            <div className="lg:hidden">
                <Header onMenuClick={() => setIsDrawerOpen(true)} />
            </div>

            {/* Mobile Drawer (Slide-over) - z-50 to stay above content */}
            <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

            {/* Main Content Area - Dynamic margin based on sidebar state */}
            <main
                className={`
                    min-h-screen transition-all duration-300 ease-in-out
                    ${isSimulating ? 'pt-10' : ''}
                    ${isExpanded ? 'lg:ml-72' : 'lg:ml-20'}
                `}
            >
                <div className={`
                    p-4 lg:p-6
                    pt-20 lg:pt-6
                    pb-24 lg:pb-6
                `}>
                    <Outlet />
                </div>
            </main>

            {/* Mobile Tab Bar - Fixed at bottom */}
            <div className="lg:hidden">
                <TabBar />
            </div>
        </div>
    );
};

export const MainLayout: React.FC = () => {
    return (
        <SidebarProvider>
            <MainLayoutContent />
        </SidebarProvider>
    );
};

export default MainLayout;
