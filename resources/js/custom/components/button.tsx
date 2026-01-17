import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                primary:
                    'bg-[#F96901] text-white shadow-sm hover:bg-[#E05E01] focus:ring-2 focus:ring-[#F96901]/30 active:bg-[#D75501]',
                secondary:
                    'bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200 focus:ring-2 focus:ring-gray-400/30 active:bg-gray-300',
                outline:
                    'border-2 border-[#F96901] text-[#F96901] bg-white hover:bg-[#F96901]/5 focus:ring-2 focus:ring-[#F96901]/30 active:bg-[#F96901]/10',
                ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-400/30',
                destructive:
                    'bg-red-600 text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-600/30 active:bg-red-800',
                link: 'text-[#F96901] underline-offset-4 hover:underline hover:text-[#E05E01]',
            },
            size: {
                sm: 'h-8 px-3 py-1.5 text-xs rounded-md has-[>svg]:px-2',
                default: 'h-10 px-4 py-2.5 has-[>svg]:px-3',
                lg: 'h-12 px-6 py-3 text-base has-[>svg]:px-4',
                icon: 'size-10',
                'icon-sm': 'size-8',
            },
            fullWidth: {
                true: 'w-full',
                false: 'w-auto',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'default',
            fullWidth: false,
        },
    },
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export function Button({
    className,
    variant,
    size,
    fullWidth,
    disabled,
    loading = false,
    leftIcon,
    rightIcon,
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                buttonVariants({ variant, size, fullWidth, className }),
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <svg
                    className="animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {!loading && leftIcon && (
                <span className="inline-flex">{leftIcon}</span>
            )}
            {children}
            {!loading && rightIcon && (
                <span className="inline-flex">{rightIcon}</span>
            )}
        </button>
    );
}
