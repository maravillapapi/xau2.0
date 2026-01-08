import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    icon?: React.ReactNode;
    fullWidth?: boolean;
    children?: React.ReactNode;
}

const variants = {
    primary: 'bg-accent-blue hover:bg-blue-600 text-white shadow-sm',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-txt-primary',
    ghost: 'hover:bg-gray-100 text-txt-secondary',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm',
    success: 'bg-green-500 hover:bg-green-600 text-white shadow-sm',
};

const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2',
    xl: 'px-8 py-4 text-lg gap-3',
};

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    icon,
    fullWidth = false,
    children,
    className = '',
    disabled,
    ...props
}) => {
    return (
        <button
            className={`
        inline-flex items-center justify-center font-medium rounded-xl transition-colors
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
            disabled={disabled}
            {...props}
        >
            {icon}
            {children}
        </button>
    );
};

export default Button;
