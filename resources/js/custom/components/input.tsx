import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';

interface InputProps {
    type?: string;
    icon?: React.ReactNode;
    placeholder?: string;
    value?: any;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
    id?: string;
    className?: string;
    disabled?: boolean;
    required?: boolean;
}

interface CheckboxProps {
    checked?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
    id?: string;
    className?: string;
    disabled?: boolean;
    required?: boolean;
    label?: string;
}

function PasswordInput({
    icon,
    placeholder,
    value,
    onChange,
    name,
    id,
    className,
    disabled = false,
    required = false,
}: InputProps) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Check if value exists (for both string and number)
    const hasValue = value !== undefined && value !== null && value !== '';

    return (
        <div className="w-full">
            <div className="relative">
                {icon && (
                    <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-[#F96901]">
                        {icon}
                    </span>
                )}
                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={value}
                        onChange={onChange}
                        name={name}
                        id={id}
                        className={cn(
                            'peer w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm transition-all outline-none',
                            'placeholder-transparent',
                            'focus:border-[#F96901] focus:ring-1 focus:ring-[#F96901]',
                            'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
                            icon ? 'pl-10' : '',
                            'pr-10',
                            className,
                        )}
                        placeholder={placeholder}
                        disabled={disabled}
                        required={required}
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-700"
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5 text-[#F96901]" />
                        ) : (
                            <Eye className="h-5 w-5 text-[#F96901]" />
                        )}
                    </button>
                    <label
                        htmlFor={id}
                        className={cn(
                            'pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-gray-500 transition-all',
                            'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm',
                            'peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:bg-white peer-focus:px-1 peer-focus:text-xs peer-focus:text-[#F96901]',
                            hasValue
                                ? 'top-0 -translate-y-1/2 bg-white px-1 text-xs'
                                : '',
                            icon ? 'left-10' : '',
                        )}
                    >
                        {placeholder}
                    </label>
                </div>
            </div>
        </div>
    );
}

export function Checkbox({
    checked,
    onChange,
    name,
    id,
    className,
    disabled = false,
    required = false,
    label,
}: CheckboxProps) {
    return (
        <div className="flex items-center gap-2">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                name={name}
                id={id}
                style={{ accentColor: '#F96901' }}
                className={cn(
                    'h-4 w-4 cursor-pointer rounded border-2 border-gray-300 transition-all',
                    'peer-checked:border-[#F96901] peer-checked:bg-[#F96901]',
                    'peer-focus:ring-2 peer-focus:ring-[#F96901]/20',
                    'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
                    'flex items-center justify-center',
                    className,
                )}
                disabled={disabled}
                required={required}
            />
            {label && (
                <label
                    htmlFor={id}
                    className={cn(
                        'cursor-pointer text-sm text-gray-700 select-none',
                        disabled && 'cursor-not-allowed opacity-50',
                    )}
                >
                    {label}
                </label>
            )}
        </div>
    );
}

export function Input({
    type = 'text',
    icon,
    placeholder,
    value,
    onChange,
    name,
    id,
    className,
    disabled = false,
    required = false,
}: InputProps) {
    if (type === 'password')
        return (
            <PasswordInput
                icon={icon}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                name={name}
                id={id}
                className={className}
                disabled={disabled}
                required={required}
            />
        );

    // Check if value exists (for both string and number)
    const hasValue = value !== undefined && value !== null && value !== '';

    return (
        <div className="w-full">
            <div className="relative">
                {icon && (
                    <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-[#F96901]">
                        {icon}
                    </span>
                )}
                <div className="relative">
                    <input
                        type={type}
                        value={value}
                        onChange={onChange}
                        name={name}
                        id={id}
                        className={cn(
                            'peer w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm transition-all outline-none',
                            'placeholder-transparent',
                            'focus:border-[#F96901] focus:ring-1 focus:ring-[#F96901]',
                            'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
                            icon ? 'pl-10' : '',
                            className,
                        )}
                        placeholder={placeholder}
                        disabled={disabled}
                        required={required}
                    />
                    <label
                        htmlFor={id}
                        className={cn(
                            'pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-gray-500 transition-all',
                            'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm',
                            'peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:bg-white peer-focus:px-1 peer-focus:text-xs peer-focus:text-[#F96901]',
                            hasValue
                                ? 'top-0 -translate-y-1/2 bg-white px-1 text-xs'
                                : '',
                            icon ? 'left-10' : '',
                        )}
                    >
                        {placeholder}
                    </label>
                </div>
            </div>
        </div>
    );
}