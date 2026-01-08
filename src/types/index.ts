// Employee (Travailleur)
export interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    role: 'chef_equipe' | 'operateur' | 'technicien' | 'conducteur' | 'gardien';
    team: 'A' | 'B';
    status: 'actif' | 'conge' | 'absent';
    phone: string;
    email?: string;
    avatar?: string;
    hireDate: string;
    dailyRate: number;
}

// Production Entry
export interface ProductionEntry {
    id: string;
    date: string;
    team: 'A' | 'B';
    shift: 'matin' | 'jour' | 'soir';
    quantity: number;
    purity: number;
    operatorId: string;
    machineId?: string;
    notes?: string;
    status: 'brouillon' | 'valide' | 'annule';
    createdAt: string;
    updatedAt: string;
}

// Alert
export interface Alert {
    id: string;
    type: 'carburant' | 'maintenance' | 'transport' | 'securite' | 'personnel';
    severity: 'info' | 'warning' | 'critical';
    title: string;
    description: string;
    actionRequired?: string;
    dueDate?: string;
    status: 'ouverte' | 'en_cours' | 'resolue';
    createdAt: string;
    resolvedAt?: string;
}

// Time Entry (Pointage)
export interface TimeEntry {
    id: string;
    employeeId: string;
    date: string;
    arrivalTime?: string;
    departureTime?: string;
    status: 'present' | 'retard' | 'absent' | 'conge';
    notes?: string;
}

// Expense (Dépense)
export interface Expense {
    id: string;
    category: 'carburant' | 'equipement' | 'materiaux' | 'transport' | 'salaires' | 'autres';
    amount: number;
    description: string;
    date: string;
    supplierId?: string;
    receipt?: string;
    status: 'en_attente' | 'approuve' | 'rejete';
}

// Gallery Image
export interface GalleryImage {
    id: string;
    url: string;
    thumbnail: string;
    title: string;
    description?: string;
    location: string;
    capturedAt: string;
    uploadedBy: string;
    tags: string[];
}

// Machine
export interface Machine {
    id: string;
    name: string;
    type: 'foreuse' | 'concasseur' | 'generateur' | 'pompe' | 'vehicule';
    status: 'operationnel' | 'maintenance' | 'panne';
    totalHours: number;
    lastMaintenanceDate: string;
    nextMaintenanceDate: string;
    location: string;
}

// Monthly Production
export interface MonthlyProduction {
    month: string;
    value: number;
    teamA: number;
    teamB: number;
}

// Activity
export interface Activity {
    id: string;
    type: 'production' | 'pointage' | 'maintenance' | 'objectif';
    title: string;
    description: string;
    timestamp: string;
    icon: string;
    color: 'green' | 'blue' | 'orange' | 'purple' | 'red';
}

// Calendar Data
export interface CalendarDay {
    date: string;
    value: number;
    level: 'faible' | 'moyen' | 'bon' | 'eleve';
}

// Forecast
export interface Forecast {
    id: string;
    metric: string;
    planned: number;
    actual: number;
    unit: string;
    variance: number;
    status: 'success' | 'warning' | 'critical';
}

// Navigation Item
export interface NavItem {
    path: string;
    label: string;
    icon: string;
    section: 'principal' | 'operationnel' | 'gestion' | 'finances' | 'administration';
}

// KPI Data
export interface KpiData {
    id: string;
    label: string;
    value: string | number;
    badge?: string;
    badgeColor?: 'green' | 'red' | 'orange';
    icon: string;
    gradient: string;
    subLabel?: string;
}
