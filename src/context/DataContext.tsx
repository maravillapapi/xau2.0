import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { Employee, Machine, Expense, Alert, Forecast } from '../types';

// Re-export Expense type for convenience
export type { Expense } from '../types';

// ========== PRODUCTION DATA GENERATORS ==========

// Jours de la semaine
const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

// Mois de l'année
const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

// Génère un nombre aléatoire dans une plage
const randomInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Génère les données de production pour la semaine (7 jours)
const generateWeekData = () => {
    return weekDays.map((day, index) => {
        // Dimanche = moins de production
        const baseValue = index === 6 ? 0 : randomInRange(150, 280);
        const teamA = index === 6 ? 0 : Math.floor(baseValue * 0.52);
        const teamB = baseValue - teamA;
        return { label: day, fullLabel: day, value: baseValue, teamA, teamB };
    });
};

// Génère les données de production pour le mois (nombre réel de jours)
const generateMonthData = () => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const data = [];

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(now.getFullYear(), now.getMonth(), day);
        const dayOfWeek = date.getDay();
        // Dimanche (0) = pas de production
        const baseValue = dayOfWeek === 0 ? 0 : randomInRange(180, 320);
        const teamA = dayOfWeek === 0 ? 0 : Math.floor(baseValue * 0.52);
        const teamB = baseValue - teamA;

        data.push({
            label: String(day),
            fullLabel: `${day} ${monthNames[now.getMonth()]}`,
            value: baseValue,
            teamA,
            teamB
        });
    }
    return data;
};

// Génère les données de production pour l'année (12 mois)
const generateYearData = () => {
    return monthNames.map((month) => {
        const baseValue = randomInRange(4000, 8000);
        const teamA = Math.floor(baseValue * 0.52);
        const teamB = baseValue - teamA;
        return { label: month, fullLabel: month + ' 2026', value: baseValue, teamA, teamB };
    });
};

// Données hier (heures de la journée)
const generateYesterdayData = () => {
    const hours = ['6h', '8h', '10h', '12h', '14h', '16h', '18h'];
    return hours.map((hour) => {
        const baseValue = randomInRange(15, 55);
        const teamA = Math.floor(baseValue * 0.52);
        const teamB = baseValue - teamA;
        return { label: hour, fullLabel: hour, value: baseValue, teamA, teamB };
    });
};

// Cache des données générées (pour éviter de regénérer à chaque render)
let cachedProductionData: {
    hier: ReturnType<typeof generateYesterdayData>;
    semaine: ReturnType<typeof generateWeekData>;
    mois: ReturnType<typeof generateMonthData>;
    annee: ReturnType<typeof generateYearData>;
} | null = null;

const getProductionData = () => {
    if (!cachedProductionData) {
        cachedProductionData = {
            hier: generateYesterdayData(),
            semaine: generateWeekData(),
            mois: generateMonthData(),
            annee: generateYearData(),
        };
    }
    return cachedProductionData;
};


const initialMachines: Machine[] = [
    { id: "mach-001", name: "Foreuse A", type: "foreuse", status: "operationnel", totalHours: 2450, lastMaintenanceDate: "2025-12-15", nextMaintenanceDate: "2026-02-15", location: "Secteur Nord" },
    { id: "mach-002", name: "Foreuse B", type: "foreuse", status: "maintenance", totalHours: 1890, lastMaintenanceDate: "2026-01-02", nextMaintenanceDate: "2026-03-02", location: "Secteur Sud" },
    { id: "mach-003", name: "Concasseur", type: "concasseur", status: "operationnel", totalHours: 3200, lastMaintenanceDate: "2025-11-20", nextMaintenanceDate: "2026-01-20", location: "Zone Traitement" },
    { id: "mach-004", name: "Générateur", type: "generateur", status: "operationnel", totalHours: 5600, lastMaintenanceDate: "2025-12-01", nextMaintenanceDate: "2026-02-01", location: "Base Camp" },
    { id: "mach-005", name: "Pompe", type: "pompe", status: "panne", totalHours: 890, lastMaintenanceDate: "2025-10-10", nextMaintenanceDate: "2026-01-10", location: "Puits 3" },
    { id: "mach-006", name: "Camion", type: "vehicule", status: "operationnel", totalHours: 4200, lastMaintenanceDate: "2025-12-20", nextMaintenanceDate: "2026-03-20", location: "Transport" },
];

const initialEmployees: Employee[] = [
    { id: "emp-001", firstName: "Jean", lastName: "Kabongo", role: "chef_equipe", team: "A", status: "actif", phone: "+243 812 345 678", email: "j.kabongo@minedor.cd", hireDate: "2022-03-15", dailyRate: 45 },
    { id: "emp-002", firstName: "Marie", lastName: "Mutombo", role: "operateur", team: "A", status: "actif", phone: "+243 812 456 789", hireDate: "2023-01-10", dailyRate: 35 },
    { id: "emp-003", firstName: "Pierre", lastName: "Kasongo", role: "technicien", team: "B", status: "actif", phone: "+243 812 567 890", hireDate: "2023-06-22", dailyRate: 40 },
    { id: "emp-004", firstName: "André", lastName: "Mwamba", role: "conducteur", team: "B", status: "actif", phone: "+243 812 678 901", hireDate: "2024-02-01", dailyRate: 38 },
];

const initialExpenses: Expense[] = [
    { id: "exp-001", category: "carburant", amount: 450, description: "Diesel générateur principal", date: "2026-01-07", status: "approuve" },
    { id: "exp-002", category: "equipement", amount: 220, description: "Pièces détachées foreuse A", date: "2026-01-06", status: "approuve" },
    { id: "exp-003", category: "materiaux", amount: 180, description: "Explosifs extraction mine", date: "2026-01-05", status: "approuve" },
    { id: "exp-004", category: "transport", amount: 150, description: "Évacuation minerai Jan", date: "2026-01-04", status: "approuve" },
];

const initialAlerts: Alert[] = [
    { id: "alert-001", type: "carburant", severity: "warning", title: "Carburant & Énergie", description: "Stock critique (1200L)", status: "ouverte", createdAt: "2026-01-05T08:00:00Z" },
    { id: "alert-002", type: "maintenance", severity: "info", title: "Équipement", description: "Révision foreuse à planifier", status: "ouverte", createdAt: "2026-01-04T14:30:00Z" },
];

const initialForecasts: Forecast[] = [
    { id: "forecast-production", metric: "Production (kg)", planned: 2.50, actual: 1.62, unit: "kg", variance: -35.2, status: "warning" },
    { id: "forecast-charges", metric: "Charges ($)", planned: 4000, actual: 4400, unit: "$", variance: 10, status: "warning" },
    { id: "forecast-marge", metric: "Marge ($)", planned: 8500, actual: 5200, unit: "$", variance: -38.8, status: "critical" },
    { id: "forecast-cout", metric: "Coût/kg ($)", planned: 1600, actual: 2716, unit: "$/kg", variance: 69.8, status: "critical" },
];

// Closed days (Sundays)
const initialClosedDays = ['2026-01-05', '2026-01-12', '2026-01-19', '2026-01-26'];

export type TimeRange = 'hier' | 'semaine' | 'mois' | 'annee';

interface DataContextType {
    // Production
    productionData: ReturnType<typeof getProductionData>;
    getProductionByPeriod: (period: TimeRange) => ReturnType<typeof getProductionData>['mois'];

    // Entities
    machines: Machine[];
    employees: Employee[];
    expenses: Expense[];
    alerts: Alert[];
    forecasts: Forecast[];
    closedDays: string[];

    // Mutations
    addExpense: (expense: Omit<Expense, 'id'>) => void;
    updateExpenseStatus: (id: string, status: Expense['status']) => void;
    deleteExpense: (id: string) => void;
    addEmployee: (employee: Omit<Employee, 'id'>) => void;
    toggleClosedDay: (date: string) => void;

    // KPIs
    getKpiValue: (type: 'production' | 'hours' | 'incidents', period: TimeRange) => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [productionData] = useState(getProductionData());
    const [machines] = useState(initialMachines);
    const [employees, setEmployees] = useState(initialEmployees);
    const [expenses, setExpenses] = useState(initialExpenses);
    const [alerts] = useState(initialAlerts);
    const [forecasts] = useState(initialForecasts);
    const [closedDays, setClosedDays] = useState(initialClosedDays);

    const getProductionByPeriod = useCallback((period: TimeRange) => {
        return productionData[period] || productionData.mois;
    }, [productionData]);

    const addExpense = useCallback((expense: Omit<Expense, 'id'>) => {
        const newExpense = { ...expense, id: `exp-${Date.now()}` } as Expense;
        setExpenses(prev => [newExpense, ...prev]);
    }, []);

    const updateExpenseStatus = useCallback((id: string, status: Expense['status']) => {
        setExpenses(prev => prev.map(exp =>
            exp.id === id ? { ...exp, status } : exp
        ));
    }, []);

    const deleteExpense = useCallback((id: string) => {
        setExpenses(prev => prev.filter(exp => exp.id !== id));
    }, []);

    const addEmployee = useCallback((employee: Omit<Employee, 'id'>) => {
        const newEmployee = { ...employee, id: `emp-${Date.now()}` } as Employee;
        setEmployees(prev => [newEmployee, ...prev]);
    }, []);

    const toggleClosedDay = useCallback((date: string) => {
        setClosedDays(prev =>
            prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
        );
    }, []);

    const getKpiValue = useCallback((type: 'production' | 'hours' | 'incidents', period: TimeRange): string => {
        const data = productionData[period];
        const total = data.reduce((sum: number, d: { value: number }) => sum + d.value, 0);

        if (type === 'production') {
            return total >= 1000 ? `${(total / 1000).toFixed(1)} kg` : `${total} g`;
        }
        if (type === 'hours') {
            return period === 'hier' ? '12h' : period === 'semaine' ? '84h' : period === 'mois' ? '144h' : '1728h';
        }
        return `${alerts.length}`;
    }, [productionData, alerts]);

    return (
        <DataContext.Provider value={{
            productionData,
            getProductionByPeriod,
            machines,
            employees,
            expenses,
            alerts,
            forecasts,
            closedDays,
            addExpense,
            updateExpenseStatus,
            deleteExpense,
            addEmployee,
            toggleClosedDay,
            getKpiValue,
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error('useData must be used within DataProvider');
    return context;
};
