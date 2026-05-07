import type { ReactNode } from 'react';
import bubbleWhite from '@/assets/chatBubble_white.svg';
import bubbleGray from '@/assets/chatBubble_gray.svg';

type SpeechBubbleProps = {
    children: ReactNode;
    variant?: 'white' | 'gray';
};

export function SpeechBubble({ children, variant = 'white' }: SpeechBubbleProps) {
    const bubble = variant === 'gray' ? bubbleGray : bubbleWhite;
    const textClass =
        variant === 'gray' ? 'text-white-default' : 'text-black-800';

    return (
        <div className="relative inline-flex">
            <img src={bubble} alt="" aria-hidden className="block h-50 w-auto" />
            <p
                className={`absolute inset-x-16 top-8 text-center text-xs font-medium ${textClass}`}
            >
                {children}
            </p>
        </div>
    );
}
