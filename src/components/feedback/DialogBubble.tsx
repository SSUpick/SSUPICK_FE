import type { ReactNode } from 'react';

type DialogBubbleProps = {
    children: ReactNode;
};

export function DialogBubble({ children }: DialogBubbleProps) {
    return (
        <div className="flex h-75 w-full items-center justify-center rounded-14 border-2 border-white-default bg-white-default/40 px-20 text-center text-lg font-semibold leading-22 text-black-800 backdrop-blur-sm">
            {children}
        </div>
    );
}
