import type { ReactNode } from 'react';

type SpeechBubbleProps = {
    children: ReactNode;
    variant?: 'white' | 'black';
};

export function SpeechBubble({ children, variant = 'white' }: SpeechBubbleProps) {
    const stateClass =
        variant === 'black'
            ? 'bg-black-800 text-white-default'
            : 'bg-white-default text-black-800';

    return (
        <div
            className={`inline-flex items-center justify-center rounded-12 px-16 py-12 text-xs font-medium shadow-md ${stateClass}`}
        >
            {children}
        </div>
    );
}
