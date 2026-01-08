import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card } from '../ui/Card';
import { TimeRangeSelector, type Period } from '../ui/TimeRangeSelector';
import { useData } from '../../context/DataContext';
import { useSiteConfig } from '../../context/SiteConfigContext';

// Custom Tooltip with full date display
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2">
                <p className="text-xs font-medium text-txt-primary mb-1">
                    {data.fullLabel || label}
                </p>
                <p className="text-sm font-bold text-amber-600">
                    {payload[0].value} g
                </p>
            </div>
        );
    }
    return null;
};

// Empty state component
const EmptyState: React.FC<{ period: string }> = ({ period }) => (
    <div className="h-full min-h-[300px] flex items-center justify-center bg-gray-50/50 rounded-lg">
        <div className="text-center">
            <p className="text-txt-secondary text-sm">Aucune donnée disponible</p>
            <p className="text-txt-tertiary text-xs mt-1">pour la période "{period}"</p>
        </div>
    </div>
);

export const ProductionAreaChart: React.FC = () => {
    const [period, setPeriod] = useState<Period>('mois');
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const { getProductionByPeriod } = useData();
    const { chartPreference } = useSiteConfig();
    const data = getProductionByPeriod(period === 'annee' ? 'annee' : period === 'semaine' ? 'semaine' : 'mois');

    // Calculer l'intervalle pour l'axe X selon la période
    const getXAxisInterval = () => {
        if (period === 'mois') {
            return Math.ceil(data.length / 7);
        }
        return 0;
    };

    const periodLabels = { semaine: 'Semaine', mois: 'Mois', annee: 'Année' };
    const hasData = data && data.length > 0;

    return (
        <Card className="p-3 sm:p-4 h-full flex flex-col">
            {/* Header - Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2 sm:gap-4">
                <h3 className="text-sm sm:text-base font-semibold text-txt-primary break-words overflow-hidden">
                    Production Totale
                </h3>
                <TimeRangeSelector value={period} onChange={setPeriod} />
            </div>

            {/* Chart Container */}
            <div className="flex-1 min-h-[300px] h-80">
                {hasData ? (
                    <ResponsiveContainer width="100%" height="100%">
                        {chartPreference === 'bar' ? (
                            // BAR CHART WITH FOCUS EFFECT
                            <BarChart
                                data={data}
                                margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                                onMouseMove={(state) => {
                                    if (state && state.activeTooltipIndex !== undefined) {
                                        setActiveIndex(state.activeTooltipIndex);
                                    }
                                }}
                                onMouseLeave={() => setActiveIndex(null)}
                            >
                                <defs>
                                    {/* Base gradient */}
                                    <linearGradient id="productionBarGradient" x1="0" y1="1" x2="0" y2="0">
                                        <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.4} />
                                        <stop offset="100%" stopColor="#F59E0B" stopOpacity={1} />
                                    </linearGradient>
                                    {/* Explosive gradient for active bar */}
                                    <linearGradient id="explosiveOrange" x1="0" y1="1" x2="0" y2="0">
                                        <stop offset="0%" stopColor="#FF4500" stopOpacity={1} />
                                        <stop offset="50%" stopColor="#FF6B00" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#FFD700" stopOpacity={0.95} />
                                    </linearGradient>
                                    {/* Dimmed gradient for inactive bars */}
                                    <linearGradient id="dimmedGradient" x1="0" y1="1" x2="0" y2="0">
                                        <stop offset="0%" stopColor="#D1D5DB" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#E5E7EB" stopOpacity={0.6} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                                <XAxis
                                    dataKey="label"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 9, fill: '#9CA3AF' }}
                                    interval={getXAxisInterval()}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9CA3AF' }} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                <Bar
                                    dataKey="value"
                                    radius={[6, 6, 0, 0]}
                                    maxBarSize={40}
                                >
                                    {data.map((_entry: any, index: number) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill="transparent"
                                            style={{
                                                fill: activeIndex === index
                                                    ? 'url(#explosiveOrange)'
                                                    : activeIndex !== null
                                                        ? 'url(#dimmedGradient)'
                                                        : 'url(#productionBarGradient)',
                                                filter: activeIndex === index
                                                    ? 'drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.9)) drop-shadow(0px 0px 6px rgba(255, 165, 0, 0.6))'
                                                    : 'none',
                                                transition: 'all 0.4s ease-in-out',
                                            }}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        ) : (
                            // AREA CHART (default)
                            <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="productionGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                                <XAxis
                                    dataKey="label"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 9, fill: '#9CA3AF' }}
                                    interval={getXAxisInterval()}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9CA3AF' }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="value" stroke="#F59E0B" strokeWidth={2} fill="url(#productionGradient)" />
                            </AreaChart>
                        )}
                    </ResponsiveContainer>
                ) : (
                    <EmptyState period={periodLabels[period]} />
                )}
            </div>
        </Card>
    );
};

export default ProductionAreaChart;
