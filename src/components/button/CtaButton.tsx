import type { ReactNode } from 'react';

type CtaButtonProps = {
    children: ReactNode;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
    onClick?: () => void;
    type?: 'button' | 'submit';
    className?: string;
};

export function CtaButton({
    children,
    disabled = false,
    variant = 'primary',
    onClick,
    type = 'button',
    className,
}: CtaButtonProps) {
    const stateClass = disabled
        ? 'bg-black-300 text-black-400'
        : variant === 'secondary'
            ? 'bg-green-muted text-green-dark'
            : 'bg-pink-default text-white-default';

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`flex h-58 items-center justify-center rounded-14 text-lg font-semibold ${stateClass} ${className ?? ''}`}
        >
            {children}
        </button>
    );
}
