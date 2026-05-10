import { useEffect, type ReactNode } from 'react';

type ModalProps = {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
};

export function Modal({ open, onClose, children }: ModalProps) {
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    if (!open) return null;
    return (
        <div
            role="dialog"
            aria-modal
            className="bg-black-900/40 fixed inset-0 z-40 flex items-center justify-center px-20"
            onClick={onClose}
        >
            <div onClick={e => e.stopPropagation()} className="w-full max-w-340">
                {children}
            </div>
        </div>
    );
}
