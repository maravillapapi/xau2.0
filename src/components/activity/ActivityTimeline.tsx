import React from 'react';
import { Coins, Clock, Wrench, Target } from 'lucide-react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';

const auditActivities = [
    { id: 'act-001', user: 'Jean Kabongo', action: 'a enregistré une production', details: 'Extraction de 23g', timestamp: '14:30', icon: Coins, color: 'green' },
    { id: 'act-002', user: 'Marie Mutombo', action: 'a pointé son arrivée', details: '3h de travail', timestamp: '12:00', icon: Clock, color: 'blue' },
    { id: 'act-003', user: 'Pierre Kasongo', action: 'a terminé une maintenance', details: 'Foreuse A', timestamp: '10:15', icon: Wrench, color: 'orange' },
    { id: 'act-004', user: 'Système', action: 'Objectif mensuel atteint', details: 'Production Jan', timestamp: '18:00', icon: Target, color: 'purple' },
];

const colorMap: Record<string, { bg: string; icon: string }> = {
    green: { bg: 'bg-green-100', icon: 'text-green-600' },
    blue: { bg: 'bg-blue-100', icon: 'text-blue-600' },
    orange: { bg: 'bg-orange-100', icon: 'text-orange-600' },
    purple: { bg: 'bg-purple-100', icon: 'text-purple-600' },
};

export const ActivityTimeline: React.FC = () => {
    return (
        <Card className="p-3 h-full flex flex-col">
            <h3 className="text-xs font-semibold text-txt-primary mb-3">Flux d'Activités</h3>
            <div className="space-y-3 flex-1 overflow-auto">
                {auditActivities.map((activity) => {
                    const Icon = activity.icon;
                    const colors = colorMap[activity.color];
                    return (
                        <div key={activity.id} className="flex gap-3">
                            {/* Large avatar - 48px with shrink-0 */}
                            {activity.user === 'Système' ? (
                                <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                                    <Icon size={24} strokeWidth={1.5} className={colors.icon} />
                                </div>
                            ) : (
                                <Avatar name={activity.user} size="md" />
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm font-semibold text-txt-primary truncate">{activity.user}</span>
                                    <span className="text-[10px] text-txt-tertiary flex-shrink-0">{activity.timestamp}</span>
                                </div>
                                <p className="text-xs text-txt-secondary truncate">{activity.action}</p>
                                <p className="text-[10px] text-txt-tertiary truncate">{activity.details}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

export default ActivityTimeline;
