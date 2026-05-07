import type { ReactNode } from 'react';

import bg from '@/assets/bg.webp';

type BackdropSceneProps = {
    children: ReactNode;
};

export function BackdropScene({ children }: BackdropSceneProps) {
    return (
        <div className="relative flex min-h-svh w-full flex-col overflow-hidden">
            <img
                src={bg}
                alt=""
                aria-hidden
                className="pointer-events-none absolute inset-0 size-full object-cover"
            />
            <div className="relative flex w-full flex-1 flex-col">{children}</div>
        </div>
    );
}
