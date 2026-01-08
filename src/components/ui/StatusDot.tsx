import React from 'react';

export type StatusType = 'commande' | 'en_cours' | 'livre' | 'en_attente' | 'approuve' | 'rejete';

interface StatusDotProps {
    status: StatusType;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const statusColors: Record<StatusType, string> = {
    commande: 'bg-blue-500',
    en_cours: 'bg-amber-400',
    livre: 'bg-green-500',
    en_attente: 'bg-amber-400',
    approuve: 'bg-green-500',
    rejete: 'bg-red-500',
};

const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
};

export const StatusDot: React.FC<StatusDotProps> = ({ status, size = 'sm', className = '' }) => {
    return (
        <span
            className={`
                inline-block rounded-full flex-shrink-0
                ${statusColors[status] || 'bg-gray-400'}
                ${sizeClasses[size]}
                ${className}
            `}
        />
    );
};

// Status Badge with Dot (for tables)
interface StatusBadgeProps {
    status: StatusType;
    label: string;
}

const badgeStyles: Record<StatusType, string> = {
    commande: 'bg-blue-50 text-blue-700',
    en_cours: 'bg-amber-50 text-amber-700',
    livre: 'bg-green-50 text-green-700',
    en_attente: 'bg-amber-50 text-amber-700',
    approuve: 'bg-green-50 text-green-700',
    rejete: 'bg-red-50 text-red-700',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
    return (
        <span className={`
            inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
            ${badgeStyles[status] || 'bg-gray-50 text-gray-700'}
        `}>
            <StatusDot status={status} size="sm" />
            {label}
        </span>
    );
};

export default StatusDot;
