import React, { useState } from 'react';
import { Plus, Download, Filter } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input, Select, Textarea } from '../components/ui/Input';
import { useToast } from '../context/ToastContext';

interface ProductionEntry {
    id: string;
    date: string;
    quantity: string;
    purity: number;
    team: 'A' | 'B';
    shift: string;
    status: 'valide' | 'brouillon' | 'annule';
}

const initialEntries: ProductionEntry[] = [
    { id: 'prod-1', date: '7 Jan 2026', quantity: '222g', purity: 94, team: 'A', shift: 'Matin', status: 'valide' },
    { id: 'prod-2', date: '6 Jan 2026', quantity: '185g', purity: 91, team: 'B', shift: 'Jour', status: 'valide' },
    { id: 'prod-3', date: '5 Jan 2026', quantity: '165g', purity: 88, team: 'A', shift: 'Soir', status: 'valide' },
    { id: 'prod-4', date: '4 Jan 2026', quantity: '195g', purity: 92, team: 'B', shift: 'Matin', status: 'valide' },
    { id: 'prod-5', date: '3 Jan 2026', quantity: '210g', purity: 83, team: 'A', shift: 'Jour', status: 'valide' },
    { id: 'prod-6', date: '2 Jan 2026', quantity: '178g', purity: 96, team: 'B', shift: 'Soir', status: 'valide' },
];

// Helper to get purity color based on value
const getPurityColor = (purity: number): string => {
    if (purity >= 90) return 'text-green-600 font-semibold';
    if (purity >= 85) return 'text-amber-600';
    return 'text-red-500';
};

export const Production: React.FC = () => {
    const { showToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [entries, setEntries] = useState<ProductionEntry[]>(initialEntries);

    // Form state
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        team: 'A',
        shift: 'matin',
        quantity: '',
        purity: '',
        notes: '',
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (!formData.quantity) {
            showToast('Veuillez entrer une quantité', 'error');
            return;
        }

        const quantity = parseFloat(formData.quantity);
        const purity = parseFloat(formData.purity) || 90;

        if (isNaN(quantity) || quantity <= 0) {
            showToast('Quantité invalide', 'error');
            return;
        }

        const date = new Date(formData.date);
        const dateStr = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

        const newEntry: ProductionEntry = {
            id: `prod-${Date.now()}`,
            date: dateStr,
            quantity: `${quantity}g`,
            purity: Math.min(100, Math.max(0, purity)),
            team: formData.team as 'A' | 'B',
            shift: formData.shift === 'matin' ? 'Matin' : formData.shift === 'jour' ? 'Jour' : 'Soir',
            status: 'valide',
        };

        setEntries(prev => [newEntry, ...prev]);
        showToast(`Production enregistrée : ${quantity}g à ${purity}% de pureté`, 'success');

        // Reset form
        setFormData({
            date: new Date().toISOString().split('T')[0],
            team: 'A',
            shift: 'matin',
            quantity: '',
            purity: '',
            notes: '',
        });
        setIsModalOpen(false);
    };

    // Calculate totals
    const totalMonth = entries.reduce((sum, e) => {
        const qty = parseFloat(e.quantity.replace('g', '').replace('kg', ''));
        return sum + (e.quantity.includes('kg') ? qty * 1000 : qty);
    }, 0);

    const avgPurity = entries.length > 0
        ? Math.round(entries.reduce((sum, e) => sum + e.purity, 0) / entries.length)
        : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <h1 className="text-2xl font-bold text-txt-primary break-words overflow-hidden">Production - Suivi</h1>
                    <p className="text-txt-secondary">Total mois: {totalMonth >= 1000 ? `${(totalMonth / 1000).toFixed(2)} kg` : `${totalMonth}g`}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" icon={<Download size={18} strokeWidth={1.5} />}>
                        Exporter
                    </Button>
                    <Button variant="secondary" icon={<Filter size={18} strokeWidth={1.5} />}>
                        Filtrer
                    </Button>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Aujourd'hui", value: entries[0]?.quantity || '0g' },
                    { label: 'Semaine', value: '1.94kg' },
                    { label: 'Ce mois', value: totalMonth >= 1000 ? `${(totalMonth / 1000).toFixed(2)}kg` : `${totalMonth}g` },
                    { label: 'Pureté Moy.', value: `${avgPurity}%`, highlight: avgPurity >= 90 },
                ].map((kpi) => (
                    <Card key={kpi.label} className="text-center py-4">
                        <p className="text-xs text-txt-secondary mb-1">{kpi.label}</p>
                        <p className={`text-xl font-bold ${kpi.highlight ? 'text-green-600' : 'text-txt-primary'}`}>{kpi.value}</p>
                    </Card>
                ))}
            </div>

            {/* Table with proper padding */}
            <Card className="p-6">
                <h2 className="text-lg font-semibold text-txt-primary mb-4">Entrées de production</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-3 px-4 text-xs font-medium text-txt-secondary uppercase">Date</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-txt-secondary uppercase">Quantité</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-txt-secondary uppercase">Pureté</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-txt-secondary uppercase">Équipe</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-txt-secondary uppercase">Quart</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-txt-secondary uppercase">Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map((entry) => (
                                <tr key={entry.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors">
                                    <td className="py-3 px-4 text-sm text-txt-primary">{entry.date}</td>
                                    <td className="py-3 px-4 text-sm font-medium text-txt-primary">{entry.quantity}</td>
                                    <td className="py-3 px-4 text-sm">
                                        <span className={getPurityColor(entry.purity)}>{entry.purity}%</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${entry.team === 'A' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            Équipe {entry.team}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-txt-secondary">{entry.shift}</td>
                                    <td className="py-3 px-4">
                                        <Badge status="success">Validé</Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* FAB - Functional */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-24 lg:bottom-8 right-6 w-14 h-14 bg-accent-blue text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center z-50"
            >
                <Plus size={24} strokeWidth={1.5} />
            </button>

            {/* Modal - Add Production Entry */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Nouvelle entrée production"
            >
                <div className="p-6 space-y-4">
                    <Input
                        label="Date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                    />
                    <Select
                        label="Équipe"
                        value={formData.team}
                        onChange={(e) => handleInputChange('team', e.target.value)}
                        options={[
                            { value: 'A', label: 'Équipe A' },
                            { value: 'B', label: 'Équipe B' },
                        ]}
                    />
                    <Select
                        label="Quart de travail"
                        value={formData.shift}
                        onChange={(e) => handleInputChange('shift', e.target.value)}
                        options={[
                            { value: 'matin', label: 'Matin' },
                            { value: 'jour', label: 'Jour' },
                            { value: 'soir', label: 'Soir' },
                        ]}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Quantité (g)"
                            type="number"
                            placeholder="0"
                            value={formData.quantity}
                            onChange={(e) => handleInputChange('quantity', e.target.value)}
                        />
                        <Input
                            label="Pureté (%)"
                            type="number"
                            placeholder="92"
                            value={formData.purity}
                            onChange={(e) => handleInputChange('purity', e.target.value)}
                        />
                    </div>
                    <Textarea
                        label="Notes"
                        placeholder="Remarques optionnelles..."
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                    />
                </div>
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                    <Button variant="secondary" fullWidth onClick={() => setIsModalOpen(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" fullWidth onClick={handleSubmit}>
                        Enregistrer
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default Production;
