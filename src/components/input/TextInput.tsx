import type { ComponentProps } from 'react';
import successIcon from '@/assets/success_icon.svg';
import warningIcon from '@/assets/warning_icon.svg';

type TextInputProps = ComponentProps<'input'> & {
    error?: boolean;
    valid?: boolean;
};

export function TextInput({ error = false, valid = false, className, ...props }: TextInputProps) {
    const stateClass = error ? 'border-red-default' : 'border-transparent focus:border-blue-200';

    const icon = error ? warningIcon : valid ? successIcon : null;

    return (
        <div className="relative w-full">
            <input
                className={`rounded-10 bg-black-100 text-black-800 placeholder:text-black-400 h-60 w-full border px-14 py-18 text-base font-medium outline-none placeholder:font-normal ${icon ? 'pr-46' : ''} ${stateClass} ${className ?? ''}`}
                {...props}
            />
            {icon && (
                <img
                    src={icon}
                    alt=""
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 right-14 size-24 -translate-y-1/2"
                />
            )}
        </div>
    );
}
