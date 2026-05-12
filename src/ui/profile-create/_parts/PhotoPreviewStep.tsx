import { useEffect, useRef, useState } from 'react';

import { CtaButton } from '@/components/button/CtaButton';

import { BackdropScene } from './BackdropScene';

type PhotoPreviewStepProps = {
    file: File;
    onConfirm: () => void;
    onChangePhoto: (file: File) => void;
};

export function PhotoPreviewStep({ file, onConfirm, onChangePhoto }: PhotoPreviewStepProps) {
    const [previewUrl, setPreviewUrl] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const handlePick = () => inputRef.current?.click();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = e.target.files?.[0];
        e.target.value = '';
        if (!next) return;
        onChangePhoto(next);
    };

    return (
        <BackdropScene>
            <section className="flex w-full flex-1 flex-col items-center justify-center gap-46">
                <p className="text-black-800 text-28 text-center font-semibold">
                    이 사진으로 할까?
                </p>

                <button
                    type="button"
                    onClick={handlePick}
                    aria-label="사진 다시 선택"
                    className="rounded-20 h-360 w-260 overflow-hidden"
                >
                    <img
                        src={previewUrl}
                        alt="업로드한 사진"
                        className="h-full w-full object-cover"
                    />
                </button>

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    hidden
                    onChange={handleChange}
                />
            </section>

            <div className="pb-30">
                <CtaButton className="w-full" onClick={onConfirm}>
                    응, 이걸로 할래.
                </CtaButton>
            </div>
        </BackdropScene>
    );
}
