import React, { useState, useEffect } from 'react';
import { LogIn, LogOut, Clock, Users, CheckCircle, AlertCircle, Timer } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { useToast } from '../context/ToastContext';

interface TimeSession {
    id: string;
    employeeName: string;
    arrivalTime: string;
    departureTime?: string;
    duration?: string;
    status: 'present' | 'departed' | 'late';
}

interface CurrentUserSession {
    isClockedIn: boolean;
    startTime: number; // timestamp
    sessionId: string;
    arrivalTime: string;
}

const STORAGE_KEY = 'currentUserSession';
const SESSIONS_STORAGE_KEY = 'pointageSessions';

const defaultSessions: TimeSession[] = [
    { id: 'init-1', employeeName: 'Marie Mutombo', arrivalTime: '07:02', departureTime: '15:30', duration: '8h28m', status: 'departed' },
    { id: 'init-2', employeeName: 'Pierre Kasongo', arrivalTime: '08:15', status: 'late' },
];

// Load sessions from localStorage
const loadSessions = (): TimeSession[] => {
    const saved = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch {
            return defaultSessions;
        }
    }
    return defaultSessions;
};

// Load current user session from localStorage
const loadUserSession = (): CurrentUserSession | null => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch {
            return null;
        }
    }
    return null;
};

export const Pointage: React.FC = () => {
    const { showToast } = useToast();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [sessions, setSessions] = useState<TimeSession[]>(loadSessions);
    const [userSession, setUserSession] = useState<CurrentUserSession | null>(loadUserSession);
    const [elapsedTime, setElapsedTime] = useState('00h 00m');

    // Derived state
    const isWorking = userSession?.isClockedIn ?? false;

    // Update clock every second
    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    // Persist sessions to localStorage
    useEffect(() => {
        localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    }, [sessions]);

    // Persist user session to localStorage
    useEffect(() => {
        if (userSession) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userSession));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [userSession]);

    // Update elapsed time when working
    useEffect(() => {
        if (!isWorking || !userSession) return;

        const updateElapsed = () => {
            const diff = Math.floor((Date.now() - userSession.startTime) / 1000);
            const hours = Math.floor(diff / 3600);
            const minutes = Math.floor((diff % 3600) / 60);
            setElapsedTime(`${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`);
        };

        updateElapsed(); // Initial update
        const interval = setInterval(updateElapsed, 1000);
        return () => clearInterval(interval);
    }, [isWorking, userSession]);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    const handleClockIn = () => {
        const now = new Date();
        const time = formatTime(now).slice(0, 5);
        const sessionId = `session-${Date.now()}`;

        // Create user session
        const newUserSession: CurrentUserSession = {
            isClockedIn: true,
            startTime: now.getTime(),
            sessionId,
            arrivalTime: time,
        };
        setUserSession(newUserSession);

        // Add to sessions list
        const newSession: TimeSession = {
            id: sessionId,
            employeeName: 'Vous',
            arrivalTime: time,
            status: 'present',
        };
        setSessions(prev => [newSession, ...prev]);

        showToast(`Bonjour ! Pointage enregistré à ${time}`, 'success');
    };

    const handleClockOut = () => {
        if (!userSession) return;

        const now = new Date();
        const time = formatTime(now).slice(0, 5);

        // Calculate duration
        const diff = Math.floor((now.getTime() - userSession.startTime) / 1000);
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const duration = `${hours}h${String(minutes).padStart(2, '0')}m`;

        // Update session in list
        setSessions(prev => prev.map(s =>
            s.id === userSession.sessionId
                ? { ...s, departureTime: time, duration, status: 'departed' as const }
                : s
        ));

        showToast(`Au revoir ! Durée travaillée : ${duration}`, 'success');

        // Clear user session
        setUserSession(null);
        setElapsedTime('00h 00m');
    };

    const presentCount = sessions.filter(s => s.status === 'present').length;
    const lateCount = sessions.filter(s => s.status === 'late').length;
    const departedCount = sessions.filter(s => s.status === 'departed').length;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div>
                <h1 className="text-xl font-bold text-txt-primary">Pointage</h1>
                <p className="text-sm text-txt-secondary capitalize">{formatDate(currentTime)}</p>
            </div>

            {/* Employee Card + KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {/* Employee Profile */}
                <Card className="p-4 md:col-span-1">
                    <div className="flex md:flex-col items-center gap-3 md:text-center">
                        <Avatar name="Jean Kabongo" size="lg" />
                        <div>
                            <p className="font-semibold text-txt-primary">Jean Kabongo</p>
                            <p className="text-xs text-txt-secondary">Chef d'Équipe A</p>
                            <div className="mt-2">
                                <p className="text-[10px] text-txt-tertiary mb-1">Heures cette semaine</p>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-accent-blue rounded-full" style={{ width: '60%' }} />
                                    </div>
                                    <span className="text-xs font-medium text-txt-primary">24h/40h</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* KPIs */}
                <Card className="p-4 text-center">
                    <Users size={20} className="mx-auto mb-1 text-accent-blue" strokeWidth={1.5} />
                    <p className="text-2xl font-bold text-txt-primary">{presentCount}</p>
                    <p className="text-xs text-txt-secondary">Présents</p>
                </Card>
                <Card className="p-4 text-center">
                    <CheckCircle size={20} className="mx-auto mb-1 text-accent-green" strokeWidth={1.5} />
                    <p className="text-2xl font-bold text-txt-primary">{departedCount}</p>
                    <p className="text-xs text-txt-secondary">Partis</p>
                </Card>
                <Card className="p-4 text-center">
                    <AlertCircle size={20} className="mx-auto mb-1 text-accent-orange" strokeWidth={1.5} />
                    <p className="text-2xl font-bold text-txt-primary">{lateCount}</p>
                    <p className="text-xs text-txt-secondary">Retards</p>
                </Card>
            </div>

            {/* Clock & Action */}
            <Card className="p-6 text-center">
                {/* Elapsed Time (when working) */}
                {isWorking && userSession && (
                    <div className="flex items-center justify-center gap-2 mb-2 text-accent-green">
                        <Timer size={16} />
                        <span className="text-sm font-medium">Temps écoulé: {elapsedTime}</span>
                        <span className="text-xs text-txt-tertiary">(depuis {userSession.arrivalTime})</span>
                    </div>
                )}

                {/* Giant Clock */}
                <div className="text-6xl sm:text-7xl font-bold text-txt-primary font-mono tracking-tight mb-4">
                    {formatTime(currentTime)}
                </div>

                {/* Action Button */}
                {!isWorking ? (
                    <Button
                        variant="success"
                        size="xl"
                        icon={<LogIn size={28} strokeWidth={1.5} />}
                        onClick={handleClockIn}
                        className="w-full max-w-md mx-auto text-xl py-5"
                    >
                        POINTER ARRIVÉE
                    </Button>
                ) : (
                    <div className="relative inline-block w-full max-w-md mx-auto">
                        {/* Pulse Ring Animation */}
                        <div className="absolute inset-0 rounded-xl bg-red-500 animate-ping opacity-20" />
                        <Button
                            variant="danger"
                            size="xl"
                            icon={<LogOut size={28} strokeWidth={1.5} />}
                            onClick={handleClockOut}
                            className="relative w-full text-xl py-5"
                        >
                            POINTER DÉPART
                        </Button>
                    </div>
                )}
            </Card>

            {/* Today's Sessions */}
            <Card className="p-4">
                <h3 className="text-sm font-semibold text-txt-primary mb-3">Activité du Jour</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-2 text-txt-secondary font-medium">Employé</th>
                                <th className="text-center py-2 text-txt-secondary font-medium">Arrivée</th>
                                <th className="text-center py-2 text-txt-secondary font-medium">Départ</th>
                                <th className="text-center py-2 text-txt-secondary font-medium">Durée</th>
                                <th className="text-center py-2 text-txt-secondary font-medium">Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-6 text-center text-txt-tertiary">
                                        <Clock size={32} className="mx-auto mb-2 opacity-50" />
                                        <p>Aucun pointage aujourd'hui</p>
                                    </td>
                                </tr>
                            ) : (
                                sessions.map((session) => (
                                    <tr key={session.id} className="border-b border-gray-50">
                                        <td className="py-3">
                                            <div className="flex items-center gap-2">
                                                <Avatar name={session.employeeName} size="sm" />
                                                <span className={`text-txt-primary font-medium ${session.employeeName === 'Vous' ? 'text-accent-blue' : ''}`}>
                                                    {session.employeeName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="text-center py-3 text-txt-primary">{session.arrivalTime}</td>
                                        <td className="text-center py-3 text-txt-primary">
                                            {session.departureTime || (
                                                <span className="text-accent-green text-xs animate-pulse">En cours...</span>
                                            )}
                                        </td>
                                        <td className="text-center py-3 text-txt-primary">{session.duration || '—'}</td>
                                        <td className="text-center py-3">
                                            <Badge status={
                                                session.status === 'present' ? 'success' :
                                                    session.status === 'late' ? 'warning' : 'info'
                                            }>
                                                {session.status === 'present' ? 'Présent' :
                                                    session.status === 'late' ? 'Retard' : 'Parti'}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Pointage;
