import { cn } from '@/lib/utils';
import React from 'react';

interface TextAreaProps {
    icon?: React.ReactNode;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    name?: string;
    id?: string;
    className?: string;
    disabled?: boolean;
    required?: boolean;
    rows?: number;
    maxLength?: number;
    showCharCount?: boolean;
}

export function TextArea({
    icon,
    placeholder,
    value,
    onChange,
    name,
    id,
    className,
    disabled = false,
    required = false,
    rows = 4,
    maxLength,
    showCharCount = false,
}: TextAreaProps) {
    const currentLength = value?.length || 0;

    return (
        <div className="w-full">
            <div className="relative">
                {icon && (
                    <span className="absolute top-4 left-3 z-10 text-[#F96901]">
                        {icon}
                    </span>
                )}
                <div className="relative">
                    <textarea
                        value={value}
                        onChange={onChange}
                        name={name}
                        id={id}
                        rows={rows}
                        maxLength={maxLength}
                        className={cn(
                            'peer w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm transition-all outline-none',
                            'placeholder-transparent',
                            'focus:border-[#F96901] focus:ring-1 focus:ring-[#F96901]',
                            'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
                            icon ? 'pl-10' : '',
                            showCharCount && maxLength ? 'pb-8' : '',
                            className,
                        )}
                        placeholder={placeholder}
                        disabled={disabled}
                        required={required}
                    />
                    <label
                        htmlFor={id}
                        className={cn(
                            'pointer-events-none absolute top-4 left-4 text-sm text-gray-500 transition-all',
                            'peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm',
                            'peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:bg-white peer-focus:px-1 peer-focus:text-xs peer-focus:text-[#F96901]',
                            value && value.length > 0
                                ? 'top-0 -translate-y-1/2 bg-white px-1 text-xs'
                                : '',
                            icon ? 'left-10' : '',
                        )}
                    >
                        {placeholder}
                    </label>
                    {showCharCount && maxLength && (
                        <div
                            className={cn(
                                'absolute right-3 bottom-2 text-xs',
                                currentLength >= maxLength
                                    ? 'text-red-500'
                                    : 'text-gray-400',
                            )}
                        >
                            {currentLength}/{maxLength}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
