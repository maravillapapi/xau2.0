import React from 'react';

type BadgeStatus = 'actif' | 'conge' | 'absent' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
    status: BadgeStatus;
    children: React.ReactNode;
    showDot?: boolean;
    className?: string;
}

const statusStyles: Record<BadgeStatus, { bg: string; text: string; dot: string }> = {
    actif: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-accent-green' },
    conge: { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-accent-gold' },
    absent: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-accent-red' },
    success: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-accent-green' },
    warning: { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-accent-gold' },
    error: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-accent-red' },
    info: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-accent-blue' },
};

export const Badge: React.FC<BadgeProps> = ({
    status,
    children,
    showDot = true,
    className = ''
}) => {
    const styles = statusStyles[status];

    return (
        <span
            className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 
        text-xs font-medium rounded-full
        ${styles.bg} ${styles.text}
        ${className}
      `}
        >
            {showDot && (
                <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
            )}
            {children}
        </span>
    );
};

export default Badge;
