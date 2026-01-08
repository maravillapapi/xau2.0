import React, { useState } from 'react';
import { FileText, Download, Eye, Plus, X, FileSpreadsheet, FileType } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';

interface Report {
    id: string;
    name: string;
    type: string;
    date: string;
    author: string;
    status: string;
}

const initialReports: Report[] = [
    { id: "rpt-001", name: "Rapport Production Janvier 2026", type: "production", date: "2026-01-07", author: "Jean Kabongo", status: "final" },
    { id: "rpt-002", name: "Rapport Financier Q4 2025", type: "financier", date: "2025-12-31", author: "Marie Mutombo", status: "final" },
];

const typeColors: Record<string, string> = {
    production: 'bg-blue-100 text-blue-700',
    financier: 'bg-green-100 text-green-700',
    multi: 'bg-purple-100 text-purple-700',
    rh: 'bg-orange-100 text-orange-700',
};

// Quick date shortcuts
const getDateRange = (shortcut: string): { from: string; to: string } => {
    const today = new Date(2026, 0, 7);
    const format = (d: Date) => d.toISOString().split('T')[0];

    switch (shortcut) {
        case 'today': return { from: format(today), to: format(today) };
        case 'week': return { from: '2026-01-05', to: format(today) };
        case 'month': return { from: '2026-01-01', to: format(today) };
        case 'lastMonth': return { from: '2025-12-01', to: '2025-12-31' };
        default: return { from: '2026-01-01', to: format(today) };
    }
};

// Enterprise PDF Generator
const generatePDF = (config: {
    dateFrom: string;
    dateTo: string;
    viewType: 'summary' | 'detail';
    production: { volumes: boolean; purity: boolean; teams: boolean };
    finances: { opex: boolean; costPerGram: boolean };
    hr: { hours: boolean; incidents: boolean };
    orientation: 'portrait' | 'landscape';
}) => {
    const doc = new jsPDF({ orientation: config.orientation });
    const pageWidth = doc.internal.pageSize.getWidth();
    const isLandscape = config.orientation === 'landscape';

    // ========== HEADER INSTITUTIONNEL ==========
    doc.setFillColor(245, 158, 11);
    doc.rect(0, 0, pageWidth, 35, 'F');

    // Logo placeholder (golden circle)
    doc.setFillColor(255, 215, 0);
    doc.circle(20, 17, 8, 'F');
    doc.setTextColor(139, 69, 19);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("M", 17, 20);

    // Company info
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("MINE D'OR CONGO", 35, 15);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Site Kolwezi, Province du Lualaba, RDC', 35, 22);

    // Right side - metadata
    doc.setFontSize(8);
    doc.text(`Période: ${config.dateFrom} au ${config.dateTo}`, pageWidth - 14, 12, { align: 'right' });
    doc.text(`Généré le: ${new Date().toLocaleString('fr-FR')}`, pageWidth - 14, 18, { align: 'right' });
    doc.text('Par: Administrateur Principal', pageWidth - 14, 24, { align: 'right' });

    // Title
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    const reportType = [
        config.production.volumes && 'PRODUCTION',
        config.finances.opex && 'FINANCES',
        config.hr.hours && 'RH',
    ].filter(Boolean).join(' & ') || 'OPÉRATIONNEL';
    doc.text(`RAPPORT ${reportType} - ${config.viewType === 'summary' ? 'SYNTHÈSE' : 'DÉTAIL'}`, pageWidth / 2, 32, { align: 'center' });

    let yPos = 45;

    // ========== EXECUTIVE SUMMARY ==========
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(10, yPos, pageWidth - 20, 30, 3, 3, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('RÉSUMÉ EXÉCUTIF', 14, yPos + 8);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const kpis = [
        { label: 'Production Totale', value: '2,500 g', change: '+15%' },
        { label: 'Dépenses', value: '$ 5,900', change: '+8%' },
        { label: 'Marge Brute', value: '$ 12,600', change: '+22%' },
        { label: 'Incidents', value: '6', change: '-25%' },
    ];

    const kpiWidth = (pageWidth - 30) / 4;
    kpis.forEach((kpi, i) => {
        const x = 14 + i * kpiWidth;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(107, 114, 128);
        doc.text(kpi.label, x, yPos + 17);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(kpi.value, x, yPos + 23);
        doc.setTextColor(kpi.change.startsWith('+') ? 16 : 239, kpi.change.startsWith('+') ? 185 : 68, kpi.change.startsWith('+') ? 129 : 68);
        doc.text(kpi.change, x + 30, yPos + 23);
    });

    yPos += 40;

    // ========== PRODUCTION SECTION ==========
    if (config.production.volumes) {
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('PRODUCTION', 14, yPos);
        yPos += 8;

        const prodData = config.viewType === 'detail' ? [
            ['Date', 'Équipe', 'Quantité (g)', 'Pureté (%)', 'Statut'],
            ['07/01/2026', 'Équipe A', '125', '92.5', 'Validé'],
            ['07/01/2026', 'Équipe B', '97', '91.0', 'Validé'],
            ['06/01/2026', 'Équipe A', '142', '93.2', 'Validé'],
            ['06/01/2026', 'Équipe B', '118', '90.8', 'Validé'],
            ['05/01/2026', 'Équipe A', '138', '91.5', 'Validé'],
        ] : [
            ['Période', 'Total (g)', 'Moy. Pureté', 'Nb. Sessions'],
            ['Semaine 1', '620', '91.8%', '14'],
            ['Semaine 2', '750', '92.3%', '16'],
        ];

        autoTable(doc, {
            startY: yPos,
            head: [prodData[0]],
            body: prodData.slice(1),
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold', halign: 'left' },
            alternateRowStyles: { fillColor: [249, 250, 251] },
            columnStyles: { 2: { halign: 'right' }, 3: { halign: 'right' } },
            foot: [['TOTAL', '', '1,370', '91.8%', '']],
            footStyles: { fillColor: [229, 231, 235], fontStyle: 'bold', textColor: [0, 0, 0] },
        });

        yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // ========== FINANCES SECTION ==========
    if (config.finances.opex) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('DÉPENSES OPÉRATIONNELLES', 14, yPos);
        yPos += 8;

        const finData = [
            ['Catégorie', 'Montant ($)', '% du Total'],
            ['Carburant & Énergie', '830.00', '14.1%'],
            ['Équipement & Maintenance', '1,220.00', '20.7%'],
            ['Salaires & Charges', '2,850.00', '48.3%'],
            ['Transport & Logistique', '650.00', '11.0%'],
            ['Autres Frais', '350.00', '5.9%'],
        ];

        autoTable(doc, {
            startY: yPos,
            head: [finData[0]],
            body: finData.slice(1),
            theme: 'striped',
            headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: 'bold' },
            columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' } },
            foot: [['TOTAL', '$ 5,900.00', '100%']],
            footStyles: { fillColor: [229, 231, 235], fontStyle: 'bold', textColor: [0, 0, 0] },
        });

        yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // ========== RH SECTION ==========
    if (config.hr.hours) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('RESSOURCES HUMAINES', 14, yPos);
        yPos += 8;

        const hrData = [
            ['Employé', 'Heures Travaillées', 'Retards', 'Absences'],
            ['Jean Kabongo', '42h', '0', '0'],
            ['Marie Mutombo', '38h', '1', '0'],
            ['Pierre Kasongo', '40h', '0', '1'],
            ['André Mwamba', '36h', '2', '0'],
        ];

        autoTable(doc, {
            startY: yPos,
            head: [hrData[0]],
            body: hrData.slice(1),
            theme: 'striped',
            headStyles: { fillColor: [249, 115, 22], textColor: 255, fontStyle: 'bold' },
            columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' }, 3: { halign: 'right' } },
            foot: [['TOTAL', '156h', '3', '1']],
            footStyles: { fillColor: [229, 231, 235], fontStyle: 'bold', textColor: [0, 0, 0] },
        });
    }

    // ========== FOOTER ==========
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(7);
        doc.setTextColor(128, 128, 128);
        doc.text(`Page ${i}/${pageCount}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
        doc.text('Document Confidentiel - Usage Interne Uniquement', 14, pageHeight - 8);
        doc.text(new Date().toISOString(), pageWidth - 14, pageHeight - 8, { align: 'right' });
    }

    doc.save(`rapport_${config.dateFrom}_${config.dateTo}.pdf`);
};

export const Rapports: React.FC = () => {
    const [reports, setReports] = useState<Report[]>(initialReports);
    const [showModal, setShowModal] = useState(false);
    const [previewReport, setPreviewReport] = useState<Report | null>(null);

    // Modal config state
    const [dateFrom, setDateFrom] = useState('2026-01-01');
    const [dateTo, setDateTo] = useState('2026-01-07');
    const [viewType, setViewType] = useState<'summary' | 'detail'>('summary');
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
    const [format, setFormat] = useState<'pdf' | 'csv' | 'excel'>('pdf');
    const [prodVolumes, setProdVolumes] = useState(true);
    const [prodPurity, setProdPurity] = useState(false);
    const [prodTeams, setProdTeams] = useState(false);
    const [finOpex, setFinOpex] = useState(false);
    const [finCost, setFinCost] = useState(false);
    const [hrHours, setHrHours] = useState(false);
    const [hrIncidents, setHrIncidents] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const applyShortcut = (shortcut: string) => {
        const range = getDateRange(shortcut);
        setDateFrom(range.from);
        setDateTo(range.to);
    };

    const handleGenerate = () => {
        const modules = [
            prodVolumes && 'Production',
            finOpex && 'Finances',
            hrHours && 'RH',
        ].filter(Boolean);

        const typeName = modules.length > 1 ? 'multi' : modules[0]?.toLowerCase() || 'production';
        const reportName = `Rapport ${modules.join(' & ') || 'Production'} - ${new Date(dateFrom).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`;

        const newReport: Report = {
            id: `rpt-${Date.now()}`,
            name: reportName,
            type: typeName,
            date: new Date().toISOString().split('T')[0],
            author: 'Administrateur',
            status: 'final',
        };

        setReports(prev => [newReport, ...prev]);

        generatePDF({
            dateFrom, dateTo, viewType, orientation,
            production: { volumes: prodVolumes, purity: prodPurity, teams: prodTeams },
            finances: { opex: finOpex, costPerGram: finCost },
            hr: { hours: hrHours, incidents: hrIncidents },
        });

        setShowModal(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="space-y-4">
            {/* Toast */}
            {showToast && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-[fadeIn_0.3s_ease-out]">
                    <span>✓ Rapport généré avec succès!</span>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-txt-primary">Rapports</h1>
                    <p className="text-sm text-txt-secondary">Génération de rapports enterprise-grade</p>
                </div>
                <Button variant="primary" size="sm" icon={<Plus size={16} />} onClick={() => setShowModal(true)}>
                    Nouveau rapport
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Card className="p-4 text-center"><p className="text-xs text-txt-secondary mb-1">Total</p><p className="text-2xl font-bold text-txt-primary">{reports.length}</p></Card>
                <Card className="p-4 text-center"><p className="text-xs text-txt-secondary mb-1">Ce mois</p><p className="text-2xl font-bold text-accent-blue">2</p></Card>
                <Card className="p-4 text-center"><p className="text-xs text-txt-secondary mb-1">Générés</p><p className="text-2xl font-bold text-accent-green">{reports.length}</p></Card>
            </div>

            <div className="space-y-3">
                {reports.map((report) => (
                    <Card key={report.id} className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FileText size={24} className="text-amber-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <h3 className="text-sm font-semibold text-txt-primary truncate">{report.name}</h3>
                                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${typeColors[report.type] || typeColors.production}`}>
                                        {report.type === 'multi' ? 'Multi-domaines' : report.type}
                                    </span>
                                </div>
                                <p className="text-xs text-txt-secondary">{report.date} • {report.author}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <Badge status="success">Final</Badge>
                                <Button variant="ghost" size="sm" icon={<Eye size={16} />} onClick={() => setPreviewReport(report)} />
                                <Button variant="secondary" size="sm" icon={<Download size={16} />} onClick={() => generatePDF({
                                    dateFrom: '2026-01-01', dateTo: '2026-01-07', viewType: 'summary', orientation: 'portrait',
                                    production: { volumes: true, purity: false, teams: false },
                                    finances: { opex: true, costPerGram: false },
                                    hr: { hours: false, incidents: false },
                                })}>
                                    PDF
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Advanced Report Generator Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Générer un Nouveau Rapport">
                <div className="p-4 space-y-5 max-h-[70vh] overflow-y-auto">
                    {/* Date Range */}
                    <div>
                        <label className="block text-sm font-semibold text-txt-primary mb-2">Période</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {[
                                { key: 'today', label: "Aujourd'hui" },
                                { key: 'week', label: 'Cette semaine' },
                                { key: 'month', label: 'Ce mois' },
                                { key: 'lastMonth', label: 'Mois dernier' },
                            ].map((s) => (
                                <button key={s.key} onClick={() => applyShortcut(s.key)} className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-txt-secondary">
                                    {s.label}
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-txt-secondary mb-1">Du</label>
                                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-xs text-txt-secondary mb-1">Au</label>
                                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg" />
                            </div>
                        </div>
                    </div>

                    {/* View Type */}
                    <div>
                        <label className="block text-sm font-semibold text-txt-primary mb-2">Type de Vue</label>
                        <div className="flex gap-2">
                            <button onClick={() => setViewType('summary')} className={`flex-1 py-2 text-sm rounded-lg border ${viewType === 'summary' ? 'bg-accent-blue text-white border-accent-blue' : 'border-gray-200 text-txt-secondary'}`}>
                                Synthèse (KPIs)
                            </button>
                            <button onClick={() => setViewType('detail')} className={`flex-1 py-2 text-sm rounded-lg border ${viewType === 'detail' ? 'bg-accent-blue text-white border-accent-blue' : 'border-gray-200 text-txt-secondary'}`}>
                                Détail (Jour/Jour)
                            </button>
                        </div>
                    </div>

                    {/* Content Modules */}
                    <div>
                        <label className="block text-sm font-semibold text-txt-primary mb-2">Données à inclure</label>
                        <div className="space-y-3">
                            {/* Production */}
                            <div className="bg-blue-50 rounded-lg p-3">
                                <h4 className="text-xs font-semibold text-blue-700 mb-2">PRODUCTION</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={prodVolumes} onChange={(e) => setProdVolumes(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-accent-blue" />
                                        <span className="text-sm text-txt-primary">Volumes & Tonnage</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={prodPurity} onChange={(e) => setProdPurity(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-accent-blue" />
                                        <span className="text-sm text-txt-primary">Pureté & Qualité</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={prodTeams} onChange={(e) => setProdTeams(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-accent-blue" />
                                        <span className="text-sm text-txt-primary">Performance par Équipe</span>
                                    </label>
                                </div>
                            </div>

                            {/* Finances */}
                            <div className="bg-green-50 rounded-lg p-3">
                                <h4 className="text-xs font-semibold text-green-700 mb-2">FINANCES</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={finOpex} onChange={(e) => setFinOpex(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-accent-green" />
                                        <span className="text-sm text-txt-primary">Dépenses Opérationnelles (OpEx)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={finCost} onChange={(e) => setFinCost(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-accent-green" />
                                        <span className="text-sm text-txt-primary">Coût de revient par gramme</span>
                                    </label>
                                </div>
                            </div>

                            {/* RH */}
                            <div className="bg-orange-50 rounded-lg p-3">
                                <h4 className="text-xs font-semibold text-orange-700 mb-2">RH & SÉCURITÉ</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={hrHours} onChange={(e) => setHrHours(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-accent-orange" />
                                        <span className="text-sm text-txt-primary">Heures travaillées & Absentéisme</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={hrIncidents} onChange={(e) => setHrIncidents(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-accent-orange" />
                                        <span className="text-sm text-txt-primary">Journal des Incidents</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Orientation */}
                    <div>
                        <label className="block text-sm font-semibold text-txt-primary mb-2">Mise en page</label>
                        <div className="flex gap-2">
                            <button onClick={() => setOrientation('portrait')} className={`flex-1 py-2 text-sm rounded-lg border ${orientation === 'portrait' ? 'bg-gray-900 text-white' : 'border-gray-200 text-txt-secondary'}`}>
                                Portrait
                            </button>
                            <button onClick={() => setOrientation('landscape')} className={`flex-1 py-2 text-sm rounded-lg border ${orientation === 'landscape' ? 'bg-gray-900 text-white' : 'border-gray-200 text-txt-secondary'}`}>
                                Paysage
                            </button>
                        </div>
                    </div>

                    {/* Format */}
                    <div>
                        <label className="block text-sm font-semibold text-txt-primary mb-2">Format d'export</label>
                        <div className="flex gap-2">
                            {[
                                { key: 'pdf', icon: FileText, label: 'PDF' },
                                { key: 'csv', icon: FileSpreadsheet, label: 'CSV' },
                                { key: 'excel', icon: FileType, label: 'Excel' },
                            ].map((f) => (
                                <button key={f.key} onClick={() => setFormat(f.key as any)} className={`flex-1 py-2 text-sm rounded-lg border flex items-center justify-center gap-2 ${format === f.key ? 'bg-amber-500 text-white border-amber-500' : 'border-gray-200 text-txt-secondary'}`}>
                                    <f.icon size={16} />
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <Button variant="secondary" fullWidth onClick={() => setShowModal(false)}>Annuler</Button>
                        <Button variant="primary" fullWidth icon={<Download size={16} />} onClick={handleGenerate}>Générer le rapport</Button>
                    </div>
                </div>
            </Modal>

            {/* Preview Modal */}
            <Modal isOpen={!!previewReport} onClose={() => setPreviewReport(null)} title={previewReport?.name || ''}>
                {previewReport && (
                    <div className="p-6">
                        <div className="bg-gray-50 rounded-lg p-4 text-sm text-txt-secondary mb-4">
                            <p className="mb-2">Ce rapport contient les données de la période spécifiée.</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Production totale: 2,500g</li>
                                <li>Heures travaillées: 144h</li>
                                <li>Dépenses: $5,900</li>
                            </ul>
                        </div>
                        <Button variant="primary" fullWidth icon={<Download size={16} />} onClick={() => {
                            generatePDF({
                                dateFrom: '2026-01-01', dateTo: '2026-01-07', viewType: 'summary', orientation: 'portrait',
                                production: { volumes: true, purity: false, teams: false },
                                finances: { opex: true, costPerGram: false },
                                hr: { hours: false, incidents: false },
                            });
                            setPreviewReport(null);
                        }}>
                            Télécharger PDF
                        </Button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Rapports;
