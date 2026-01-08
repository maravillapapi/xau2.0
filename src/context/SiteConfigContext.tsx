import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ChartPreference = 'curve' | 'bar';

interface SiteConfig {
    appName: string;
    appSubtitle: string;
    appLogo: string | null;
    chartPreference: ChartPreference;
}

interface SiteConfigContextType {
    config: SiteConfig;
    updateConfig: (updates: Partial<SiteConfig>) => void;
    chartPreference: ChartPreference;
    setChartPreference: (preference: ChartPreference) => void;
}

const defaultConfig: SiteConfig = {
    appName: "Mine d'Or",
    appSubtitle: "Congo",
    appLogo: null,
    chartPreference: 'curve',
};

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export const SiteConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<SiteConfig>(() => {
        const saved = localStorage.getItem('siteConfig');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Ensure chartPreference exists (for migration)
            return { ...defaultConfig, ...parsed };
        }
        return defaultConfig;
    });

    useEffect(() => {
        localStorage.setItem('siteConfig', JSON.stringify(config));
    }, [config]);

    const updateConfig = (updates: Partial<SiteConfig>) => {
        setConfig(prev => ({ ...prev, ...updates }));
    };

    const setChartPreference = (preference: ChartPreference) => {
        setConfig(prev => ({ ...prev, chartPreference: preference }));
    };

    return (
        <SiteConfigContext.Provider value={{
            config,
            updateConfig,
            chartPreference: config.chartPreference,
            setChartPreference
        }}>
            {children}
        </SiteConfigContext.Provider>
    );
};

export const useSiteConfig = () => {
    const context = useContext(SiteConfigContext);
    if (!context) throw new Error('useSiteConfig must be used within SiteConfigProvider');
    return context;
};
