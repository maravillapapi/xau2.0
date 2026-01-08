import React from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Card } from '../ui/Card';
import { useData } from '../../context/DataContext';

const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

// Production calendar data
const productionCalendar: Record<string, number> = {
    '2026-01-01': 180, '2026-01-02': 250, '2026-01-03': 320, '2026-01-04': 280,
    '2026-01-06': 75, '2026-01-07': 222, '2026-01-08': 190, '2026-01-09': 210,
    '2026-01-10': 245, '2026-01-11': 180,
};

const getColorForProduction = (value: number, isClosed: boolean): { bg: string; text: string } => {
    if (isClosed) return { bg: 'bg-slate-100', text: 'text-gray-900' };
    if (value >= 250) return { bg: 'bg-green-500', text: 'text-white' };
    if (value >= 150) return { bg: 'bg-orange-400', text: 'text-white' };
    if (value > 0) return { bg: 'bg-red-400', text: 'text-white' };
    return { bg: 'bg-red-300', text: 'text-white' };
};

export const HeatmapCalendar: React.FC = () => {
    const [currentMonth, setCurrentMonth] = React.useState(0);
    const [currentYear] = React.useState(2026);
    const { closedDays } = useData();
    const today = new Date(2026, 0, 7);

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const firstDayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const calendarDays: (number | null)[] = [];
    for (let i = 0; i < firstDayOffset; i++) calendarDays.push(null);
    for (let day = 1; day <= daysInMonth; day++) calendarDays.push(day);

    const getDateStr = (day: number) =>
        `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    return (
        <Card className="p-3 h-full flex flex-col">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-txt-primary truncate">Calendrier Production</h3>
                <div className="flex items-center gap-1">
                    <button onClick={() => setCurrentMonth(p => p > 0 ? p - 1 : 11)} className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100">
                        <ChevronLeft size={12} strokeWidth={1.5} className="text-txt-secondary" />
                    </button>
                    <span className="text-[10px] font-medium text-txt-primary min-w-[70px] text-center truncate">
                        {months[currentMonth]} {currentYear}
                    </span>
                    <button onClick={() => setCurrentMonth(p => p < 11 ? p + 1 : 0)} className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100">
                        <ChevronRight size={12} strokeWidth={1.5} className="text-txt-secondary" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-0.5 mb-1">
                {weekDays.map((day, i) => (
                    <div key={i} className="text-center text-[8px] text-txt-tertiary font-medium">{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5 flex-1">
                {calendarDays.map((day, i) => {
                    if (day === null) return <div key={i} className="aspect-square" />;

                    const dateStr = getDateStr(day);
                    const currentDate = new Date(currentYear, currentMonth, day);
                    const isFuture = currentDate > today;
                    const isToday = currentDate.toDateString() === today.toDateString();
                    const isClosed = closedDays.includes(dateStr);
                    const production = productionCalendar[dateStr] || 0;

                    let colorClass = { bg: 'bg-gray-200', text: 'text-txt-tertiary' };
                    if (!isFuture) {
                        colorClass = getColorForProduction(production, isClosed);
                    }

                    return (
                        <div
                            key={i}
                            className={`aspect-square rounded flex items-center justify-center text-[9px] font-medium ${colorClass.bg} ${colorClass.text} ${isToday ? 'ring-1 ring-accent-blue' : ''}`}
                            title={isClosed ? 'Non travaillé' : production ? `${production}g` : isFuture ? 'À venir' : 'N/A'}
                        >
                            {isClosed ? <X size={10} strokeWidth={2} className="text-gray-900" /> : day}
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-gray-100 flex-wrap">
                <div className="flex items-center gap-0.5"><div className="w-2 h-2 rounded-sm bg-red-400" /><span className="text-[7px] text-txt-tertiary">Faible</span></div>
                <div className="flex items-center gap-0.5"><div className="w-2 h-2 rounded-sm bg-orange-400" /><span className="text-[7px] text-txt-tertiary">Moyen</span></div>
                <div className="flex items-center gap-0.5"><div className="w-2 h-2 rounded-sm bg-green-500" /><span className="text-[7px] text-txt-tertiary">Élevé</span></div>
                <div className="flex items-center gap-0.5"><div className="w-2 h-2 rounded-sm bg-gray-200" /><span className="text-[7px] text-txt-tertiary">À venir</span></div>
                <div className="flex items-center gap-0.5"><X size={8} className="text-gray-900" /><span className="text-[7px] text-txt-tertiary">Fermé</span></div>
            </div>
        </Card>
    );
};

export default HeatmapCalendar;
