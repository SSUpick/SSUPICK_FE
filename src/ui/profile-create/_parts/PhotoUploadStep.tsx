import { useRef } from 'react';

import imgPlaceholder from '@/assets/img.webp';

import { BackdropScene } from './BackdropScene';

type PhotoUploadStepProps = {
    onPicked: (dataUrl: string) => void;
};

export function PhotoUploadStep({ onPicked }: PhotoUploadStepProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handlePick = () => inputRef.current?.click();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => onPicked(String(reader.result));
        reader.readAsDataURL(file);
    };

    return (
        <BackdropScene>
            <p className="text-black-800 w-full pt-66 text-center text-2xl font-bold">
                사진을 넣어줘!
            </p>

            <button
                type="button"
                onClick={handlePick}
                className="rounded-20 border-pink-default/60 bg-white-default/30 mt-50 flex h-360 w-260 items-center justify-center self-center border-2 border-dashed backdrop-blur-sm"
            >
                <img src={imgPlaceholder} alt="" aria-hidden className="size-130 object-contain" />
            </button>

            <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleChange} />
        </BackdropScene>
    );
}
