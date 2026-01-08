import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card } from '../ui/Card';
import { useData } from '../../context/DataContext';

// Machine colors as specified
const machineColors: Record<string, string> = {
    'Foreuse A': '#3B82F6',  // Bleu Roi
    'Foreuse B': '#6366F1',  // Indigo
    'Concasseur': '#8B5CF6', // Violet
    'Générateur': '#F97316', // Orange
    'Pompe': '#06B6D4',      // Cyan
    'Camion': '#10B981',     // Émeraude
};

export const MachineUsageChart: React.FC = () => {
    const { machines } = useData();

    const data = machines.map(m => ({
        name: m.name,
        hours: m.totalHours,
        color: machineColors[m.name] || '#6B7280',
    }));

    return (
        <Card className="p-4 h-full flex flex-col">
            <h3 className="text-sm font-semibold text-txt-primary mb-3">Utilisation Machines</h3>
            <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={true} vertical={false} />
                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} width={80} />
                        <Tooltip
                            formatter={(value: number) => [`${value}h`, 'Heures']}
                            contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '11px' }}
                        />
                        <Bar dataKey="hours" radius={[0, 4, 4, 0]} barSize={20}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default MachineUsageChart;
