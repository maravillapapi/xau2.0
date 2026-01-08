import { Employee, MonthlyProduction, Alert, Expense, Activity, CalendarDay, Forecast, KpiData, Machine } from '../types';

// ========== PERIOD-BASED DATA ==========

// Production Data by Period
export const productionDataByPeriod = {
    hier: [
        { hour: '6h', value: 15, teamA: 8, teamB: 7 },
        { hour: '8h', value: 28, teamA: 15, teamB: 13 },
        { hour: '10h', value: 42, teamA: 22, teamB: 20 },
        { hour: '12h', value: 35, teamA: 18, teamB: 17 },
        { hour: '14h', value: 48, teamA: 25, teamB: 23 },
        { hour: '16h', value: 38, teamA: 20, teamB: 18 },
        { hour: '18h', value: 16, teamA: 8, teamB: 8 },
    ],
    semaine: [
        { day: 'Lun', value: 185, teamA: 95, teamB: 90 },
        { day: 'Mar', value: 210, teamA: 110, teamB: 100 },
        { day: 'Mer', value: 195, teamA: 100, teamB: 95 },
        { day: 'Jeu', value: 225, teamA: 115, teamB: 110 },
        { day: 'Ven', value: 240, teamA: 125, teamB: 115 },
        { day: 'Sam', value: 180, teamA: 90, teamB: 90 },
        { day: 'Dim', value: 0, teamA: 0, teamB: 0 },
    ],
    mois: [
        { month: 'Jan', value: 722, teamA: 350, teamB: 372 },
        { month: 'Fév', value: 1988, teamA: 980, teamB: 1008 },
        { month: 'Mar', value: 660, teamA: 320, teamB: 340 },
        { month: 'Avr', value: 1186, teamA: 600, teamB: 586 },
        { month: 'Mai', value: 1999, teamA: 1050, teamB: 949 },
        { month: 'Juin', value: 1453, teamA: 700, teamB: 753 },
        { month: 'Juil', value: 2274, teamA: 1100, teamB: 1174 },
        { month: 'Août', value: 2189, teamA: 1050, teamB: 1139 },
        { month: 'Sept', value: 2320, teamA: 1200, teamB: 1120 },
        { month: 'Oct', value: 2100, teamA: 1000, teamB: 1100 },
        { month: 'Nov', value: 2450, teamA: 1250, teamB: 1200 },
        { month: 'Déc', value: 3194, teamA: 1600, teamB: 1594 },
    ],
};

// Trends Data by Period
export const trendsDataByPeriod = {
    hier: [
        { label: '6h', value: 80 }, { label: '9h', value: 120 }, { label: '12h', value: 200 },
        { label: '15h', value: 150 }, { label: '18h', value: 90 },
    ],
    semaine: [
        { label: 'L', value: 320 }, { label: 'M', value: 480 }, { label: 'M', value: 420 },
        { label: 'J', value: 550 }, { label: 'V', value: 390 }, { label: 'S', value: 180 }, { label: 'D', value: 0 },
    ],
    mois: [
        { label: 'S1', value: 1200 }, { label: 'S2', value: 1450 }, { label: 'S3', value: 1320 }, { label: 'S4', value: 1580 },
    ],
};

// Legacy aliases
export const monthlyProduction = productionDataByPeriod.mois;
export const trendsData = trendsDataByPeriod.semaine;

// ========== EMPLOYEES ==========
export const employees: Employee[] = [
    { id: "emp-001", firstName: "Jean", lastName: "Kabongo", role: "chef_equipe", team: "A", status: "actif", phone: "+243 812 345 678", email: "j.kabongo@minedor.cd", hireDate: "2022-03-15", dailyRate: 45 },
    { id: "emp-002", firstName: "Marie", lastName: "Mutombo", role: "operateur", team: "A", status: "actif", phone: "+243 812 456 789", hireDate: "2023-01-10", dailyRate: 35 },
    { id: "emp-003", firstName: "Pierre", lastName: "Kasongo", role: "technicien", team: "B", status: "actif", phone: "+243 812 567 890", hireDate: "2023-06-22", dailyRate: 40 },
    { id: "emp-004", firstName: "André", lastName: "Mwamba", role: "conducteur", team: "B", status: "actif", phone: "+243 812 678 901", hireDate: "2024-02-01", dailyRate: 38 },
    { id: "emp-005", firstName: "Joseph", lastName: "Tshisekedi", role: "gardien", team: "A", status: "actif", phone: "+243 812 789 012", hireDate: "2022-11-05", dailyRate: 25 },
];

// ========== MACHINES ==========
export const machines: Machine[] = [
    { id: "mach-001", name: "Foreuse A", type: "foreuse", status: "operationnel", totalHours: 2450, lastMaintenanceDate: "2025-12-15", nextMaintenanceDate: "2026-02-15", location: "Secteur Nord" },
    { id: "mach-002", name: "Foreuse B", type: "foreuse", status: "maintenance", totalHours: 1890, lastMaintenanceDate: "2026-01-02", nextMaintenanceDate: "2026-03-02", location: "Secteur Sud" },
    { id: "mach-003", name: "Concasseur Principal", type: "concasseur", status: "operationnel", totalHours: 3200, lastMaintenanceDate: "2025-11-20", nextMaintenanceDate: "2026-01-20", location: "Zone Traitement" },
    { id: "mach-004", name: "Générateur 500kVA", type: "generateur", status: "operationnel", totalHours: 5600, lastMaintenanceDate: "2025-12-01", nextMaintenanceDate: "2026-02-01", location: "Base Camp" },
    { id: "mach-005", name: "Pompe Hydraulique", type: "pompe", status: "panne", totalHours: 890, lastMaintenanceDate: "2025-10-10", nextMaintenanceDate: "2026-01-10", location: "Puits 3" },
    { id: "mach-006", name: "Camion Benne", type: "vehicule", status: "operationnel", totalHours: 4200, lastMaintenanceDate: "2025-12-20", nextMaintenanceDate: "2026-03-20", location: "Transport" },
];

// ========== EXPENSES ==========
export const expenses: Expense[] = [
    { id: "exp-001", category: "carburant", amount: 450, description: "Diesel générateur principal", date: "2026-01-07", status: "approuve" },
    { id: "exp-002", category: "equipement", amount: 220, description: "Pièces détachées foreuse A", date: "2026-01-06", status: "approuve" },
    { id: "exp-003", category: "materiaux", amount: 180, description: "Explosifs extraction mine", date: "2026-01-05", status: "approuve" },
    { id: "exp-004", category: "transport", amount: 150, description: "Évacuation minerai Jan", date: "2026-01-04", status: "approuve" },
    { id: "exp-005", category: "autres", amount: 100, description: "Fournitures bureau site", date: "2026-01-03", status: "approuve" },
    { id: "exp-006", category: "carburant", amount: 380, description: "Diesel véhicules transport", date: "2026-01-02", status: "approuve" },
    { id: "exp-007", category: "salaires", amount: 2500, description: "Salaires équipe A - Janvier", date: "2026-01-01", status: "approuve" },
    { id: "exp-008", category: "salaires", amount: 2200, description: "Salaires équipe B - Janvier", date: "2026-01-01", status: "approuve" },
];

// ========== REPORTS ==========
export const reports = [
    { id: "rpt-001", name: "Rapport Production Janvier 2026", type: "production", date: "2026-01-07", author: "Jean Kabongo", status: "final" },
    { id: "rpt-002", name: "Rapport Financier Q4 2025", type: "financier", date: "2025-12-31", author: "Marie Mutombo", status: "final" },
    { id: "rpt-003", name: "Audit Équipements Décembre", type: "maintenance", date: "2025-12-20", author: "Pierre Kasongo", status: "final" },
    { id: "rpt-004", name: "Rapport Sécurité Mensuel", type: "securite", date: "2025-12-15", author: "André Mwamba", status: "final" },
];

// ========== PURCHASES ==========
export const purchases = [
    { id: "ach-001", item: "Diesel 2000L", supplier: "Total Congo", amount: 1800, date: "2026-01-05", status: "livre", category: "carburant" },
    { id: "ach-002", item: "Pièces Foreuse", supplier: "Caterpillar SAV", amount: 1250, date: "2026-01-03", status: "en_cours", category: "equipement" },
    { id: "ach-003", item: "Explosifs Mining", supplier: "Orica Mining", amount: 2200, date: "2026-01-02", status: "livre", category: "materiaux" },
];

// ========== ALERTS ==========
export const alerts: Alert[] = [
    { id: "alert-001", type: "carburant", severity: "warning", title: "Carburant & Énergie", description: "Stock critique (1200L). Approvisionnement nécessaire.", status: "ouverte", createdAt: "2026-01-05T08:00:00Z" },
    { id: "alert-002", type: "maintenance", severity: "info", title: "Équipement & Maintenance", description: "Révision foreuse à planifier pour jeudi.", status: "ouverte", createdAt: "2026-01-04T14:30:00Z" },
    { id: "alert-003", type: "transport", severity: "info", title: "Transport & Logistique", description: "Livraison équipement confirmée le 15 janvier.", status: "ouverte", createdAt: "2026-01-06T10:15:00Z" },
];

// ========== FORECASTS ==========
export const forecasts: Forecast[] = [
    { id: "forecast-production", metric: "Production (kg)", planned: 2.50, actual: 1.62, unit: "kg", variance: -35.2, status: "warning" },
    { id: "forecast-charges", metric: "Charges Totales ($)", planned: 4000, actual: 4400, unit: "$", variance: 10, status: "warning" },
    { id: "forecast-marge", metric: "Marge Brute ($)", planned: 8500, actual: 5200, unit: "$", variance: -38.8, status: "critical" },
    { id: "forecast-cout", metric: "Coût/kg ($)", planned: 1600, actual: 2716, unit: "$/kg", variance: 69.8, status: "critical" },
];

// ========== KPIs (Dynamic from data) ==========
export const getKpiData = (): KpiData[] => {
    const totalProduction = monthlyProduction.reduce((sum, m) => sum + m.value, 0);
    const weekProduction = productionDataByPeriod.semaine.reduce((sum, d) => sum + d.value, 0);

    return [
        { id: "kpi-production-month", label: "Production Totale (Mois)", value: `${(totalProduction / 1000).toFixed(1)} kg`, badge: "▲ 69%", badgeColor: "green", icon: "Coins", gradient: "from-amber-100 to-amber-200" },
        { id: "kpi-production-week", label: "Production Semaine", value: `${weekProduction} g`, badge: "▲ 10.9%", badgeColor: "green", icon: "Calendar", gradient: "from-pink-100 to-pink-200" },
        { id: "kpi-hours", label: "Heures Travaillées", value: "144h", badge: "▲ 19.9%", badgeColor: "green", icon: "Clock", gradient: "from-blue-100 to-blue-200" },
        { id: "kpi-incidents", label: "Incidents (Mois)", value: `${alerts.length}`, icon: "AlertTriangle", gradient: "from-red-100 to-red-200" },
    ];
};

export const kpiData = getKpiData();

// ========== EXPENSE CATEGORIES ==========
export const expenseCategories = [
    { name: "Carburant & Énergie", value: 450, color: "#3B82F6" },
    { name: "Équipement & Ma...", value: 220, color: "#8B5CF6" },
    { name: "Matériaux & Fourn...", value: 180, color: "#10B981" },
    { name: "Transport & Logist...", value: 150, color: "#F97316" },
    { name: "Autres Frais", value: 100, color: "#6B7280" },
];

// ========== MACHINE PERFORMANCE ==========
export const machinePerformance = [
    { name: "Machine A", hours: 80 },
    { name: "Machine B", hours: 64 },
];

// ========== CALENDAR DATA (with closed days) ==========
export const calendarData: (CalendarDay & { status?: 'open' | 'closed' })[] = [
    { date: "2026-01-01", value: 180, level: "moyen", status: "open" },
    { date: "2026-01-02", value: 250, level: "bon", status: "open" },
    { date: "2026-01-03", value: 320, level: "eleve", status: "open" },
    { date: "2026-01-04", value: 280, level: "bon", status: "open" },
    { date: "2026-01-05", value: 0, level: "faible", status: "closed" }, // Sunday
    { date: "2026-01-06", value: 75, level: "faible", status: "open" },
    { date: "2026-01-07", value: 222, level: "bon", status: "open" },
    { date: "2026-01-12", value: 0, level: "faible", status: "closed" }, // Sunday
    { date: "2026-01-19", value: 0, level: "faible", status: "closed" }, // Sunday
    { date: "2026-01-26", value: 0, level: "faible", status: "closed" }, // Sunday
];

// ========== GALLERY IMAGES ==========
export const galleryImages = [
    { id: 1, seed: 101, title: "Secteur Nord", description: "Zone d'extraction principale", date: "2026-01-05", author: "Jean K." },
    { id: 2, seed: 102, title: "Puits 3", description: "Foreuse en opération", date: "2026-01-04", author: "Marie M." },
    { id: 3, seed: 103, title: "Base Camp", description: "Vue aérienne du campement", date: "2026-01-03", author: "Pierre K." },
    { id: 4, seed: 104, title: "Zone Stockage", description: "Entrepôt de matériaux", date: "2026-01-02", author: "André M." },
];
