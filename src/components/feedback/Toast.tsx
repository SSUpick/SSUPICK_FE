import successIcon from '@/assets/success_icon.svg';

type ToastProps = {
    message: string;
};

export function Toast({ message }: ToastProps) {
    return (
        <div className="pointer-events-none flex items-center gap-6 rounded-full bg-black-800/90 px-14 py-8 text-sm font-medium text-white-default shadow-lg">
            <img src={successIcon} alt="" aria-hidden className="size-16" />
            <span>{message}</span>
        </div>
    );
}
