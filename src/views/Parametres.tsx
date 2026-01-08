import React, { useState, useRef } from 'react';
import { Bell, Shield, Globe, Moon, User, Upload, Building } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useSiteConfig } from '../context/SiteConfigContext';
import { useAuth } from '../context/AuthContext';

interface ToggleProps { enabled: boolean; onChange: (val: boolean) => void; }
const Toggle: React.FC<ToggleProps> = ({ enabled, onChange }) => (
    <button onClick={() => onChange(!enabled)} className={`w-11 h-6 rounded-full transition-colors relative ${enabled ? 'bg-accent-blue' : 'bg-gray-300'}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-5' : ''}`} />
    </button>
);

export const Parametres: React.FC = () => {
    const { config, updateConfig } = useSiteConfig();
    const { effectiveRole, setImpersonatedRole, impersonatedRole } = useAuth();
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [twoFactor, setTwoFactor] = useState(false);
    const [appName, setAppName] = useState(config.appName);
    const [appSubtitle, setAppSubtitle] = useState(config.appSubtitle);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateConfig({ appLogo: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveIdentity = () => {
        updateConfig({ appName, appSubtitle });
        alert('Configuration sauvegardée !');
    };

    return (
        <div className="space-y-4 max-w-2xl">
            <div><h1 className="text-xl font-bold text-txt-primary">Paramètres</h1><p className="text-sm text-txt-secondary">Configuration de l'application</p></div>

            {/* Site Identity (Admin only) */}
            {effectiveRole === 'admin' && (
                <Card className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center"><Building size={16} className="text-amber-600" /></div>
                        <h2 className="text-sm font-semibold text-txt-primary">Identité du Projet</h2>
                    </div>
                    <div className="space-y-4">
                        <Input label="Nom du site" value={appName} onChange={(e) => setAppName(e.target.value)} />
                        <Input label="Sous-titre" value={appSubtitle} onChange={(e) => setAppSubtitle(e.target.value)} />
                        <div>
                            <label className="block text-sm font-medium text-txt-secondary mb-1">Logo</label>
                            <div className="flex items-center gap-3">
                                {config.appLogo ? (
                                    <img src={config.appLogo} alt="Logo" className="w-12 h-12 rounded-xl object-cover" />
                                ) : (
                                    <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center text-txt-tertiary">?</div>
                                )}
                                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleLogoUpload} className="hidden" />
                                <Button variant="secondary" size="sm" icon={<Upload size={14} />} onClick={() => fileInputRef.current?.click()}>
                                    Changer
                                </Button>
                            </div>
                        </div>
                        <Button variant="primary" onClick={handleSaveIdentity}>Enregistrer</Button>
                    </div>
                </Card>
            )}

            {/* Impersonation (Admin only) */}
            {effectiveRole === 'admin' && (
                <Card className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center"><User size={16} className="text-purple-600" /></div>
                        <h2 className="text-sm font-semibold text-txt-primary">Voir en tant que</h2>
                    </div>
                    <div className="flex gap-2">
                        {(['admin', 'superviseur', 'travailleur'] as const).map((role) => (
                            <button
                                key={role}
                                onClick={() => setImpersonatedRole(role === 'admin' ? null : role)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${(impersonatedRole === role || (role === 'admin' && !impersonatedRole))
                                    ? 'bg-accent-blue text-white'
                                    : 'bg-gray-100 text-txt-secondary hover:bg-gray-200'
                                    }`}
                            >
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                            </button>
                        ))}
                    </div>
                </Card>
            )}

            {/* General */}
            <Card className="p-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><Globe size={16} className="text-blue-600" /></div>
                    <h2 className="text-sm font-semibold text-txt-primary">Général</h2>
                </div>
                <div className="space-y-4">
                    <Input label="Fuseau horaire" defaultValue="Africa/Lubumbashi (UTC+2)" />
                    <Input label="Devise" defaultValue="USD ($)" />
                </div>
            </Card>

            {/* Notifications */}
            <Card className="p-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center"><Bell size={16} className="text-orange-600" /></div>
                    <h2 className="text-sm font-semibold text-txt-primary">Notifications</h2>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between"><span className="text-sm text-txt-secondary">Notifications push</span><Toggle enabled={notifications} onChange={setNotifications} /></div>
                    <div className="flex items-center justify-between"><span className="text-sm text-txt-secondary">Alertes email</span><Toggle enabled={true} onChange={() => { }} /></div>
                </div>
            </Card>

            {/* Appearance */}
            <Card className="p-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center"><Moon size={16} className="text-purple-600" /></div>
                    <h2 className="text-sm font-semibold text-txt-primary">Apparence</h2>
                </div>
                <div className="flex items-center justify-between"><span className="text-sm text-txt-secondary">Mode sombre</span><Toggle enabled={darkMode} onChange={setDarkMode} /></div>
            </Card>

            {/* Chart Style Preference */}
            <Card className="p-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                    </div>
                    <h2 className="text-sm font-semibold text-txt-primary">Style des Graphiques</h2>
                </div>
                <p className="text-xs text-txt-tertiary mb-4">Choisissez le type de graphique par défaut pour toute l'application.</p>
                <div className="grid grid-cols-2 gap-3">
                    {/* Courbes Option */}
                    <button
                        onClick={() => updateConfig({ chartPreference: 'curve' })}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${config.chartPreference === 'curve'
                            ? 'border-accent-blue bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={config.chartPreference === 'curve' ? 'text-accent-blue' : 'text-txt-tertiary'}>
                                <path d="M2 12C2 12 5 4 12 4C19 4 22 12 22 12C22 12 19 20 12 20C5 20 2 12 2 12Z" stroke="currentColor" strokeWidth="2" fill="none" />
                                <polyline points="3 18 7 14 11 16 15 10 21 6" stroke="currentColor" strokeWidth="2" fill="none" />
                            </svg>
                            <span className={`text-sm font-medium ${config.chartPreference === 'curve' ? 'text-accent-blue' : 'text-txt-primary'}`}>
                                Courbes & Tendances
                            </span>
                        </div>
                        <p className="text-xs text-txt-tertiary">Idéal pour voir l'évolution dans le temps</p>
                        {config.chartPreference === 'curve' && (
                            <div className="mt-2 text-xs font-medium text-accent-blue">✓ Sélectionné</div>
                        )}
                    </button>

                    {/* Barres Option */}
                    <button
                        onClick={() => updateConfig({ chartPreference: 'bar' })}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${config.chartPreference === 'bar'
                            ? 'border-accent-blue bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={config.chartPreference === 'bar' ? 'text-accent-blue' : 'text-txt-tertiary'}>
                                <rect x="3" y="12" width="4" height="8" rx="1" stroke="currentColor" strokeWidth="2" />
                                <rect x="10" y="6" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="2" />
                                <rect x="17" y="9" width="4" height="11" rx="1" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            <span className={`text-sm font-medium ${config.chartPreference === 'bar' ? 'text-accent-blue' : 'text-txt-primary'}`}>
                                Bâtons & Volumes
                            </span>
                        </div>
                        <p className="text-xs text-txt-tertiary">Idéal pour comparer les quantités</p>
                        {config.chartPreference === 'bar' && (
                            <div className="mt-2 text-xs font-medium text-accent-blue">✓ Sélectionné</div>
                        )}
                    </button>
                </div>
            </Card>

            {/* Security */}
            <Card className="p-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center"><Shield size={16} className="text-red-600" /></div>
                    <h2 className="text-sm font-semibold text-txt-primary">Sécurité</h2>
                </div>
                <div className="flex items-center justify-between"><span className="text-sm text-txt-secondary">Authentification 2FA</span><Toggle enabled={twoFactor} onChange={setTwoFactor} /></div>
            </Card>
        </div>
    );
};

export default Parametres;
