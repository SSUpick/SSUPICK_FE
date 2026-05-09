import type { ReactNode } from 'react';

type DialogBubbleProps = {
    children: ReactNode;
};

export function DialogBubble({ children }: DialogBubbleProps) {
    return (
        <div className="rounded-14 border-white-default bg-white-default/40 text-black-800 backdrop-blur-bubble flex h-75 w-full items-center justify-center border-2 px-20 text-center text-lg leading-22 font-semibold">
            {children}
        </div>
    );
}
