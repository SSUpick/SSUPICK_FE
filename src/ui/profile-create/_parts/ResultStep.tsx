import { useEffect } from 'react';

import { CtaButton } from '@/components/button/CtaButton';
import { toast } from '@/store/toastStore';

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

    useEffect(() => {
        const handler = () => {
            toast.error('사진 저장 기능은 프로필 업로드 후 제공돼요!');
        };
        document.addEventListener('visibilitychange', handler);
        return () => document.removeEventListener('visibilitychange', handler);
    }, []);

    return (
        <BackdropScene>
            {/* 헤더 */}
            <div className="absolute top-85 short:top-60 supershort:top-40 left-1/2 flex -translate-x-1/2 flex-col items-center gap-15 short:gap-12 supershort:gap-8 text-center whitespace-nowrap">
                <p className="text-pink-point text-28 short:text-2xl supershort:text-xl font-semibold">
                    완성!
                </p>
                <p className="text-black-600 text-xl short:text-lg supershort:text-base font-semibold">
                    {isMaxed ? (
                        <>
                            최대 이미지 생성 횟수를
                            <br />
                            모두 소비했어.
                        </>
                    ) : (
                        <>
                            최대 <span className="text-pink-point">{maxAttempts}회</span>까지 다시
                            <br />
                            이미지를 만들 수 있어.
                        </>
                    )}
                </p>
            </div>

            {/* 글래스모피즘 사진 프레임 */}
            <div className="bg-white-default/50 backdrop-blur-bubble border-white-default rounded-14 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2">
                <div className="border-white-default rounded-14 h-381 w-305 short:h-340 short:w-272 supershort:h-280 supershort:w-224 overflow-hidden border">
                    <img src={photoUrl} alt="생성된 캐릭터" className="size-full object-cover" />
                </div>
            </div>

            {/* 헬퍼 텍스트 + CTA 영역 */}
            <div className="absolute inset-x-0 bottom-48 short:bottom-30 supershort:bottom-20 flex flex-col items-center gap-30 short:gap-20 supershort:gap-12">
                <div className="text-green-dark text-base short:text-sm supershort:text-xs font-medium">
                    {isMaxed ? (
                        <p className="text-center">업로드 후 사진은 변경 불가능해요.</p>
                    ) : (
                        <>
                            <p className="text-center">
                                현재 {maxAttempts}회 중{' '}
                                <span className="font-bold">{attempts}회</span> 만들었어요.
                            </p>
                            <p className="text-center">업로드 후 사진은 변경 불가능해요.</p>
                        </>
                    )}
                </div>

                {isMaxed ? (
                    <CtaButton className="w-full" onClick={onConfirm}>
                        이대로 하기
                    </CtaButton>
                ) : (
                    <div className="grid w-full grid-cols-2 gap-20">
                        <CtaButton variant="secondary" onClick={onRetry}>
                            다시 하기
                        </CtaButton>
                        <CtaButton onClick={onConfirm}>이대로 하기</CtaButton>
                    </div>
                )}
            </div>
        </BackdropScene>
    );
}
