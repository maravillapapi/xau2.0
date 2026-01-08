import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../components/ui/Card';
import { MachineUsageChart } from '../components/charts/MachineUsageChart';
import { useData } from '../context/DataContext';

type Period = 'semaine' | 'mois' | 'annee';

const expensesByPeriod = {
    semaine: [{ month: 'L', value: 620 }, { month: 'M', value: 540 }, { month: 'M', value: 680 }, { month: 'J', value: 450 }, { month: 'V', value: 590 }, { month: 'S', value: 320 }],
    mois: [{ month: 'S1', value: 1200 }, { month: 'S2', value: 1450 }, { month: 'S3', value: 1320 }, { month: 'S4', value: 1580 }],
    annee: [{ month: 'Jan', value: 4200 }, { month: 'Fév', value: 3800 }, { month: 'Mar', value: 4500 }, { month: 'Avr', value: 3200 }, { month: 'Mai', value: 4100 }, { month: 'Juin', value: 3900 }],
};

const expenseDistribution = [
    { name: 'Carburant', value: 35, color: '#3B82F6' },
    { name: 'Équipement', value: 25, color: '#8B5CF6' },
    { name: 'Salaires', value: 25, color: '#10B981' },
    { name: 'Transport', value: 10, color: '#F97316' },
    { name: 'Autres', value: 5, color: '#6B7280' },
];

export const Analytiques: React.FC = () => {
    const { productionData } = useData();
    const [prodPeriod, setProdPeriod] = useState<Period>('mois');
    const [expPeriod, setExpPeriod] = useState<Period>('mois');

    const annualData = productionData[prodPeriod === 'annee' ? 'annee' : prodPeriod] || productionData.mois;
    const expData = expensesByPeriod[expPeriod];

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-xl font-bold text-txt-primary">Analytiques</h1>
                <p className="text-sm text-txt-secondary">Visualisation des données opérationnelles</p>
            </div>

            {/* Production Chart */}
            <Card className="p-4">
                <div className="flex items-center justify-between mb-3 gap-2">
                    <h3 className="text-sm font-semibold text-txt-primary">Production Totale (g)</h3>
                    <div className="flex gap-0.5 bg-gray-100 p-0.5 rounded-lg">
                        {(['semaine', 'mois', 'annee'] as Period[]).map((p) => (
                            <button key={p} onClick={() => setProdPeriod(p)}
                                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${prodPeriod === p ? 'bg-amber-500 text-white' : 'text-txt-secondary hover:text-txt-primary'}`}>
                                {p === 'annee' ? 'Année' : p.charAt(0).toUpperCase() + p.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={annualData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="analyticsProdGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                            <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px' }} formatter={(value: number) => [`${value} g`, 'Production']} />
                            <Area type="monotone" dataKey="value" stroke="#F59E0B" strokeWidth={2} fill="url(#analyticsProdGradient)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Monthly Expenses */}
                <Card className="p-4">
                    <div className="flex items-center justify-between mb-3 gap-2">
                        <h3 className="text-sm font-semibold text-txt-primary">Tendances Dépenses ($)</h3>
                        <div className="flex gap-0.5 bg-gray-100 p-0.5 rounded-lg">
                            {(['semaine', 'mois', 'annee'] as Period[]).map((p) => (
                                <button key={p} onClick={() => setExpPeriod(p)}
                                    className={`px-2 py-1 text-xs font-medium rounded transition-colors ${expPeriod === p ? 'bg-purple-500 text-white' : 'text-txt-secondary hover:text-txt-primary'}`}>
                                    {p === 'annee' ? 'Année' : p.charAt(0).toUpperCase() + p.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={expData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px' }} formatter={(value: number) => [`$${value}`, 'Dépenses']} />
                                <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Machine Usage with Categorical Colors */}
                <MachineUsageChart />
            </div>

            {/* Expense Distribution */}
            <Card className="p-4">
                <h3 className="text-sm font-semibold text-txt-primary mb-3">Répartition des Dépenses</h3>
                <div className="flex flex-col lg:flex-row items-center gap-6">
                    <div className="w-48 h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={expenseDistribution} innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                                    {expenseDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip formatter={(value: number) => [`${value}%`, '']} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-3">
                        {expenseDistribution.map((item) => (
                            <div key={item.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                                <span className="text-sm text-txt-secondary">{item.name}</span>
                                <span className="text-sm font-semibold text-txt-primary ml-auto">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Analytiques;
