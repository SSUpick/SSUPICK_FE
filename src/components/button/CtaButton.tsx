import type { ReactNode } from 'react';

import { SpinnerIcon } from '@/components/icon/SpinnerIcon';

type CtaButtonProps = {
    children: ReactNode;
    disabled?: boolean;
    loading?: boolean;
    variant?: 'primary' | 'secondary';
    onClick?: () => void;
    type?: 'button' | 'submit';
    className?: string;
};

export function CtaButton({
    children,
    disabled = false,
    loading = false,
    variant = 'primary',
    onClick,
    type = 'button',
    className,
}: CtaButtonProps) {
    const stateClass = loading
        ? 'bg-pink-default/70 text-white-default'
        : disabled
          ? 'bg-black-300 text-black-400'
          : variant === 'secondary'
            ? 'bg-green-muted text-green-dark'
            : 'bg-pink-default text-white-default';

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`rounded-14 flex h-58 items-center justify-center text-lg font-semibold ${stateClass} ${className ?? ''}`}
        >
            {loading ? (
                <span className="flex items-center justify-center gap-8">
                    <SpinnerIcon className="size-20" />
                    {children}
                </span>
            ) : (
                children
            )}
        </button>
    );
}
