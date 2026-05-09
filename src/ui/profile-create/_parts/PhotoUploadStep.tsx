import { useRef } from 'react';

import imgPlaceholder from '@/assets/img.webp';

import { BackdropScene } from './BackdropScene';

type PhotoUploadStepProps = {
    onPicked: (file: File) => void;
};

export function PhotoUploadStep({ onPicked }: PhotoUploadStepProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handlePick = () => inputRef.current?.click();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        onPicked(file);
    };

    return (
        <BackdropScene>
            <section className="flex w-full flex-1 flex-col items-center justify-center gap-46">
                <p className="text-black-800 text-28 text-center font-semibold">사진을 넣어줘!</p>

                <button
                    type="button"
                    onClick={handlePick}
                    className="bg-white-default/20 backdrop-blur-bubble border-white-default rounded-14 flex h-421 w-329 items-center justify-center border-2"
                >
                    <img
                        src={imgPlaceholder}
                        alt=""
                        aria-hidden
                        className="h-146 w-169 object-contain"
                    />
                </button>

                <div className="h-42 bg-transparent" />

                <input ref={inputRef} type="file" accept="image/jpeg,image/png" hidden onChange={handleChange} />
            </section>
        </BackdropScene>
    );
}
