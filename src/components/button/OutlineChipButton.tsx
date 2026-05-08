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
            className="border-black-300 bg-white-default text-black-700 flex items-center justify-center rounded-full border px-16 py-6 text-base font-semibold"
        >
            {children}
        </button>
    );
}
