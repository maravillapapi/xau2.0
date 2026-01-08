import React from 'react';
import { KpiGrid } from '../components/kpi/KpiGrid';
import { ProductionAreaChart } from '../components/charts/ProductionAreaChart';
import { TeamBarChart } from '../components/charts/TeamBarChart';
import { ExpensesPieChart } from '../components/charts/ExpensesPieChart';
import { TrendAreaChart } from '../components/charts/TrendAreaChart';
import { MachinePerformanceChart } from '../components/charts/MachinePerformanceChart';
import { AlertList } from '../components/alerts/AlertList';
import { HeatmapCalendar } from '../components/calendar/HeatmapCalendar';
import { ForecastGrid } from '../components/forecast/ForecastGrid';
import { ActivityTimeline } from '../components/activity/ActivityTimeline';
import { GalleryGrid } from '../components/gallery/GalleryGrid';
import { ObjectiveCard, PurityCard } from '../components/dashboard/StatCards';

export const Dashboard: React.FC = () => {
    return (
        <div className="space-y-3">
            {/* Row 1: KPIs */}
            <KpiGrid />

            {/* Row 2: Main Bento Grid - Elastic & Mobile-First */}
            <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-3">
                {/* Left: Production Chart */}
                <div className="md:col-span-6 lg:col-span-5 min-h-[280px]">
                    <ProductionAreaChart />
                </div>

                {/* Center: Trends + Gauges */}
                <div className="md:col-span-3 lg:col-span-3 flex flex-col gap-3">
                    <TrendAreaChart />
                    <ObjectiveCard />
                    <div className="flex-1"><PurityCard /></div>
                </div>

                {/* Right: Expenses + Alerts */}
                <div className="md:col-span-3 lg:col-span-4 flex flex-col gap-3">
                    <ExpensesPieChart />
                    <div className="flex-1"><AlertList /></div>
                </div>
            </div>

            {/* Row 3: Team + Machines + Gallery + Activity */}
            <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-3">
                <div className="md:col-span-6 lg:col-span-5 min-h-[250px]">
                    <TeamBarChart />
                </div>

                <div className="md:col-span-3 lg:col-span-2 min-h-[200px]">
                    <MachinePerformanceChart />
                </div>

                <div className="md:col-span-3 lg:col-span-2">
                    <GalleryGrid />
                </div>

                <div className="md:col-span-6 lg:col-span-3">
                    <ActivityTimeline />
                </div>
            </div>

            {/* Row 4: Calendar + Forecasts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                <div className="lg:col-span-5">
                    <HeatmapCalendar />
                </div>
                <div className="lg:col-span-7">
                    <ForecastGrid />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
