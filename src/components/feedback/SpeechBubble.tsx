import type { ReactNode } from 'react';

type SpeechBubbleProps = {
    children: ReactNode;
    variant?: 'white' | 'gray';
};

export function SpeechBubble({ children, variant = 'white' }: SpeechBubbleProps) {
    const containerClass =
        variant === 'gray' ? 'bg-black-800 text-white-default' : 'bg-white-default text-black-800';
    const tailClass = variant === 'gray' ? 'border-t-black-800' : 'border-t-white-default';

    return (
        <div className="drop-shadow-bubble relative inline-flex">
            <p
                className={`rounded-full px-16 py-8 text-center text-xs font-medium tracking-tight whitespace-nowrap ${containerClass}`}
            >
                {children}
            </p>
            <span
                aria-hidden
                className={`absolute -bottom-6 left-1/2 size-0 -translate-x-1/2 border-x-6 border-t-8 border-x-transparent ${tailClass}`}
            />
        </div>
    );
}
