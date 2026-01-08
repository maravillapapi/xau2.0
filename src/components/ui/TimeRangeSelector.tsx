import React from 'react';

export type Period = 'semaine' | 'mois' | 'annee';

interface TimeRangeSelectorProps {
    value: Period;
    onChange: (period: Period) => void;
    size?: 'sm' | 'md';
}

const periodLabels: Record<Period, string> = {
    semaine: 'Semaine',
    mois: 'Mois',
    annee: 'Année',
};

/**
 * TimeRangeSelector - Composant de sélection de période unifié
 * Style "Segmented Control" premium : fond gris clair, pilule blanche active, ombre légère
 */
export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
    value,
    onChange,
    size = 'md'
}) => {
    const isSmall = size === 'sm';

    return (
        <div className="flex gap-0.5 bg-gray-100 p-0.5 rounded-lg flex-shrink-0">
            {(['semaine', 'mois', 'annee'] as Period[]).map((period) => {
                const isActive = value === period;
                return (
                    <button
                        key={period}
                        onClick={() => onChange(period)}
                        className={`
                            ${isSmall ? 'px-1.5 py-0.5 text-[7px]' : 'px-2 py-1 text-[8px]'}
                            font-medium rounded-md transition-all duration-200
                            ${isActive
                                ? 'bg-white text-txt-primary shadow-sm'
                                : 'text-txt-tertiary hover:text-txt-secondary'
                            }
                        `}
                    >
                        {periodLabels[period]}
                    </button>
                );
            })}
        </div>
    );
};

export default TimeRangeSelector;
