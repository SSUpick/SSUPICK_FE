import type { ComponentProps } from 'react';

type TextInputProps = ComponentProps<'input'> & {
    error?: boolean;
};

export function TextInput({ error = false, className, ...props }: TextInputProps) {
    const stateClass = error
        ? 'border-red-default'
        : 'border-transparent focus:border-blue-200';

    return (
        <input
            className={`h-60 w-full rounded-10 border bg-black-100 px-14 py-18 text-base font-medium text-black-800 outline-none placeholder:font-normal placeholder:text-black-400 ${stateClass} ${className ?? ''}`}
            {...props}
        />
    );
}
