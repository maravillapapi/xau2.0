import React, { useState } from 'react';
import { Plus, Wallet, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input, Select } from '../components/ui/Input';
import { StatusBadge, StatusDot, type StatusType } from '../components/ui/StatusDot';
import { useData, type Expense } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { PERSONNEL_CATEGORIES, getCategoryColor, getCategoryLabel } from '../constants/categories';

type ExpenseStatus = 'en_attente' | 'approuve' | 'rejete';

const statusLabels: Record<ExpenseStatus, string> = {
    approuve: 'Approuvé',
    en_attente: 'En attente',
    rejete: 'Rejeté'
};

// Status button config (for modal)
const statusButtons: { value: ExpenseStatus; label: string; bgActive: string; borderActive: string }[] = [
    { value: 'en_attente', label: 'En attente', bgActive: 'bg-amber-50', borderActive: 'border-amber-500' },
    { value: 'approuve', label: 'Validé', bgActive: 'bg-green-50', borderActive: 'border-green-500' },
    { value: 'rejete', label: 'Rejeté', bgActive: 'bg-red-50', borderActive: 'border-red-500' },
];

export const Depenses: React.FC = () => {
    const { expenses, addExpense, updateExpenseStatus, deleteExpense } = useData();
    const { showToast } = useToast();
    const { canEdit, canDelete } = useAuth();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
    const [newStatus, setNewStatus] = useState<ExpenseStatus>('en_attente');

    // Form state
    const [formData, setFormData] = useState({
        description: '',
        category: 'salaires',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        status: 'en_attente' as ExpenseStatus,
    });

    // Filter only personnel expenses
    const personnelExpenses = expenses.filter(e =>
        PERSONNEL_CATEGORIES.some(c => c.value === e.category)
    );

    const totalMois = personnelExpenses.reduce((sum, e) => sum + e.amount, 0);
    const approuvees = personnelExpenses.filter(e => e.status === 'approuve').length;
    const enAttente = personnelExpenses.filter(e => e.status === 'en_attente').length;

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (!formData.description.trim() || !formData.amount) {
            showToast('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }

        const amount = parseFloat(formData.amount);
        if (isNaN(amount) || amount <= 0) {
            showToast('Montant invalide', 'error');
            return;
        }

        addExpense({
            description: formData.description.trim(),
            category: formData.category as any,
            amount,
            date: formData.date,
            status: formData.status,
        });

        showToast(`Dépense RH enregistrée : $${amount.toLocaleString()}`, 'success');

        setFormData({
            description: '',
            category: 'salaires',
            amount: '',
            date: new Date().toISOString().split('T')[0],
            status: 'en_attente',
        });
        setIsModalOpen(false);
    };

    const handleRowClick = (expense: Expense) => {
        setSelectedExpense(expense);
        setNewStatus(expense.status as ExpenseStatus);
        setIsDetailModalOpen(true);
    };

    const handleStatusUpdate = () => {
        if (selectedExpense && canEdit()) {
            updateExpenseStatus(selectedExpense.id, newStatus);
            showToast(`Statut mis à jour : ${statusLabels[newStatus]}`, 'success');
            setIsDetailModalOpen(false);
            setSelectedExpense(null);
        }
    };

    const handleDelete = () => {
        if (selectedExpense && canDelete()) {
            deleteExpense(selectedExpense.id);
            showToast('Dépense supprimée', 'success');
            setIsDetailModalOpen(false);
            setSelectedExpense(null);
        }
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <h1 className="text-xl font-bold text-txt-primary break-words">Dépenses Personnel</h1>
                    <p className="text-sm text-txt-secondary">Suivi des charges RH et salaires</p>
                </div>
                <Button variant="primary" size="sm" icon={<Plus size={16} strokeWidth={1.5} />} onClick={() => setIsModalOpen(true)}>
                    Nouvelle dépense
                </Button>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="p-4 text-center">
                    <p className="text-xs text-txt-secondary mb-1">Total Mois</p>
                    <p className="text-2xl font-bold text-txt-primary">${totalMois.toLocaleString()}</p>
                </Card>
                <Card className="p-4 text-center">
                    <p className="text-xs text-txt-secondary mb-1">vs Mois Préc.</p>
                    <p className="text-2xl font-bold text-accent-red">+12%</p>
                </Card>
                <Card className="p-4 text-center">
                    <p className="text-xs text-txt-secondary mb-1">Approuvées</p>
                    <p className="text-2xl font-bold text-accent-green">{approuvees}</p>
                </Card>
                <Card className="p-4 text-center">
                    <p className="text-xs text-txt-secondary mb-1">En attente</p>
                    <p className="text-2xl font-bold text-accent-orange">{enAttente}</p>
                </Card>
            </div>

            {/* Table */}
            <Card className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-txt-secondary uppercase">Date</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-txt-secondary uppercase">Catégorie</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-txt-secondary uppercase">Motif</th>
                                <th className="text-right py-3 px-4 text-xs font-semibold text-txt-secondary uppercase">Montant</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-txt-secondary uppercase">Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {personnelExpenses.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-txt-tertiary">
                                        <Wallet size={32} className="mx-auto mb-2 opacity-50" />
                                        <p>Aucune dépense personnel enregistrée</p>
                                    </td>
                                </tr>
                            ) : (
                                personnelExpenses.map((exp) => (
                                    <tr
                                        key={exp.id}
                                        className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => handleRowClick(exp)}
                                    >
                                        <td className="py-3 px-4 text-sm text-txt-secondary">{exp.date}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${getCategoryColor(exp.category)}`}>
                                                {getCategoryLabel(exp.category)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-txt-primary">{exp.description}</td>
                                        <td className="py-3 px-4 text-sm font-bold text-txt-primary text-right">${exp.amount.toLocaleString()}</td>
                                        <td className="py-3 px-4">
                                            <StatusBadge status={exp.status as StatusType} label={statusLabels[exp.status as ExpenseStatus]} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Modal - Nouvelle Dépense Personnel */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouvelle dépense RH">
                <div className="p-6 space-y-4">
                    <Input
                        label="Date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                    />
                    <Select
                        label="Catégorie RH"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        options={PERSONNEL_CATEGORIES.map(c => ({ value: c.value, label: c.label }))}
                    />
                    <Input
                        label="Motif de la dépense"
                        placeholder="Ex: Prime de risque équipe A - Janvier"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                    <Input
                        label="Montant ($)"
                        type="number"
                        placeholder="0"
                        value={formData.amount}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                    />
                </div>
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                    <Button variant="secondary" fullWidth onClick={() => setIsModalOpen(false)}>Annuler</Button>
                    <Button variant="primary" fullWidth onClick={handleSubmit}>Enregistrer</Button>
                </div>
            </Modal>

            {/* Modal - Détails & Validation */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => { setIsDetailModalOpen(false); setSelectedExpense(null); }}
                title="Détails & Validation"
            >
                {selectedExpense && (
                    <>
                        <div className="p-6 space-y-4">
                            {/* Infos de la dépense */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-txt-tertiary mb-1">Date</p>
                                    <p className="text-sm font-medium text-txt-primary">{selectedExpense.date}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-txt-tertiary mb-1">Montant</p>
                                    <p className="text-lg font-bold text-txt-primary">${selectedExpense.amount.toLocaleString()}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-txt-tertiary mb-1">Motif</p>
                                <p className="text-sm font-medium text-txt-primary">{selectedExpense.description}</p>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-xs text-txt-tertiary mb-1">Catégorie</p>
                                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(selectedExpense.category)}`}>
                                    {getCategoryLabel(selectedExpense.category)}
                                </span>
                            </div>

                            {/* Sélecteur de statut - visible uniquement si canEdit */}
                            {canEdit() ? (
                                <div className="border-t border-gray-100 pt-4">
                                    <label className="block text-sm font-medium text-txt-primary mb-3">
                                        Modifier le statut
                                    </label>
                                    <div className="flex gap-3">
                                        {statusButtons.map((status) => {
                                            const isActive = newStatus === status.value;
                                            return (
                                                <button
                                                    key={status.value}
                                                    onClick={() => setNewStatus(status.value)}
                                                    className={`
                                                        flex-1 py-4 px-3 rounded-xl border-2 transition-all
                                                        flex flex-col items-center gap-2
                                                        ${isActive
                                                            ? `${status.bgActive} ${status.borderActive}`
                                                            : 'bg-white border-gray-200 hover:border-gray-300'
                                                        }
                                                    `}
                                                >
                                                    <StatusDot status={status.value} size="lg" />
                                                    <span className={`text-sm font-medium ${isActive ? 'text-txt-primary' : 'text-txt-secondary'}`}>
                                                        {status.label}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="border-t border-gray-100 pt-4">
                                    <p className="text-xs text-txt-tertiary mb-1">Statut actuel</p>
                                    <StatusBadge status={selectedExpense.status as StatusType} label={statusLabels[selectedExpense.status as ExpenseStatus]} />
                                    <p className="text-xs text-txt-tertiary mt-2 italic">
                                        Seuls les administrateurs peuvent valider ou rejeter.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                            {canDelete() && (
                                <Button
                                    variant="secondary"
                                    onClick={handleDelete}
                                    icon={<Trash2 size={16} />}
                                    className="!text-red-500 !border-red-200 hover:!bg-red-50"
                                >
                                    Supprimer
                                </Button>
                            )}
                            <div className="flex-1" />
                            <Button variant="secondary" onClick={() => { setIsDetailModalOpen(false); setSelectedExpense(null); }}>
                                Fermer
                            </Button>
                            {canEdit() && (
                                <Button variant="primary" onClick={handleStatusUpdate}>
                                    Sauvegarder
                                </Button>
                            )}
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default Depenses;
