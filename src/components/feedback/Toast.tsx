import successIcon from '@/assets/success_icon.svg';

type ToastProps = {
    message: string;
};

export function Toast({ message }: ToastProps) {
    return (
        <div className="bg-black-800/90 text-white-default pointer-events-none flex items-center gap-6 rounded-full px-14 py-8 text-sm font-medium shadow-lg">
            <img src={successIcon} alt="" aria-hidden className="size-16" />
            <span>{message}</span>
        </div>
    );
}
