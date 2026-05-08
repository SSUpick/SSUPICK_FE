import successIcon from '@/assets/success_icon.svg';
import warningIcon from '@/assets/warning_icon.svg';

import type { ToastState } from '@/store/toastStore';

type ToastProps = {
    message: string;
    state?: ToastState;
};

export function Toast({ message, state = 'success' }: ToastProps) {
    const icon = state === 'success' ? successIcon : warningIcon;

    return (
        <div className="bg-toast-bg/90 text-white-default rounded-8 shadow-toast pointer-events-none inline-flex items-center gap-6 px-12 py-10 text-sm font-semibold tracking-tight whitespace-nowrap">
            <img src={icon} alt="" aria-hidden className="size-20 shrink-0" />
            <span>{message}</span>
        </div>
    );
}
