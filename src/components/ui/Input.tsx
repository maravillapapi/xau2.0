import React from 'react';
import { ChevronDown } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    className = '',
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-xs font-medium text-txt-secondary uppercase tracking-wide mb-1.5">
                    {label}
                </label>
            )}
            <input
                className={`
          w-full px-4 py-3 bg-gray-50 rounded-xl
          text-sm text-txt-primary placeholder:text-txt-tertiary
          border-0 outline-none
          focus:ring-2 focus:ring-accent-blue focus:bg-white
          transition-all duration-200
          ${error ? 'ring-2 ring-accent-red' : ''}
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-xs text-accent-red">{error}</p>
            )}
        </div>
    );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: { value: string; label: string }[];
    error?: string;
}

export const Select: React.FC<SelectProps> = ({
    label,
    options,
    error,
    className = '',
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-xs font-medium text-txt-secondary uppercase tracking-wide mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    className={`
            w-full px-4 py-3 bg-gray-50 rounded-xl
            text-sm text-txt-primary
            border-0 outline-none appearance-none
            focus:ring-2 focus:ring-accent-blue focus:bg-white
            transition-all duration-200
            ${error ? 'ring-2 ring-accent-red' : ''}
            ${className}
          `}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    size={16}
                    strokeWidth={1.5}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-txt-tertiary pointer-events-none"
                />
            </div>
            {error && (
                <p className="mt-1 text-xs text-accent-red">{error}</p>
            )}
        </div>
    );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
    label,
    error,
    className = '',
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-xs font-medium text-txt-secondary uppercase tracking-wide mb-1.5">
                    {label}
                </label>
            )}
            <textarea
                className={`
          w-full px-4 py-3 bg-gray-50 rounded-xl
          text-sm text-txt-primary placeholder:text-txt-tertiary
          border-0 outline-none resize-none
          focus:ring-2 focus:ring-accent-blue focus:bg-white
          transition-all duration-200 min-h-[100px]
          ${error ? 'ring-2 ring-accent-red' : ''}
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-xs text-accent-red">{error}</p>
            )}
        </div>
    );
};

export default Input;
