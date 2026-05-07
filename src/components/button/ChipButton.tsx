import type { ReactNode } from 'react';

type ChipButtonProps = {
    children: ReactNode;
    active?: boolean;
    onClick?: () => void;
};

export function ChipButton({ children, active = false, onClick }: ChipButtonProps) {
    const stateClass = active
        ? 'border border-pink-point bg-pink-light text-pink-point'
        : 'border border-transparent bg-black-200 text-black-700';

    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex h-39 items-center justify-center rounded-full px-14 text-base font-semibold ${stateClass}`}
        >
            {children}
        </button>
    );
}
