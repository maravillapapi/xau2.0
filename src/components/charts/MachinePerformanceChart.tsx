import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card } from '../ui/Card';

const allMachines = [
    { id: 'A', name: 'Machine A', hours: 80 },
    { id: 'B', name: 'Machine B', hours: 64 },
    { id: 'C', name: 'Machine C', hours: 45 },
    { id: 'D', name: 'Machine D', hours: 72 },
];

export const MachinePerformanceChart: React.FC = () => {
    const [selectedMachines, setSelectedMachines] = useState(['A', 'B']);
    const [showDropdown, setShowDropdown] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const machines = allMachines.filter(m => selectedMachines.includes(m.id));
    const maxHours = Math.max(...machines.map(m => m.hours));

    const toggleMachine = (id: string) => {
        if (selectedMachines.includes(id)) {
            if (selectedMachines.length > 1) setSelectedMachines(prev => prev.filter(m => m !== id));
        } else {
            setSelectedMachines(prev => [...prev, id]);
        }
    };

    // Gradient colors for active state
    const activeGradients = [
        'linear-gradient(180deg, #60A5FA 0%, #2563EB 50%, #1E40AF 100%)',
        'linear-gradient(180deg, #A78BFA 0%, #7C3AED 50%, #5B21B6 100%)',
        'linear-gradient(180deg, #C084FC 0%, #9333EA 50%, #7C2D8E 100%)',
        'linear-gradient(180deg, #67E8F9 0%, #22D3EE 50%, #0891B2 100%)',
    ];

    // Gradient colors for default state
    const defaultGradients = [
        'linear-gradient(180deg, #3B82F6 0%, rgba(59, 130, 246, 0.3) 100%)',
        'linear-gradient(180deg, #6366F1 0%, rgba(99, 102, 241, 0.3) 100%)',
        'linear-gradient(180deg, #8B5CF6 0%, rgba(139, 92, 246, 0.3) 100%)',
        'linear-gradient(180deg, #06B6D4 0%, rgba(6, 182, 212, 0.3) 100%)',
    ];

    // Dimmed gradient for inactive bars
    const dimmedGradient = 'linear-gradient(180deg, #E5E7EB 0%, rgba(229, 231, 235, 0.3) 100%)';

    return (
        <Card className="p-3 h-full flex flex-col">
            <div className="flex items-center justify-between mb-2 gap-1">
                <h3 className="text-[10px] font-semibold text-txt-primary truncate">Performance Machine</h3>
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-0.5 text-[8px] text-txt-secondary bg-gray-100 px-1.5 py-0.5 rounded"
                    >
                        {selectedMachines.length} sel.
                        <ChevronDown size={8} strokeWidth={1.5} />
                    </button>
                    {showDropdown && (
                        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 p-1.5 z-10 min-w-[80px]">
                            {allMachines.map(m => (
                                <label key={m.id} className="flex items-center gap-1.5 p-0.5 hover:bg-gray-50 rounded cursor-pointer">
                                    <input type="checkbox" checked={selectedMachines.includes(m.id)} onChange={() => toggleMachine(m.id)} className="w-2.5 h-2.5 rounded" />
                                    <span className="text-[9px] text-txt-primary">{m.name}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-end justify-center gap-4 flex-1 pt-2">
                {machines.map((machine, index) => {
                    const heightPercent = (machine.hours / maxHours) * 100;
                    const isActive = activeIndex === index;
                    const isDimmed = activeIndex !== null && activeIndex !== index;

                    return (
                        <div
                            key={machine.id}
                            className="flex flex-col items-center gap-1 h-full cursor-pointer"
                            onMouseEnter={() => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                        >
                            <span className={`text-xs font-bold transition-all duration-300 ${isActive ? 'text-accent-blue scale-110' : isDimmed ? 'text-gray-400' : 'text-txt-primary'
                                }`}>
                                {machine.hours}h
                            </span>
                            <div className="w-12 bg-gray-100 rounded-t-lg flex-1 relative min-h-[60px]">
                                <div
                                    className="absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-300"
                                    style={{
                                        height: `${heightPercent}%`,
                                        background: isActive
                                            ? activeGradients[index] || activeGradients[0]
                                            : isDimmed
                                                ? dimmedGradient
                                                : defaultGradients[index] || defaultGradients[0],
                                        boxShadow: isActive
                                            ? '0 0 12px rgba(255, 255, 255, 0.8), 0 -4px 16px rgba(59, 130, 246, 0.5)'
                                            : isDimmed
                                                ? 'none'
                                                : '0 -4px 12px rgba(59, 130, 246, 0.2)',
                                        transform: isActive ? 'scaleX(1.05)' : 'scaleX(1)',
                                    }}
                                />
                            </div>
                            <span className={`text-[9px] font-medium truncate max-w-[50px] transition-all duration-300 ${isActive ? 'text-accent-blue' : isDimmed ? 'text-gray-400' : 'text-txt-secondary'
                                }`}>
                                {machine.name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

export default MachinePerformanceChart;
