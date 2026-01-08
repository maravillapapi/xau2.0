import React, { createContext, useContext, useState, useEffect } from 'react';

interface SidebarContextType {
    isExpanded: boolean;
    setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

const STORAGE_KEY = 'sidebarExpanded';

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isExpanded, setIsExpanded] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved !== null ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(isExpanded));
    }, [isExpanded]);

    const toggleSidebar = () => setIsExpanded((prev: boolean) => !prev);

    return (
        <SidebarContext.Provider value={{ isExpanded, setIsExpanded, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
};
