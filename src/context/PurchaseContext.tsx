import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { type PurchaseCategory, type OrderStatus } from '../constants/categories';

// Type pour un achat
export interface Purchase {
    id: string;
    item: string;
    supplier: string;
    category: PurchaseCategory;
    amount: number;
    date: string;
    status: OrderStatus;
}

// Données initiales
const initialPurchases: Purchase[] = [
    { id: 'ach-001', item: 'Diesel 2000L', supplier: 'Total Congo', amount: 1800, date: '2026-01-05', status: 'livre', category: 'carburant' },
    { id: 'ach-002', item: 'Pièces Foreuse', supplier: 'Caterpillar SAV', amount: 1250, date: '2026-01-03', status: 'en_cours', category: 'pieces' },
    { id: 'ach-003', item: 'Explosifs Mining', supplier: 'Orica Mining', amount: 2200, date: '2026-01-02', status: 'livre', category: 'materiaux' },
    { id: 'ach-004', item: 'Transport minerai', supplier: 'TransCongo SARL', amount: 850, date: '2026-01-06', status: 'en_cours', category: 'transport' },
    { id: 'ach-005', item: 'Génératrice 50kVA', supplier: 'CAT Power', amount: 15000, date: '2026-01-07', status: 'commande', category: 'equipement' },
];

interface PurchaseContextType {
    purchases: Purchase[];
    addPurchase: (purchase: Omit<Purchase, 'id'>) => void;
    updatePurchaseStatus: (id: string, status: OrderStatus) => void;
    deletePurchase: (id: string) => void;
    getTotalAmount: () => number;
    getByStatus: (status: OrderStatus) => Purchase[];
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

export const PurchaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);

    const addPurchase = useCallback((purchase: Omit<Purchase, 'id'>) => {
        const newPurchase: Purchase = {
            ...purchase,
            id: `ach-${Date.now()}`,
        };
        setPurchases(prev => [newPurchase, ...prev]);
    }, []);

    const updatePurchaseStatus = useCallback((id: string, status: OrderStatus) => {
        setPurchases(prev =>
            prev.map(p => p.id === id ? { ...p, status } : p)
        );
    }, []);

    const deletePurchase = useCallback((id: string) => {
        setPurchases(prev => prev.filter(p => p.id !== id));
    }, []);

    const getTotalAmount = useCallback(() => {
        return purchases.reduce((sum, p) => sum + p.amount, 0);
    }, [purchases]);

    const getByStatus = useCallback((status: OrderStatus) => {
        return purchases.filter(p => p.status === status);
    }, [purchases]);

    return (
        <PurchaseContext.Provider value={{
            purchases,
            addPurchase,
            updatePurchaseStatus,
            deletePurchase,
            getTotalAmount,
            getByStatus,
        }}>
            {children}
        </PurchaseContext.Provider>
    );
};

export const usePurchases = () => {
    const context = useContext(PurchaseContext);
    if (!context) throw new Error('usePurchases must be used within PurchaseProvider');
    return context;
};
