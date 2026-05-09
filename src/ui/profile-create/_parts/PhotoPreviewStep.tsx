import { useEffect, useState } from 'react';

import { CtaButton } from '@/components/button/CtaButton';

import { BackdropScene } from './BackdropScene';

type PhotoPreviewStepProps = {
    file: File;
    onConfirm: () => void;
};

export function PhotoPreviewStep({ file, onConfirm }: PhotoPreviewStepProps) {
    const [previewUrl, setPreviewUrl] = useState(() => URL.createObjectURL(file));

    useEffect(() => {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    return (
        <BackdropScene>
            <section className="flex w-full flex-1 flex-col items-center justify-center gap-46">
                <p className="text-black-800 text-28 text-center font-semibold">
                    이 사진으로 할까?
                </p>

                <img
                    src={previewUrl}
                    alt="업로드한 사진"
                    className="rounded-20 h-360 w-260 object-cover"
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
