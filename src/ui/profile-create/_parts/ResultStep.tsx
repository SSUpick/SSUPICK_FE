import { useEffect, useState } from 'react';

import warningIcon from '@/assets/warning_icon.svg';
import { CtaButton } from '@/components/button/CtaButton';

import { BackdropScene } from './BackdropScene';

type ResultStepProps = {
    photoUrl: string;
    attempts: number;
    maxAttempts: number;
    onRetry: () => void;
    onConfirm: () => void;
};

export function ResultStep({
    photoUrl,
    attempts,
    maxAttempts,
    onRetry,
    onConfirm,
}: ResultStepProps) {
    const isMaxed = attempts >= maxAttempts;
    const [showCaptureToast, setShowCaptureToast] = useState(false);

    useEffect(() => {
        const handler = () => {
            setShowCaptureToast(true);
            window.setTimeout(() => setShowCaptureToast(false), 2200);
        };
        document.addEventListener('visibilitychange', handler);
        return () => document.removeEventListener('visibilitychange', handler);
    }, []);

    return (
        <BackdropScene>
            {showCaptureToast && (
                <div className="rounded-10 bg-pink-light text-pink-point pointer-events-none absolute top-22 left-1/2 z-10 flex -translate-x-1/2 items-center gap-6 px-14 py-10 text-xs font-medium">
                    <img src={warningIcon} alt="" aria-hidden className="size-16" />
                    사진 저장 기능은 프로필 업로드 후 제공돼요!
                </div>
            )}

            <p className="text-pink-point w-full pt-66 text-center text-2xl font-bold">완성!</p>
            <p className="text-black-800 mt-8 w-full text-center text-base font-medium">
                {isMaxed ? (
                    <>
                        최대 이미지 생성 횟수를
                        <br />
                        모두 소비했어.
                    </>
                ) : (
                    <>
                        최대 <span className="text-pink-point font-bold">{maxAttempts}회</span>까지
                        다시
                        <br />
                        이미지를 만들 수 있어.
                    </>
                )}
            </p>

            <img
                src={photoUrl}
                alt="생성된 캐릭터"
                className="rounded-20 mt-22 h-360 w-260 self-center object-cover"
            />

            <p className="text-black-400 mt-14 w-full text-center text-xs font-medium">
                {isMaxed ? (
                    '업로드 후 사진은 변경 불가능해요.'
                ) : (
                    <>
                        현재 {maxAttempts}회 중 {attempts}회 만들었어요.
                        <br />
                        업로드 후 사진은 변경 불가능해요.
                    </>
                )}
            </p>

            <div className="mt-auto flex gap-10 px-22 pb-30">
                {!isMaxed && (
                    <CtaButton variant="secondary" className="flex-1" onClick={onRetry}>
                        다시 하기
                    </CtaButton>
                )}
                <CtaButton className="flex-1" onClick={onConfirm}>
                    이대로 하기
                </CtaButton>
            </div>
        </BackdropScene>
    );
}
