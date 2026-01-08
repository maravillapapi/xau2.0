import React from 'react';
import { Card } from '../ui/Card';
import { useData } from '../../context/DataContext';

// Dynamic color interpolation: Gray(0%) -> Blue(50%) -> Blue Electric(100%) -> Purple(200%+)
const interpolateColor = (percentage: number): string => {
    if (percentage <= 0) return '#9CA3AF';
    if (percentage >= 200) return '#7C3AED';

    const keyframes = [
        { pct: 0, r: 156, g: 163, b: 175 },
        { pct: 50, r: 96, g: 165, b: 250 },
        { pct: 100, r: 37, g: 99, b: 235 },
        { pct: 200, r: 124, g: 58, b: 237 },
    ];

    let lower = keyframes[0], upper = keyframes[1];
    for (let i = 0; i < keyframes.length - 1; i++) {
        if (percentage >= keyframes[i].pct && percentage <= keyframes[i + 1].pct) {
            lower = keyframes[i];
            upper = keyframes[i + 1];
            break;
        }
    }

    const range = upper.pct - lower.pct;
    const ratio = range > 0 ? (percentage - lower.pct) / range : 0;

    const r = Math.round(lower.r + (upper.r - lower.r) * ratio);
    const g = Math.round(lower.g + (upper.g - lower.g) * ratio);
    const b = Math.round(lower.b + (upper.b - lower.b) * ratio);

    return `rgb(${r}, ${g}, ${b})`;
};

export const ForecastGrid: React.FC = () => {
    const { forecasts } = useData();

    return (
        <Card className="p-3 h-full flex flex-col">
            <h3 className="text-sm font-semibold text-txt-primary mb-3">Prévisions vs Réalité</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                {forecasts.map((forecast) => {
                    const percentage = (forecast.actual / forecast.planned) * 100;
                    const displayedWidth = Math.min(percentage, 100);
                    const barColor = interpolateColor(percentage);
                    const variance = ((forecast.actual - forecast.planned) / forecast.planned) * 100;
                    const varianceSign = variance >= 0 ? '+' : '';
                    const varianceArrow = variance >= 0 ? '↑' : '↓';

                    return (
                        <div key={forecast.id} className="bg-gray-50 rounded-lg p-3 flex flex-col justify-between min-h-[100px]">
                            <h4 className="text-[10px] font-bold text-txt-primary uppercase tracking-wide truncate">
                                {forecast.metric}
                            </h4>

                            <div className="flex justify-between text-[9px] mt-2 gap-1">
                                <span className="text-txt-secondary">
                                    Prévu: <span className="font-semibold text-txt-primary">
                                        {forecast.unit === '$' || forecast.unit === '$/kg' ? `${forecast.unit}${forecast.planned.toLocaleString()}` : `${forecast.planned}${forecast.unit}`}
                                    </span>
                                </span>
                                <span className="text-txt-secondary">
                                    Réel: <span className="font-semibold" style={{ color: barColor }}>
                                        {forecast.unit === '$' || forecast.unit === '$/kg' ? `${forecast.unit}${forecast.actual.toLocaleString()}` : `${forecast.actual}${forecast.unit}`}
                                    </span>
                                </span>
                            </div>

                            <div className="relative h-5 bg-gray-300 rounded-full overflow-hidden mt-2">
                                <div
                                    className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                                    style={{ width: `${displayedWidth}%`, backgroundColor: barColor }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-[9px] font-bold text-white drop-shadow">{Math.round(percentage)}%</span>
                                </div>
                            </div>

                            <div className="flex justify-end mt-2">
                                <span className="text-[10px] font-semibold" style={{ color: barColor }}>
                                    Écart: {varianceSign}{variance.toFixed(1)}% {varianceArrow}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

export default ForecastGrid;
