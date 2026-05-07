import { CtaButton } from '@/components/button/CtaButton';

import { BackdropScene } from './BackdropScene';

type PhotoPreviewStepProps = {
    photoUrl: string;
    onConfirm: () => void;
};

export function PhotoPreviewStep({ photoUrl, onConfirm }: PhotoPreviewStepProps) {
    return (
        <BackdropScene>
            <p className="w-full pt-66 text-center text-2xl font-bold text-black-800">
                이 사진으로 할까?
            </p>

            <img
                src={photoUrl}
                alt="업로드한 사진"
                className="mt-30 h-360 w-260 self-center rounded-20 object-cover"
            />

            <div className="mt-auto px-22 pb-30">
                <CtaButton className="w-full" onClick={onConfirm}>
                    응, 이걸로 할래.
                </CtaButton>
            </div>
        </BackdropScene>
    );
}
