import React, { useState } from 'react';
import { Search, Plus, Users, Calendar, Clock, Copy } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Modal } from '../components/ui/Modal';
import { Input, Select } from '../components/ui/Input';
import { useToast } from '../context/ToastContext';

interface Worker {
    id: string;
    name: string;
    role: string;
    team: 'A' | 'B';
    phone: string;
    status: 'actif' | 'conge' | 'absent';
    hireDate: string;
}

const roleLabels: Record<string, string> = {
    chef_equipe: 'Chef Équipe',
    operateur: 'Opérateur',
    technicien: 'Technicien',
    conducteur: 'Conducteur',
    gardien: 'Gardien',
};

const statusConfig: { value: Worker['status']; label: string }[] = [
    { value: 'actif', label: 'Actif' },
    { value: 'conge', label: 'En Congé' },
    { value: 'absent', label: 'Absent' },
];

const initialWorkers: Worker[] = [
    { id: 'EMP-001', name: 'Jean Kabongo', role: 'chef_equipe', team: 'A', phone: '+243 812 345 678', status: 'actif', hireDate: '2022-03-15' },
    { id: 'EMP-002', name: 'Marie Mutombo', role: 'operateur', team: 'A', phone: '+243 812 456 789', status: 'actif', hireDate: '2023-01-10' },
    { id: 'EMP-003', name: 'Pierre Kasongo', role: 'technicien', team: 'B', phone: '+243 812 567 890', status: 'actif', hireDate: '2023-06-22' },
    { id: 'EMP-004', name: 'André Mwamba', role: 'conducteur', team: 'B', phone: '+243 812 678 901', status: 'conge', hireDate: '2024-02-01' },
    { id: 'EMP-005', name: 'Joseph Tshisekedi', role: 'gardien', team: 'A', phone: '+243 812 789 012', status: 'actif', hireDate: '2022-11-05' },
    { id: 'EMP-006', name: 'Sophie Lukusa', role: 'operateur', team: 'B', phone: '+243 812 890 123', status: 'absent', hireDate: '2024-08-15' },
];

// Mock activity data
const mockActivities = [
    { time: '08:00', action: 'A pointé à l\'arrivée', icon: Clock },
    { time: '12:00', action: 'Pause déjeuner', icon: Clock },
    { time: '16:00', action: 'A terminé sa journée', icon: Clock },
];

const filters = ['Tous', 'Équipe A', 'Équipe B', 'Actifs', 'Congé'];

export const Personnel: React.FC = () => {
    const { showToast } = useToast();
    const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
    const [activeFilter, setActiveFilter] = useState('Tous');
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

    // Form state for adding
    const [formData, setFormData] = useState({
        name: '',
        role: 'operateur',
        team: 'A',
        phone: '',
    });

    // Leave planning state
    const [leaveData, setLeaveData] = useState({
        startDate: '',
        endDate: '',
        type: 'paye',
    });

    // Combined filtering
    const filteredWorkers = workers.filter(worker => {
        let passesTabFilter = true;
        if (activeFilter === 'Équipe A') passesTabFilter = worker.team === 'A';
        else if (activeFilter === 'Équipe B') passesTabFilter = worker.team === 'B';
        else if (activeFilter === 'Actifs') passesTabFilter = worker.status === 'actif';
        else if (activeFilter === 'Congé') passesTabFilter = worker.status === 'conge';

        let passesSearchFilter = true;
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            passesSearchFilter =
                worker.name.toLowerCase().includes(query) ||
                roleLabels[worker.role]?.toLowerCase().includes(query);
        }

        return passesTabFilter && passesSearchFilter;
    });

    const stats = {
        total: workers.length,
        actifs: workers.filter(e => e.status === 'actif').length,
        conge: workers.filter(e => e.status === 'conge').length,
        absents: workers.filter(e => e.status === 'absent').length,
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (!formData.name.trim()) {
            showToast('Veuillez entrer un nom', 'error');
            return;
        }

        const newWorker: Worker = {
            id: `EMP-${String(workers.length + 1).padStart(3, '0')}`,
            name: formData.name.trim(),
            role: formData.role,
            team: formData.team as 'A' | 'B',
            phone: formData.phone || '+243 XXX XXX XXX',
            status: 'actif',
            hireDate: new Date().toISOString().split('T')[0],
        };

        setWorkers(prev => [newWorker, ...prev]);
        showToast(`Travailleur "${newWorker.name}" ajouté avec succès`, 'success');
        setFormData({ name: '', role: 'operateur', team: 'A', phone: '' });
        setIsAddModalOpen(false);
    };

    const handleWorkerClick = (worker: Worker) => {
        setSelectedWorker(worker);
        setLeaveData({ startDate: '', endDate: '', type: 'paye' });
        setIsDetailModalOpen(true);
    };

    const handleStatusChange = (newStatus: Worker['status']) => {
        if (selectedWorker) {
            setWorkers(prev => prev.map(w =>
                w.id === selectedWorker.id ? { ...w, status: newStatus } : w
            ));
            setSelectedWorker(prev => prev ? { ...prev, status: newStatus } : null);
            showToast(`Statut mis à jour : ${statusConfig.find(s => s.value === newStatus)?.label}`, 'success');
        }
    };

    const handleLeaveSubmit = () => {
        if (!leaveData.startDate || !leaveData.endDate) {
            showToast('Veuillez remplir les dates', 'error');
            return;
        }

        // Update status to "conge"
        handleStatusChange('conge');
        showToast(`Congé planifié du ${leaveData.startDate} au ${leaveData.endDate}`, 'success');
        setLeaveData({ startDate: '', endDate: '', type: 'paye' });
    };

    const handleShareContact = () => {
        if (selectedWorker) {
            const contactText = `👤 ${selectedWorker.name} - ${roleLabels[selectedWorker.role] || selectedWorker.role} (📞 ${selectedWorker.phone})`;
            navigator.clipboard.writeText(contactText);
            showToast('Contact copié !', 'success');
        }
    };

    const getStatusBadge = (status: Worker['status']) => {
        switch (status) {
            case 'actif': return <Badge status="success">Actif</Badge>;
            case 'conge': return <Badge status="warning">Congé</Badge>;
            case 'absent': return <Badge status="info">Absent</Badge>;
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-txt-primary">Personnel</h1>
                    <p className="text-txt-secondary">Gestion des équipes</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-tertiary" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue w-48"
                        />
                    </div>
                    <Button variant="primary" icon={<Plus size={18} strokeWidth={1.5} />} onClick={() => setIsAddModalOpen(true)}>
                        Ajouter
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${activeFilter === filter ? 'bg-accent-blue text-white' : 'bg-gray-100 text-txt-secondary hover:bg-gray-200'
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="text-center py-4"><p className="text-xs text-txt-secondary mb-1">Total</p><p className="text-2xl font-bold text-txt-primary">{stats.total}</p></Card>
                <Card className="text-center py-4"><p className="text-xs text-txt-secondary mb-1">Actifs</p><p className="text-2xl font-bold text-accent-green">{stats.actifs}</p></Card>
                <Card className="text-center py-4"><p className="text-xs text-txt-secondary mb-1">En congé</p><p className="text-2xl font-bold text-accent-gold">{stats.conge}</p></Card>
                <Card className="text-center py-4"><p className="text-xs text-txt-secondary mb-1">Absents</p><p className="text-2xl font-bold text-accent-red">{stats.absents}</p></Card>
            </div>

            {/* Employee List */}
            <div className="space-y-3">
                {filteredWorkers.length === 0 ? (
                    <Card className="p-8 text-center">
                        <Users size={40} className="mx-auto mb-3 text-txt-tertiary opacity-50" />
                        <p className="text-txt-secondary font-medium">Aucun employé trouvé</p>
                        <p className="text-txt-tertiary text-sm mt-1">{searchQuery ? `Pas de résultat pour "${searchQuery}"` : 'Ajoutez un employé pour commencer'}</p>
                    </Card>
                ) : (
                    filteredWorkers.map((worker) => (
                        <Card
                            key={worker.id}
                            className="flex items-center gap-4 p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleWorkerClick(worker)}
                        >
                            <Avatar name={worker.name} size="lg" />
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-txt-primary">{worker.name}</p>
                                <p className="text-sm text-txt-secondary">{roleLabels[worker.role] || worker.role} · Équipe {worker.team}</p>
                                <p className="text-xs text-txt-tertiary">{worker.phone}</p>
                            </div>
                            {getStatusBadge(worker.status)}
                        </Card>
                    ))
                )}
            </div>

            {/* Modal - Ajouter */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Ajouter un travailleur">
                <div className="p-6 space-y-4">
                    <Input label="Nom complet" placeholder="Ex: Jean Kabongo" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} />
                    <Select label="Poste / Rôle" value={formData.role} onChange={(e) => handleInputChange('role', e.target.value)} options={[
                        { value: 'chef_equipe', label: 'Chef Équipe' },
                        { value: 'operateur', label: 'Opérateur' },
                        { value: 'technicien', label: 'Technicien' },
                        { value: 'conducteur', label: 'Conducteur' },
                        { value: 'gardien', label: 'Gardien' },
                    ]} />
                    <Select label="Équipe" value={formData.team} onChange={(e) => handleInputChange('team', e.target.value)} options={[
                        { value: 'A', label: 'Équipe A' },
                        { value: 'B', label: 'Équipe B' },
                    ]} />
                    <Input label="Téléphone" type="tel" placeholder="+243 XXX XXX XXX" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
                </div>
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                    <Button variant="secondary" fullWidth onClick={() => setIsAddModalOpen(false)}>Annuler</Button>
                    <Button variant="primary" fullWidth onClick={handleSubmit}>Ajouter</Button>
                </div>
            </Modal>

            {/* Modal - Fiche Employé Détaillée */}
            <Modal isOpen={isDetailModalOpen} onClose={() => { setIsDetailModalOpen(false); setSelectedWorker(null); }} title="Fiche Employé">
                {selectedWorker && (
                    <>
                        <div className="p-6 space-y-5">
                            {/* Header - Avatar & Info */}
                            <div className="flex items-center gap-4">
                                {/* Large Avatar */}
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-blue to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                    {selectedWorker.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-lg font-bold text-txt-primary">{selectedWorker.name}</h2>
                                    <p className="text-sm text-txt-secondary">{roleLabels[selectedWorker.role] || selectedWorker.role}</p>
                                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${selectedWorker.team === 'A' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                        Équipe {selectedWorker.team}
                                    </span>
                                </div>
                                {/* Share Button */}
                                <button
                                    onClick={handleShareContact}
                                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                                    title="Partager le contact"
                                >
                                    <Copy size={18} className="text-txt-secondary" />
                                </button>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="text-xs text-txt-tertiary">Téléphone</p>
                                    <p className="text-sm font-medium text-txt-primary">{selectedWorker.phone}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-txt-tertiary">ID Employé</p>
                                    <p className="text-sm font-medium text-txt-primary">{selectedWorker.id}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-txt-tertiary">Date d'embauche</p>
                                    <p className="text-sm font-medium text-txt-primary">{formatDate(selectedWorker.hireDate)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-txt-tertiary">Ancienneté</p>
                                    <p className="text-sm font-medium text-txt-primary">
                                        {Math.floor((Date.now() - new Date(selectedWorker.hireDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} mois
                                    </p>
                                </div>
                            </div>

                            {/* Status Selector */}
                            <div>
                                <label className="block text-sm font-medium text-txt-primary mb-2">Statut actuel</label>
                                <div className="flex gap-3">
                                    {statusConfig.map((status) => {
                                        const isActive = selectedWorker.status === status.value;
                                        const bgColor = status.value === 'actif' ? 'bg-green-500'
                                            : status.value === 'conge' ? 'bg-amber-400'
                                                : 'bg-red-500';
                                        const activeBg = status.value === 'actif' ? 'bg-green-50 border-green-500'
                                            : status.value === 'conge' ? 'bg-amber-50 border-amber-500'
                                                : 'bg-red-50 border-red-500';

                                        return (
                                            <button
                                                key={status.value}
                                                onClick={() => handleStatusChange(status.value)}
                                                className={`flex-1 py-4 px-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${isActive ? activeBg : 'bg-white border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                {/* Status Dot - Large */}
                                                <div className={`w-4 h-4 rounded-full ${bgColor}`} />
                                                <span className={`text-sm font-medium ${isActive ? 'text-txt-primary' : 'text-txt-secondary'}`}>
                                                    {status.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Leave Planning */}
                            <div className="border-t border-gray-100 pt-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Calendar size={16} className="text-txt-tertiary" />
                                    <label className="text-sm font-medium text-txt-primary">Planifier un congé</label>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <Input
                                        label="Date de début"
                                        type="date"
                                        value={leaveData.startDate}
                                        onChange={(e) => setLeaveData(prev => ({ ...prev, startDate: e.target.value }))}
                                    />
                                    <Input
                                        label="Date de fin"
                                        type="date"
                                        value={leaveData.endDate}
                                        onChange={(e) => setLeaveData(prev => ({ ...prev, endDate: e.target.value }))}
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <Select
                                            label="Type de congé"
                                            value={leaveData.type}
                                            onChange={(e) => setLeaveData(prev => ({ ...prev, type: e.target.value }))}
                                            options={[
                                                { value: 'paye', label: 'Congé payé' },
                                                { value: 'maladie', label: 'Maladie' },
                                                { value: 'recuperation', label: 'Récupération' },
                                            ]}
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <Button variant="secondary" size="sm" onClick={handleLeaveSubmit}>
                                            Valider
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Activity Timeline */}
                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-sm font-medium text-txt-primary mb-3">Dernières activités</p>
                                <div className="space-y-2">
                                    {mockActivities.map((activity, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm">
                                            <span className="text-xs text-txt-tertiary w-12">{activity.time}</span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
                                            <span className="text-txt-secondary">{activity.action}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                            <Button variant="secondary" fullWidth onClick={() => { setIsDetailModalOpen(false); setSelectedWorker(null); }}>
                                Fermer
                            </Button>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default Personnel;
