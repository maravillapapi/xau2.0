import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'superviseur' | 'travailleur';

type ModuleKey = 'dashboard' | 'pointage' | 'production' | 'personnel' | 'inventaire' | 'analytiques' | 'rapports' | 'achats' | 'depenses' | 'parametres' | 'admin';

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    team?: 'A' | 'B';
}

// Default permissions matrix
const defaultPermissions: Record<UserRole, ModuleKey[]> = {
    admin: ['dashboard', 'pointage', 'production', 'personnel', 'inventaire', 'analytiques', 'rapports', 'achats', 'depenses', 'parametres', 'admin'],
    superviseur: ['dashboard', 'pointage', 'production', 'personnel', 'inventaire', 'analytiques', 'rapports'],
    travailleur: ['dashboard', 'pointage', 'production'],
};

interface AuthContextType {
    user: User;
    role: UserRole;
    impersonatedRole: UserRole | null;
    effectiveRole: UserRole;
    isSimulating: boolean;
    permissions: Record<UserRole, ModuleKey[]>;
    setImpersonatedRole: (role: UserRole | null) => void;
    canAccess: (module: ModuleKey) => boolean;
    canEdit: () => boolean;
    canDelete: () => boolean;
    updatePermissions: (role: UserRole, modules: ModuleKey[]) => void;
    hasPermission: (module: ModuleKey) => boolean;
}

const defaultUser: User = {
    id: 'usr-001',
    name: 'Administrateur Principal',
    email: 'admin@minedor.cd',
    role: 'admin',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user] = useState<User>(defaultUser);
    const [impersonatedRole, setImpersonatedRole] = useState<UserRole | null>(null);
    const [permissions, setPermissions] = useState<Record<UserRole, ModuleKey[]>>(() => {
        const saved = localStorage.getItem('permissions');
        return saved ? JSON.parse(saved) : defaultPermissions;
    });

    useEffect(() => {
        localStorage.setItem('permissions', JSON.stringify(permissions));
    }, [permissions]);

    const effectiveRole = impersonatedRole || user.role;
    const isSimulating = impersonatedRole !== null;

    const canAccess = (module: ModuleKey): boolean => {
        if (user.role === 'admin' && !isSimulating) return true;
        return permissions[effectiveRole]?.includes(module) ?? false;
    };

    const hasPermission = (module: ModuleKey): boolean => canAccess(module);
    const canEdit = (): boolean => effectiveRole === 'admin' || effectiveRole === 'superviseur';
    const canDelete = (): boolean => effectiveRole === 'admin';

    const updatePermissions = (role: UserRole, modules: ModuleKey[]) => {
        setPermissions(prev => ({ ...prev, [role]: modules }));
    };

    return (
        <AuthContext.Provider value={{
            user, role: user.role, impersonatedRole, effectiveRole, isSimulating,
            permissions, setImpersonatedRole, canAccess, canEdit, canDelete,
            updatePermissions, hasPermission
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const usePermission = (module: ModuleKey) => {
    const { canAccess, canEdit, canDelete, effectiveRole } = useAuth();
    return {
        canView: canAccess(module),
        canEdit: canEdit(),
        canDelete: canDelete(),
        role: effectiveRole,
    };
};
