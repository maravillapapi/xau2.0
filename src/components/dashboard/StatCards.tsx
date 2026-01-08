import React from 'react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

export const ObjectiveCard: React.FC = () => {
    return (
        <Card className="p-3 flex flex-col h-full">
            <h3 className="text-xs font-medium text-txt-secondary mb-2 whitespace-normal leading-tight">
                Taux de remplissage de l'objectif mensuel
            </h3>
            <ProgressBar value={37} max={100} showPercentage={true} size="md" color="blue" />
            <p className="text-[9px] text-txt-tertiary mt-1">De l'objectif mensuel atteint</p>
        </Card>
    );
};

export const PurityCard: React.FC = () => {
    return (
        <Card className="p-3 text-center flex flex-col flex-1 justify-center h-full">
            <h3 className="text-xs font-medium text-txt-secondary mb-2 whitespace-normal leading-tight">
                Pureté Moyenne de l'Or (Mois)
            </h3>
            <div className="w-10 h-10 mx-auto rounded-lg bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 flex items-center justify-center mb-1 shadow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-amber-700">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
                </svg>
            </div>
            <div className="text-2xl font-bold text-txt-primary">92%</div>
            <span className="text-xs font-medium text-accent-green">Excellente</span>
        </Card>
    );
};
