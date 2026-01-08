import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '../ui/Card';
import { useData } from '../../context/DataContext';

const expenseCategories = [
    { name: "Carburant & Énergie", value: 450, color: "#3B82F6" },
    { name: "Équipement & Ma...", value: 220, color: "#8B5CF6" },
    { name: "Matériaux & Fourn...", value: 180, color: "#10B981" },
    { name: "Transport & Logist...", value: 150, color: "#F97316" },
    { name: "Autres Frais", value: 100, color: "#6B7280" },
];

export const ExpensesPieChart: React.FC = () => {
    const total = expenseCategories.reduce((sum, cat) => sum + cat.value, 0);

    return (
        <Card className="p-3 flex flex-col">
            <h3 className="text-xs font-semibold text-txt-primary mb-2 truncate">Dépenses Opérationnelles</h3>
            <div className="flex items-center gap-3 flex-1 min-h-0">
                <div className="w-20 h-20 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={expenseCategories} innerRadius={22} outerRadius={35} paddingAngle={2} dataKey="value">
                                {expenseCategories.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                            </Pie>
                            <Tooltip formatter={(value: number) => [`$${value}`, '']} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-1 min-w-0">
                    {expenseCategories.map((cat) => (
                        <div key={cat.name} className="flex items-center justify-between text-[9px]">
                            <div className="flex items-center gap-1 min-w-0">
                                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                                <span className="text-txt-secondary truncate">{cat.name}</span>
                            </div>
                            <span className="font-medium text-txt-primary flex-shrink-0">${cat.value}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                <span className="text-[10px] text-txt-secondary">Total</span>
                <span className="text-sm font-bold text-txt-primary">${total.toLocaleString()}</span>
            </div>
        </Card>
    );
};

export default ExpensesPieChart;
