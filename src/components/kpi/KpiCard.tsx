import React, { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Card } from '../ui/Card';
import { useData } from '../../context/DataContext';
import type { KpiData } from '../../types';

type Period = 'semaine' | 'mois' | 'annee';

// Golden/Financial icons as SVG
const CoinsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" /><path d="M7 6h1v4" /><path d="m16.71 13.88.7.71-2.82 2.82" />
    </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
    </svg>
);

const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
);

const AlertIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" />
    </svg>
);

const iconMap: Record<string, React.FC<{ className?: string }>> = {
    Coins: CoinsIcon, Calendar: CalendarIcon, Clock: ClockIcon, AlertTriangle: AlertIcon,
};

const backgroundColors: Record<number, string> = {
    0: 'bg-gradient-to-br from-amber-400 to-amber-600',
    1: 'bg-gradient-to-br from-pink-400 to-pink-600',
    2: 'bg-gradient-to-br from-blue-400 to-blue-600',
    3: 'bg-gradient-to-br from-red-400 to-red-600',
};

const periodLabels: Record<Period, string> = { semaine: 'Semaine', mois: 'Mois', annee: 'Année' };

// Fonction pour obtenir le nombre de jours dans le mois actuel
const getDaysInCurrentMonth = (): number => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
};

// Labels de contexte dynamiques
const getContextLabel = (period: Period): string => {
    switch (period) {
        case 'semaine':
            return 'sur 7 jours';
        case 'mois':
            return `sur ${getDaysInCurrentMonth()} jours`;
        case 'annee':
            return 'sur 12 mois';
    }
};

interface KpiCardProps { data: KpiData; index: number; }

export const KpiCard: React.FC<KpiCardProps> = ({ data, index }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [period, setPeriod] = useState<Period>('mois');
    const { getKpiValue } = useData();

    const Icon = iconMap[data.icon] || CoinsIcon;
    const bgColor = backgroundColors[index] || backgroundColors[0];

    const dynamicValue = data.id.includes('production')
        ? getKpiValue('production', period)
        : data.id.includes('hours')
            ? getKpiValue('hours', period)
            : data.value;

    const handlePeriodChange = (newPeriod: Period) => {
        setPeriod(newPeriod);
        setShowMenu(false);
    };

    return (
        <Card className="p-2 sm:p-3 relative h-full flex flex-col justify-between">
            {/* Period Menu Button - Absolute positioned */}
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="absolute top-1 right-1 sm:top-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded hover:bg-gray-100 text-txt-tertiary hover:text-txt-secondary z-10"
            >
                <MoreHorizontal size={12} strokeWidth={1.5} />
            </button>

            {/* Period Dropdown */}
            {showMenu && (
                <div className="absolute top-6 sm:top-8 right-1 sm:right-2 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 min-w-[80px]">
                    {(Object.keys(periodLabels) as Period[]).map((p) => (
                        <button
                            key={p}
                            onClick={() => handlePeriodChange(p)}
                            className={`w-full px-2 sm:px-3 py-1 text-left text-[10px] sm:text-xs hover:bg-gray-50 ${period === p ? 'text-accent-blue font-medium' : 'text-txt-secondary'
                                }`}
                        >
                            {periodLabels[p]}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex items-start gap-2 sm:gap-3 min-w-0">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 ${bgColor} rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0 pr-4">
                    <p className="text-[10px] sm:text-[11px] text-txt-secondary leading-tight whitespace-normal">{data.label}</p>
                    <div className="mt-0.5">
                        <span className="text-base sm:text-lg font-bold text-txt-primary whitespace-nowrap">{dynamicValue}</span>
                    </div>
                </div>
            </div>

            {data.badge && (
                <div className="flex items-center gap-1 mt-1 sm:mt-2">
                    <span className={`text-[9px] sm:text-[10px] font-medium ${data.badgeColor === 'green' ? 'text-accent-green' :
                        data.badgeColor === 'red' ? 'text-red-500' : 'text-accent-orange'
                        }`}>
                        {data.badge}
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-txt-tertiary">({getContextLabel(period)})</span>
                </div>
            )}
        </Card>
    );
};

export default KpiCard;
