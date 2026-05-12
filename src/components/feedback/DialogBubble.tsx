import type { ReactNode } from 'react';

type DialogBubbleProps = {
    children: ReactNode;
};

export function DialogBubble({ children }: DialogBubbleProps) {
    return (
        <div className="dialog-bubble-gradient-border text-black-800 backdrop-blur-bubble rounded-14 flex h-75 w-full items-center justify-center px-20 text-center text-lg leading-22 font-medium tracking-tight">
            {children}
        </div>
    );
}
