import React from 'react';
import { KpiCard } from './KpiCard';

const kpiData = [
    { id: "kpi-production", label: "Production Totale", value: "222g", badge: "▲ 69%", badgeColor: "green" as const, icon: "Coins" },
    { id: "kpi-production-week", label: "Production", value: "1.94 kg", badge: "▲ 10.9%", badgeColor: "green" as const, icon: "Calendar" },
    { id: "kpi-hours", label: "Heures Travaillées", value: "144h", badge: "▲ 19.9%", badgeColor: "green" as const, icon: "Clock" },
    { id: "kpi-incidents", label: "Incidents", value: "6", badge: "▼ 25%", badgeColor: "green" as const, icon: "AlertTriangle" },
];

export const KpiGrid: React.FC = () => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 items-stretch">
            {kpiData.map((kpi, index) => (
                <KpiCard key={kpi.id} data={kpi as any} index={index} />
            ))}
        </div>
    );
};

export default KpiGrid;
