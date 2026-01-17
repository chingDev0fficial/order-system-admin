import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import React from 'react';

interface SelectProps {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    name?: string;
    id?: string;
    className?: string;
    disabled?: boolean;
    required?: boolean;
    placeholder?: string;
    options: Array<{ value: string; label: string }>;
}

export function Select({
    value,
    onChange,
    name,
    id,
    className,
    disabled = false,
    required = false,
    placeholder = 'Select an option',
    options,
}: SelectProps) {
    // Check if value exists
    const hasValue = value !== undefined && value !== null && value !== '';

    return (
        <div className="w-full">
            <div className="relative">
                <select
                    value={value}
                    onChange={onChange}
                    name={name}
                    id={id}
                    className={cn(
                        'peer w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm transition-all outline-none',
                        'text-transparent peer-focus:text-gray-700',
                        hasValue ? 'text-gray-700' : 'text-transparent',
                        'focus:border-[#F96901] focus:ring-1 focus:ring-[#F96901]',
                        'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
                        'cursor-pointer pr-10',
                        // Custom scrollbar for dropdown
                        '[&>option]:px-4 [&>option]:py-2',
                        '[&>option:checked]:bg-[#F96901] [&>option:checked]:text-white',
                        '[&>option:hover]:bg-[#FFF5EE]',
                        className,
                    )}
                    disabled={disabled}
                    required={required}
                    style={{
                        // Add custom styles for the dropdown menu
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#F96901 #f3f4f6',
                    }}
                >
                    <option value="" disabled hidden>
                        {placeholder}
                    </option>
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="py-2 text-gray-700 checked:bg-[#F96901] checked:text-white hover:bg-[#FFF5EE]"
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    className={cn(
                        'pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#F96901] transition-transform',
                        hasValue && 'rotate-180',
                    )}
                    size={20}
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
                    )}
                >
                    {placeholder}
                </label>
            </div>

            {/* Add global style for better dropdown appearance */}
            <style>{`
                select option {
                    padding: 8px 12px;
                    background-color: white;
                    color: #374151;
                }
                select option:hover {
                    background-color: #fff5ee;
                }
                select option:checked {
                    background-color: #f96901;
                    color: white;
                }
            `}</style>
        </div>
    );
}
