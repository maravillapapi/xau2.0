import React from 'react';

interface ProgressBarProps {
    value: number;
    max?: number;
    label?: string;
    showPercentage?: boolean;
    size?: 'sm' | 'md' | 'lg';
    color?: 'blue' | 'green' | 'red' | 'orange' | 'purple';
    className?: string;
}

const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
};

const colorStyles = {
    blue: 'from-blue-500 to-blue-400',
    green: 'from-green-500 to-green-400',
    red: 'from-red-500 to-red-400',
    orange: 'from-orange-500 to-orange-400',
    purple: 'from-purple-500 to-purple-400',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
    value,
    max = 100,
    label,
    showPercentage = true,
    size = 'md',
    color = 'blue',
    className = '',
}) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div className={className}>
            {(label || showPercentage) && (
                <div className="flex justify-between items-center mb-2">
                    {label && (
                        <span className="text-sm text-txt-secondary">{label}</span>
                    )}
                    {showPercentage && (
                        <span className="text-sm font-medium text-txt-primary">
                            {Math.round(percentage)}%
                        </span>
                    )}
                </div>
            )}
            <div className={`w-full ${sizeStyles[size]} bg-gray-200 rounded-full overflow-hidden`}>
                <div
                    className={`
            h-full bg-gradient-to-r ${colorStyles[color]}
            rounded-full transition-all duration-600 ease-out
          `}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
