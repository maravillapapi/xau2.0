// ==========================
// CATÉGORIES ACHATS (Supply Chain)
// ==========================
export const PURCHASE_CATEGORIES = [
    { value: 'carburant', label: 'Carburant & Énergie', color: 'bg-blue-100 text-blue-700' },
    { value: 'pieces', label: 'Pièces & Maintenance', color: 'bg-purple-100 text-purple-700' },
    { value: 'materiaux', label: 'Matériaux & Fournitures', color: 'bg-green-100 text-green-700' },
    { value: 'transport', label: 'Transport & Logistique', color: 'bg-orange-100 text-orange-700' },
    { value: 'equipement', label: 'Équipement Lourd', color: 'bg-red-100 text-red-700' },
] as const;

export type PurchaseCategory = typeof PURCHASE_CATEGORIES[number]['value'];

// ==========================
// CATÉGORIES PERSONNEL (RH)
// ==========================
export const PERSONNEL_CATEGORIES = [
    { value: 'salaires', label: 'Salaires & Paie', color: 'bg-emerald-100 text-emerald-700' },
    { value: 'primes', label: 'Primes de risque', color: 'bg-amber-100 text-amber-700' },
    { value: 'restauration', label: 'Restauration & Cantine', color: 'bg-pink-100 text-pink-700' },
    { value: 'medical', label: 'Soins Médicaux', color: 'bg-cyan-100 text-cyan-700' },
    { value: 'formation', label: 'Formation', color: 'bg-indigo-100 text-indigo-700' },
] as const;

export type PersonnelCategory = typeof PERSONNEL_CATEGORIES[number]['value'];

// ==========================
// TOUTES LES CATÉGORIES (union)
// ==========================
export type ExpenseCategory = PurchaseCategory | PersonnelCategory;

// Helper pour obtenir le label d'une catégorie
export const getCategoryLabel = (value: string): string => {
    const all = [...PURCHASE_CATEGORIES, ...PERSONNEL_CATEGORIES];
    return all.find(c => c.value === value)?.label || value;
};

// Helper pour obtenir la couleur d'une catégorie
export const getCategoryColor = (value: string): string => {
    const all = [...PURCHASE_CATEGORIES, ...PERSONNEL_CATEGORIES];
    return all.find(c => c.value === value)?.color || 'bg-gray-100 text-gray-700';
};

// ==========================
// STATUTS COMMANDES
// ==========================
export const ORDER_STATUS = [
    { value: 'commande', label: 'Commandé', color: 'info' },
    { value: 'en_cours', label: 'En cours', color: 'warning' },
    { value: 'livre', label: 'Livré', color: 'success' },
] as const;

export type OrderStatus = typeof ORDER_STATUS[number]['value'];
