import React, { useState } from 'react';
import { Plus, Search, ShoppingCart, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input, Select } from '../components/ui/Input';
import { StatusBadge, StatusDot, type StatusType } from '../components/ui/StatusDot';
import { usePurchases, type Purchase } from '../context/PurchaseContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { PURCHASE_CATEGORIES, getCategoryColor, getCategoryLabel, ORDER_STATUS, type OrderStatus } from '../constants/categories';

const statusLabels: Record<OrderStatus, string> = {
    livre: 'Livré',
    en_cours: 'En cours',
    commande: 'Commandé',
};

export const Achats: React.FC = () => {
    const { purchases, addPurchase, updatePurchaseStatus, deletePurchase, getTotalAmount, getByStatus } = usePurchases();
    const { showToast } = useToast();
    const { canEdit, canDelete } = useAuth();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
    const [newStatus, setNewStatus] = useState<OrderStatus>('commande');

    // Form state
    const [formData, setFormData] = useState({
        item: '',
        supplier: '',
        category: 'carburant',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        status: 'commande' as const,
    });

    const totalAchats = getTotalAmount();
    const livres = getByStatus('livre').length;
    const enCours = getByStatus('en_cours').length;

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (!formData.item.trim() || !formData.supplier.trim() || !formData.amount) {
            showToast('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }

        const amount = parseFloat(formData.amount);
        if (isNaN(amount) || amount <= 0) {
            showToast('Montant invalide', 'error');
            return;
        }

        addPurchase({
            item: formData.item.trim(),
            supplier: formData.supplier.trim(),
            category: formData.category as any,
            amount,
            date: formData.date,
            status: formData.status,
        });

        showToast(`Achat enregistré : $${amount.toLocaleString()}`, 'success');

        setFormData({
            item: '',
            supplier: '',
            category: 'carburant',
            amount: '',
            date: new Date().toISOString().split('T')[0],
            status: 'commande',
        });
        setIsModalOpen(false);
    };

    const handleRowClick = (purchase: Purchase) => {
        setSelectedPurchase(purchase);
        setNewStatus(purchase.status);
        setIsDetailModalOpen(true);
    };

    const handleStatusUpdate = () => {
        if (selectedPurchase && canEdit()) {
            updatePurchaseStatus(selectedPurchase.id, newStatus);
            showToast(`Statut mis à jour : ${statusLabels[newStatus]}`, 'success');
            setIsDetailModalOpen(false);
            setSelectedPurchase(null);
        }
    };

    const handleDelete = () => {
        if (selectedPurchase && canDelete()) {
            deletePurchase(selectedPurchase.id);
            showToast('Achat supprimé', 'success');
            setIsDetailModalOpen(false);
            setSelectedPurchase(null);
        }
    };

    // Status button config (for modal)
    const statusButtons: { value: OrderStatus; label: string; bgActive: string; borderActive: string }[] = [
        { value: 'commande', label: 'Commandé', bgActive: 'bg-blue-50', borderActive: 'border-blue-500' },
        { value: 'en_cours', label: 'En cours', bgActive: 'bg-amber-50', borderActive: 'border-amber-500' },
        { value: 'livre', label: 'Livré', bgActive: 'bg-green-50', borderActive: 'border-green-500' },
    ];

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <h1 className="text-xl font-bold text-txt-primary break-words">Achats</h1>
                    <p className="text-sm text-txt-secondary">Gestion des commandes et fournisseurs</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                    <Button variant="secondary" size="sm" icon={<Search size={16} strokeWidth={1.5} />}>
                        Rechercher
                    </Button>
                    <Button variant="primary" size="sm" icon={<Plus size={16} strokeWidth={1.5} />} onClick={() => setIsModalOpen(true)}>
                        Nouvel achat
                    </Button>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="p-4 text-center">
                    <p className="text-xs text-txt-secondary mb-1">Total Achats</p>
                    <p className="text-2xl font-bold text-txt-primary">${totalAchats.toLocaleString()}</p>
                </Card>
                <Card className="p-4 text-center">
                    <p className="text-xs text-txt-secondary mb-1">Commandes</p>
                    <p className="text-2xl font-bold text-txt-primary">{purchases.length}</p>
                </Card>
                <Card className="p-4 text-center">
                    <p className="text-xs text-txt-secondary mb-1">Livrées</p>
                    <p className="text-2xl font-bold text-accent-green">{livres}</p>
                </Card>
                <Card className="p-4 text-center">
                    <p className="text-xs text-txt-secondary mb-1">En cours</p>
                    <p className="text-2xl font-bold text-accent-orange">{enCours}</p>
                </Card>
            </div>

            {/* Table */}
            <Card className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-txt-secondary uppercase">Désignation</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-txt-secondary uppercase">Fournisseur</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-txt-secondary uppercase">Catégorie</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-txt-secondary uppercase">Date</th>
                                <th className="text-right py-3 px-4 text-xs font-semibold text-txt-secondary uppercase">Montant</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-txt-secondary uppercase">Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchases.map((purchase) => (
                                <tr
                                    key={purchase.id}
                                    className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => handleRowClick(purchase)}
                                >
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <ShoppingCart size={14} strokeWidth={1.5} className="text-txt-secondary" />
                                            </div>
                                            <span className="text-sm font-medium text-txt-primary">{purchase.item}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-txt-secondary">{purchase.supplier}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${getCategoryColor(purchase.category)}`}>
                                            {getCategoryLabel(purchase.category)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-txt-secondary">{purchase.date}</td>
                                    <td className="py-3 px-4 text-sm font-bold text-txt-primary text-right">${purchase.amount.toLocaleString()}</td>
                                    <td className="py-3 px-4">
                                        <StatusBadge status={purchase.status as StatusType} label={statusLabels[purchase.status]} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Modal - Nouvel Achat */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouvel achat">
                <div className="p-6 space-y-4">
                    <Input
                        label="Désignation de l'article"
                        placeholder="Ex: Diesel 2000L"
                        value={formData.item}
                        onChange={(e) => handleInputChange('item', e.target.value)}
                    />
                    <Input
                        label="Fournisseur"
                        placeholder="Ex: Total Congo"
                        value={formData.supplier}
                        onChange={(e) => handleInputChange('supplier', e.target.value)}
                    />
                    <Select
                        label="Catégorie"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        options={PURCHASE_CATEGORIES.map(c => ({ value: c.value, label: c.label }))}
                    />
                    <Input
                        label="Montant ($)"
                        type="number"
                        placeholder="0"
                        value={formData.amount}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                    />
                    <Input
                        label="Date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                    />
                    <Select
                        label="Statut"
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        options={ORDER_STATUS.map(s => ({ value: s.value, label: s.label }))}
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
                onClose={() => { setIsDetailModalOpen(false); setSelectedPurchase(null); }}
                title="Détails de l'achat"
            >
                {selectedPurchase && (
                    <>
                        <div className="p-6 space-y-4">
                            {/* Infos de l'achat */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-txt-tertiary mb-1">Désignation</p>
                                    <p className="text-sm font-medium text-txt-primary">{selectedPurchase.item}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-txt-tertiary mb-1">Fournisseur</p>
                                    <p className="text-sm font-medium text-txt-primary">{selectedPurchase.supplier}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-txt-tertiary mb-1">Date</p>
                                    <p className="text-sm font-medium text-txt-primary">{selectedPurchase.date}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-txt-tertiary mb-1">Montant</p>
                                    <p className="text-lg font-bold text-txt-primary">${selectedPurchase.amount.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-xs text-txt-tertiary mb-1">Catégorie</p>
                                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(selectedPurchase.category)}`}>
                                    {getCategoryLabel(selectedPurchase.category)}
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
                                    <StatusBadge status={selectedPurchase.status as StatusType} label={statusLabels[selectedPurchase.status]} />
                                    <p className="text-xs text-txt-tertiary mt-2 italic">
                                        Seuls les administrateurs peuvent modifier le statut.
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
                            <Button variant="secondary" onClick={() => { setIsDetailModalOpen(false); setSelectedPurchase(null); }}>
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

export default Achats;
