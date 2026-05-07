import type { ReactNode } from 'react';

type OutlineChipButtonProps = {
    children: ReactNode;
    onClick?: () => void;
};

export function OutlineChipButton({ children, onClick }: OutlineChipButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex items-center justify-center rounded-full border border-black-300 bg-white-default px-16 py-6 text-base font-semibold text-black-700"
        >
            {children}
        </button>
    );
}
