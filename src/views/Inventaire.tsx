import React, { useState } from 'react';
import { Plus, Search, Wrench, Settings, X, Check } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input, Select, Textarea } from '../components/ui/Input';
import { StatusDot, type StatusType } from '../components/ui/StatusDot';
import { useToast } from '../context/ToastContext';

interface Equipment {
    id: string;
    name: string;
    type: string;
    status: 'operationnel' | 'maintenance' | 'panne';
    totalHours: number;
    location: string;
    nextMaintenanceDate: string;
    reason?: string; // Motif de panne/maintenance
}

const statusColors: Record<string, 'success' | 'warning' | 'error'> = {
    operationnel: 'success',
    maintenance: 'warning',
    panne: 'error',
};

const statusLabels: Record<string, string> = {
    operationnel: 'Opérationnel',
    maintenance: 'En Maintenance',
    panne: 'En Panne',
};

const statusConfig: { value: Equipment['status']; label: string; dotStatus: StatusType }[] = [
    { value: 'operationnel', label: 'Opérationnel', dotStatus: 'approuve' },
    { value: 'maintenance', label: 'Maintenance', dotStatus: 'en_attente' },
    { value: 'panne', label: 'En Panne', dotStatus: 'rejete' },
];

const typeLabels: Record<string, string> = {
    foreuse: 'Foreuse',
    concasseur: 'Concasseur',
    generateur: 'Générateur',
    pompe: 'Pompe',
    vehicule: 'Véhicule',
};

const initialEquipment: Equipment[] = [
    { id: 'EQ-001', name: 'Foreuse A', type: 'foreuse', status: 'operationnel', totalHours: 1200, location: 'Zone Nord', nextMaintenanceDate: '2026-01-15' },
    { id: 'EQ-002', name: 'Foreuse B', type: 'foreuse', status: 'maintenance', totalHours: 980, location: 'Zone Sud', nextMaintenanceDate: '2026-01-20', reason: 'Révision 500h' },
    { id: 'EQ-003', name: 'Concasseur Principal', type: 'concasseur', status: 'operationnel', totalHours: 2500, location: 'Secteur Central', nextMaintenanceDate: '2026-02-01' },
    { id: 'EQ-004', name: 'Générateur Alpha', type: 'generateur', status: 'panne', totalHours: 3200, location: 'Base Camp', nextMaintenanceDate: '2026-01-10', reason: 'Fuite hydraulique' },
    { id: 'EQ-005', name: 'Pompe d\'exhaure', type: 'pompe', status: 'operationnel', totalHours: 1800, location: 'Zone Inondable', nextMaintenanceDate: '2026-01-25' },
    { id: 'EQ-006', name: 'Camion Benne', type: 'vehicule', status: 'panne', totalHours: 4500, location: 'Parking', nextMaintenanceDate: '2026-01-08', reason: 'Pneu crevé' },
    { id: 'EQ-007', name: 'Pick-up Toyota', type: 'vehicule', status: 'maintenance', totalHours: 2800, location: 'Garage', nextMaintenanceDate: '2026-01-12', reason: 'Vidange programmée' },
];

export const Inventaire: React.FC = () => {
    const { showToast } = useToast();
    const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
    const [filter, setFilter] = useState('tous');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
    const [bulkStatus, setBulkStatus] = useState<Equipment['status']>('operationnel');

    // Form state for adding
    const [formData, setFormData] = useState({
        name: '',
        type: 'foreuse',
        location: '',
        totalHours: '',
    });

    // Detail edit state
    const [editData, setEditData] = useState({
        status: 'operationnel' as Equipment['status'],
        reason: '',
        nextMaintenanceDate: '',
    });

    // Filter logic
    const filteredEquipment = equipment.filter(eq => {
        const passesFilter = filter === 'tous' || eq.status === filter;
        const passesSearch = !searchQuery.trim() ||
            eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            typeLabels[eq.type]?.toLowerCase().includes(searchQuery.toLowerCase());
        return passesFilter && passesSearch;
    });

    // Show "Motif" column only when filter is "maintenance" or "panne"
    const showReasonColumn = filter === 'maintenance' || filter === 'panne';

    const stats = {
        total: equipment.length,
        operationnel: equipment.filter(m => m.status === 'operationnel').length,
        maintenance: equipment.filter(m => m.status === 'maintenance').length,
        panne: equipment.filter(m => m.status === 'panne').length,
    };

    // Checkbox handlers
    const toggleSelectAll = () => {
        if (selectedIds.length === filteredEquipment.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredEquipment.map(eq => eq.id));
        }
    };

    const toggleSelectOne = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    // Add equipment
    const handleAddSubmit = () => {
        if (!formData.name.trim()) {
            showToast('Veuillez entrer un nom', 'error');
            return;
        }

        const newEquipment: Equipment = {
            id: `EQ-${String(equipment.length + 1).padStart(3, '0')}`,
            name: formData.name.trim(),
            type: formData.type,
            status: 'operationnel',
            totalHours: parseInt(formData.totalHours) || 0,
            location: formData.location || 'Non assigné',
            nextMaintenanceDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        };

        setEquipment(prev => [newEquipment, ...prev]);
        showToast(`Équipement "${newEquipment.name}" ajouté`, 'success');
        setFormData({ name: '', type: 'foreuse', location: '', totalHours: '' });
        setIsAddModalOpen(false);
    };

    // Open detail modal
    const handleRowClick = (eq: Equipment, e: React.MouseEvent) => {
        // Don't open modal if clicking checkbox
        if ((e.target as HTMLElement).closest('input[type="checkbox"]')) return;

        setSelectedEquipment(eq);
        setEditData({
            status: eq.status,
            reason: eq.reason || '',
            nextMaintenanceDate: eq.nextMaintenanceDate,
        });
        setIsDetailModalOpen(true);
    };

    // Save detail changes
    const handleDetailSave = () => {
        if (selectedEquipment) {
            setEquipment(prev => prev.map(eq =>
                eq.id === selectedEquipment.id
                    ? { ...eq, status: editData.status, reason: editData.reason, nextMaintenanceDate: editData.nextMaintenanceDate }
                    : eq
            ));
            showToast('Équipement mis à jour', 'success');
            setIsDetailModalOpen(false);
            setSelectedEquipment(null);
        }
    };

    // Bulk update
    const handleBulkUpdate = () => {
        setEquipment(prev => prev.map(eq =>
            selectedIds.includes(eq.id) ? { ...eq, status: bulkStatus } : eq
        ));
        showToast(`${selectedIds.length} équipements passés à "${statusLabels[bulkStatus]}"`, 'success');
        setSelectedIds([]);
        setIsBulkModalOpen(false);
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-txt-primary">Inventaire</h1>
                    <p className="text-sm text-txt-secondary">Gestion des équipements et machines</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-tertiary" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue w-40"
                        />
                    </div>
                    <Button variant="primary" size="sm" icon={<Plus size={16} strokeWidth={1.5} />} onClick={() => setIsAddModalOpen(true)}>
                        Ajouter
                    </Button>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="p-4 text-center"><p className="text-xs text-txt-secondary mb-1">Total</p><p className="text-2xl font-bold text-txt-primary">{stats.total}</p></Card>
                <Card className="p-4 text-center"><p className="text-xs text-txt-secondary mb-1">Opérationnels</p><p className="text-2xl font-bold text-accent-green">{stats.operationnel}</p></Card>
                <Card className="p-4 text-center"><p className="text-xs text-txt-secondary mb-1">Maintenance</p><p className="text-2xl font-bold text-accent-orange">{stats.maintenance}</p></Card>
                <Card className="p-4 text-center"><p className="text-xs text-txt-secondary mb-1">En Panne</p><p className="text-2xl font-bold text-accent-red">{stats.panne}</p></Card>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
                {['tous', 'operationnel', 'maintenance', 'panne'].map((f) => (
                    <button
                        key={f}
                        onClick={() => { setFilter(f); setSelectedIds([]); }}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filter === f ? 'bg-accent-blue text-white' : 'bg-gray-100 text-txt-secondary hover:bg-gray-200'
                            }`}
                    >
                        {f === 'tous' ? 'Tous' : statusLabels[f]}
                    </button>
                ))}
            </div>

            {/* Bulk Action Bar */}
            {selectedIds.length > 0 && (
                <div className="bg-accent-blue/10 border border-accent-blue/30 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-accent-blue">
                            {selectedIds.length} équipement{selectedIds.length > 1 ? 's' : ''} sélectionné{selectedIds.length > 1 ? 's' : ''}
                        </span>
                        <button onClick={() => setSelectedIds([])} className="text-txt-tertiary hover:text-txt-primary">
                            <X size={16} />
                        </button>
                    </div>
                    <Button variant="primary" size="sm" icon={<Settings size={14} />} onClick={() => setIsBulkModalOpen(true)}>
                        Changer le statut
                    </Button>
                </div>
            )}

            {/* Table */}
            <Card className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 w-10">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.length === filteredEquipment.length && filteredEquipment.length > 0}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 rounded border-gray-300 text-accent-blue focus:ring-accent-blue/20"
                                    />
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-txt-secondary uppercase">Nom</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-txt-secondary uppercase">Type</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-txt-secondary uppercase">Statut</th>
                                {showReasonColumn && (
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-txt-secondary uppercase">Motif</th>
                                )}
                                <th className="text-left py-3 px-4 text-xs font-semibold text-txt-secondary uppercase">Heures</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-txt-secondary uppercase">Localisation</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-txt-secondary uppercase">Proch. Maint.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEquipment.map((eq) => (
                                <tr
                                    key={eq.id}
                                    className={`border-t border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${selectedIds.includes(eq.id) ? 'bg-accent-blue/5' : ''
                                        }`}
                                    onClick={(e) => handleRowClick(eq, e)}
                                >
                                    <td className="py-3 px-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(eq.id)}
                                            onChange={() => toggleSelectOne(eq.id)}
                                            className="w-4 h-4 rounded border-gray-300 text-accent-blue focus:ring-accent-blue/20"
                                        />
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${eq.status === 'operationnel' ? 'bg-green-100' :
                                                    eq.status === 'maintenance' ? 'bg-orange-100' : 'bg-red-100'
                                                }`}>
                                                <Wrench size={14} strokeWidth={1.5} className={
                                                    eq.status === 'operationnel' ? 'text-green-600' :
                                                        eq.status === 'maintenance' ? 'text-orange-600' : 'text-red-600'
                                                } />
                                            </div>
                                            <span className="text-sm font-medium text-txt-primary">{eq.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-txt-secondary">{typeLabels[eq.type]}</td>
                                    <td className="py-3 px-4">
                                        <Badge status={statusColors[eq.status]}>{statusLabels[eq.status]}</Badge>
                                    </td>
                                    {showReasonColumn && (
                                        <td className="py-3 px-4 text-sm text-txt-secondary italic">{eq.reason || '-'}</td>
                                    )}
                                    <td className="py-3 px-4 text-sm text-txt-primary font-medium">{eq.totalHours.toLocaleString()}h</td>
                                    <td className="py-3 px-4 text-sm text-txt-secondary">{eq.location}</td>
                                    <td className="py-3 px-4 text-sm text-txt-secondary">{eq.nextMaintenanceDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Modal - Add Equipment */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Nouvel équipement">
                <div className="p-6 space-y-4">
                    <Input label="Nom de l'équipement" placeholder="Ex: Foreuse C" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} />
                    <Select label="Type" value={formData.type} onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))} options={[
                        { value: 'foreuse', label: 'Foreuse' },
                        { value: 'concasseur', label: 'Concasseur' },
                        { value: 'generateur', label: 'Générateur' },
                        { value: 'pompe', label: 'Pompe' },
                        { value: 'vehicule', label: 'Véhicule' },
                    ]} />
                    <Input label="Localisation" placeholder="Ex: Secteur Nord" value={formData.location} onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))} />
                    <Input label="Heures d'utilisation" type="number" placeholder="0" value={formData.totalHours} onChange={(e) => setFormData(prev => ({ ...prev, totalHours: e.target.value }))} />
                </div>
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                    <Button variant="secondary" fullWidth onClick={() => setIsAddModalOpen(false)}>Annuler</Button>
                    <Button variant="primary" fullWidth onClick={handleAddSubmit}>Ajouter</Button>
                </div>
            </Modal>

            {/* Modal - Equipment Detail */}
            <Modal isOpen={isDetailModalOpen} onClose={() => { setIsDetailModalOpen(false); setSelectedEquipment(null); }} title="Détails équipement">
                {selectedEquipment && (
                    <>
                        <div className="p-6 space-y-5">
                            {/* Header */}
                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${editData.status === 'operationnel' ? 'bg-green-100' :
                                        editData.status === 'maintenance' ? 'bg-orange-100' : 'bg-red-100'
                                    }`}>
                                    <Wrench size={24} strokeWidth={1.5} className={
                                        editData.status === 'operationnel' ? 'text-green-600' :
                                            editData.status === 'maintenance' ? 'text-orange-600' : 'text-red-600'
                                    } />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-lg font-bold text-txt-primary">{selectedEquipment.name}</h2>
                                    <p className="text-sm text-txt-secondary">{typeLabels[selectedEquipment.type]} · {selectedEquipment.id}</p>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                                <div><p className="text-xs text-txt-tertiary">Localisation</p><p className="text-sm font-medium text-txt-primary">{selectedEquipment.location}</p></div>
                                <div><p className="text-xs text-txt-tertiary">Heures totales</p><p className="text-sm font-medium text-txt-primary">{selectedEquipment.totalHours.toLocaleString()}h</p></div>
                            </div>

                            {/* Status Selector */}
                            <div>
                                <label className="block text-sm font-medium text-txt-primary mb-2">Statut</label>
                                <div className="flex gap-2">
                                    {statusConfig.map((status) => (
                                        <button
                                            key={status.value}
                                            onClick={() => setEditData(prev => ({ ...prev, status: status.value }))}
                                            className={`flex-1 py-3 px-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${editData.status === status.value
                                                    ? status.value === 'operationnel' ? 'bg-green-50 border-green-500'
                                                        : status.value === 'maintenance' ? 'bg-orange-50 border-orange-500'
                                                            : 'bg-red-50 border-red-500'
                                                    : 'bg-white border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <StatusDot status={status.dotStatus} size="md" />
                                            <span className={`text-xs font-medium ${editData.status === status.value ? 'text-txt-primary' : 'text-txt-secondary'}`}>
                                                {status.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Reason (only for non-operational) */}
                            {editData.status !== 'operationnel' && (
                                <Textarea
                                    label="Motif de la panne/maintenance"
                                    placeholder="Ex: Fuite hydraulique, Révision 500h..."
                                    value={editData.reason}
                                    onChange={(e) => setEditData(prev => ({ ...prev, reason: e.target.value }))}
                                />
                            )}

                            {/* Next maintenance date */}
                            <Input
                                label="Prochaine maintenance"
                                type="date"
                                value={editData.nextMaintenanceDate}
                                onChange={(e) => setEditData(prev => ({ ...prev, nextMaintenanceDate: e.target.value }))}
                            />
                        </div>

                        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                            <Button variant="secondary" fullWidth onClick={() => { setIsDetailModalOpen(false); setSelectedEquipment(null); }}>Annuler</Button>
                            <Button variant="primary" fullWidth onClick={handleDetailSave}>Sauvegarder</Button>
                        </div>
                    </>
                )}
            </Modal>

            {/* Modal - Bulk Status Change */}
            <Modal isOpen={isBulkModalOpen} onClose={() => setIsBulkModalOpen(false)} title="Changer le statut">
                <div className="p-6 space-y-4">
                    <p className="text-sm text-txt-secondary">
                        Appliquer un nouveau statut à <strong>{selectedIds.length}</strong> équipement{selectedIds.length > 1 ? 's' : ''} :
                    </p>
                    <div className="flex flex-col gap-2">
                        {statusConfig.map((status) => (
                            <button
                                key={status.value}
                                onClick={() => setBulkStatus(status.value)}
                                className={`w-full py-3 px-4 rounded-xl border-2 transition-all flex items-center gap-3 ${bulkStatus === status.value
                                        ? status.value === 'operationnel' ? 'bg-green-50 border-green-500'
                                            : status.value === 'maintenance' ? 'bg-orange-50 border-orange-500'
                                                : 'bg-red-50 border-red-500'
                                        : 'bg-white border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <StatusDot status={status.dotStatus} size="lg" />
                                <span className={`text-sm font-medium ${bulkStatus === status.value ? 'text-txt-primary' : 'text-txt-secondary'}`}>
                                    {status.label}
                                </span>
                                {bulkStatus === status.value && <Check size={16} className="ml-auto text-green-600" />}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                    <Button variant="secondary" fullWidth onClick={() => setIsBulkModalOpen(false)}>Annuler</Button>
                    <Button variant="primary" fullWidth onClick={handleBulkUpdate}>Appliquer</Button>
                </div>
            </Modal>
        </div>
    );
};

export default Inventaire;
