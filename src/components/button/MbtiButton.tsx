import type { ReactNode } from 'react';

type MbtiButtonProps = {
    children: ReactNode;
    active?: boolean;
    onClick?: () => void;
};

export function MbtiButton({ children, active = false, onClick }: MbtiButtonProps) {
    const stateClass = active
        ? 'bg-pink-light text-pink-point'
        : 'bg-black-200 text-black-700';

    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex h-39 w-38 items-center justify-center rounded-full text-base font-semibold ${stateClass}`}
        >
            {children}
        </button>
    );
}
