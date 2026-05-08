import type { ReactNode } from 'react';

import bg from '@/assets/bg.webp';

type BackdropSceneProps = {
    children: ReactNode;
};

export function BackdropScene({ children }: BackdropSceneProps) {
    return (
        <div className="relative flex min-h-dvh w-full flex-col">
            <div className="pointer-events-none absolute top-0 -right-20 bottom-0 -left-20 overflow-hidden">
                <img
                    src={bg}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 size-full object-cover"
                />
            </div>
            <div className="relative flex w-full flex-1 flex-col">{children}</div>
        </div>
    );
}
