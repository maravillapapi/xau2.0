import React from 'react';
import { Fuel, Wrench, Truck } from 'lucide-react';
import { Card } from '../ui/Card';
import { useData } from '../../context/DataContext';
import type { Alert } from '../../types';

const iconMap: Record<string, React.ElementType> = { carburant: Fuel, maintenance: Wrench, transport: Truck };
const colorMap: Record<string, { bg: string; iconBg: string; icon: string }> = {
    carburant: { bg: 'bg-amber-50', iconBg: 'bg-amber-100', icon: 'text-amber-600' },
    maintenance: { bg: 'bg-blue-50', iconBg: 'bg-blue-100', icon: 'text-blue-600' },
    transport: { bg: 'bg-green-50', iconBg: 'bg-green-100', icon: 'text-green-600' },
};

const AlertItem: React.FC<{ alert: Alert }> = ({ alert }) => {
    const Icon = iconMap[alert.type] || Fuel;
    const colors = colorMap[alert.type] || colorMap.carburant;
    return (
        <div className={`flex items-start gap-2 p-2 rounded-lg ${colors.bg}`}>
            <div className={`w-6 h-6 rounded-full ${colors.iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={12} strokeWidth={1.5} className={colors.icon} />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-[10px] font-medium text-txt-primary leading-tight truncate">{alert.title}</h4>
                <p className="text-[9px] text-txt-secondary line-clamp-1">{alert.description}</p>
            </div>
        </div>
    );
};

export const AlertList: React.FC = () => {
    const { alerts } = useData();

    return (
        <Card className="p-3 h-full flex flex-col">
            <h3 className="text-xs font-semibold text-txt-primary mb-2 truncate">Alertes Récentes</h3>
            <div className="space-y-1.5 flex-1 overflow-auto">
                {alerts.map((alert) => <AlertItem key={alert.id} alert={alert} />)}
            </div>
        </Card>
    );
};

export default AlertList;
