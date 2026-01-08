import React, { createContext, useContext, useState, ReactNode } from 'react';

export type TimeRange = 'hier' | 'semaine' | 'mois';

interface TimeRangeContextType {
    timeRange: TimeRange;
    setTimeRange: (range: TimeRange) => void;
}

const TimeRangeContext = createContext<TimeRangeContextType | undefined>(undefined);

export const TimeRangeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [timeRange, setTimeRange] = useState<TimeRange>('mois');

    return (
        <TimeRangeContext.Provider value={{ timeRange, setTimeRange }}>
            {children}
        </TimeRangeContext.Provider>
    );
};

export const useTimeRange = () => {
    const context = useContext(TimeRangeContext);
    if (!context) throw new Error('useTimeRange must be used within TimeRangeProvider');
    return context;
};
