import React from 'react';

interface AvatarProps {
    name: string;
    size?: 'sm' | 'md' | 'lg';
    src?: string;
}

const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-lg',  // Standardized to 48px
    lg: 'w-16 h-16 text-xl',
};

const getInitials = (name: string): string => {
    const words = name.trim().split(' ');
    if (words.length >= 2) {
        return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
};

const getGradient = (name: string): string => {
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const gradients = [
        'from-amber-400 to-amber-600',
        'from-blue-400 to-blue-600',
        'from-green-400 to-green-600',
        'from-purple-400 to-purple-600',
        'from-pink-400 to-pink-600',
        'from-cyan-400 to-cyan-600',
        'from-orange-400 to-orange-600',
        'from-indigo-400 to-indigo-600',
    ];
    return gradients[hash % gradients.length];
};

export const Avatar: React.FC<AvatarProps> = ({ name, size = 'md', src }) => {
    const sizeClass = sizeClasses[size];
    const gradient = getGradient(name);
    const initials = getInitials(name);

    if (src) {
        return (
            <img
                src={src}
                alt={name}
                className={`${sizeClass} rounded-full object-cover flex-shrink-0`}
            />
        );
    }

    return (
        <div
            className={`${sizeClass} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold flex-shrink-0`}
        >
            {initials}
        </div>
    );
};

export default Avatar;
