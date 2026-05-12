import { useEffect, useRef } from 'react';

import { useMutation } from '@tanstack/react-query';

import { CtaButton } from '@/components/button/CtaButton';
import { selectAiImage } from '@/features/ai-image/api';
import { toast } from '@/store/toastStore';

import { BackdropScene } from './BackdropScene';

type ResultStepProps = {
    generatedImageUrl: string;
    aiImageId: number;
    attempts: number;
    maxAttempts: number;
    onRetry: () => void;
    onConfirm: () => void;
    alreadySelected?: boolean;
};

export function ResultStep({
    generatedImageUrl,
    aiImageId,
    attempts,
    maxAttempts,
    onRetry,
    onConfirm,
    alreadySelected = false,
}: ResultStepProps) {
    const isMaxed = attempts >= maxAttempts;
    // 명시적으로 완료(선택 or 재시도)한 경우 true — 이탈 시 자동 선택 스킵
    // alreadySelected면 처음부터 true (이탈 시 재호출 방지)
    const resolvedRef = useRef(alreadySelected);
    // StrictMode 이중 마운트 대응: 재마운트 시 이전 cleanup auto-select 취소
    const autoSelectTimerRef = useRef<number | null>(null);

    const { mutate: selectImage, isPending } = useMutation({
        mutationFn: () => selectAiImage(aiImageId),
        onSuccess: () => {
            resolvedRef.current = true;
            onConfirm();
        },
        onError: () => toast.error('이미지 선택에 실패했어요.'),
    });

    const handleRetry = () => {
        resolvedRef.current = true;
        onRetry();
    };

    // 이탈(뒤로 가기, 라우트 이동 등) 시 마지막 생성 이미지 자동 선택
    // setTimeout 0으로 StrictMode 재마운트 시 예약 취소, 실제 이탈만 처리
    useEffect(() => {
        if (autoSelectTimerRef.current !== null) {
            window.clearTimeout(autoSelectTimerRef.current);
            autoSelectTimerRef.current = null;
        }

        return () => {
            autoSelectTimerRef.current = window.setTimeout(() => {
                if (!resolvedRef.current) {
                    selectAiImage(aiImageId).catch(() => {});
                }
            }, 0);
        };
    }, [aiImageId]);

    return (
        <BackdropScene>
            <div className="short:top-60 supershort:top-40 short:gap-12 supershort:gap-8 absolute top-85 left-1/2 flex -translate-x-1/2 flex-col items-center gap-15 text-center whitespace-nowrap">
                <p className="text-pink-point text-28 short:text-2xl supershort:text-xl font-semibold">
                    완성!
                </p>
                <p className="text-black-600 short:text-lg supershort:text-base text-xl font-semibold">
                    {isMaxed ? (
                        <>남은 기회가 없어 이 사진이
                            <br />
                            자동으로 선택돼요!
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

            <div className="bg-white-default/50 backdrop-blur-bubble border-white-default rounded-14 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2">
                <div className="border-white-default rounded-14 short:h-340 short:w-272 supershort:h-280 supershort:w-224 h-381 w-305 overflow-hidden border">
                    <img
                        src={generatedImageUrl}
                        alt="생성된 캐릭터"
                        className="size-full object-cover"
                    />
                </div>
            </div>

            <div className="short:bottom-30 supershort:bottom-20 short:gap-20 supershort:gap-12 absolute inset-x-0 bottom-48 flex flex-col items-center gap-30">
                <div className="text-green-dark short:text-sm supershort:text-xs text-base font-medium">
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
                    <CtaButton
                        className="w-full"
                        onClick={alreadySelected ? onConfirm : () => selectImage()}
                        disabled={!alreadySelected && isPending}
                    >
                        {alreadySelected ? '다음으로' : '이대로 하기'}
                    </CtaButton>
                ) : (
                    <div className="grid w-full grid-cols-2 gap-20">
                        <CtaButton variant="secondary" onClick={handleRetry} disabled={isPending}>
                            다시 하기
                        </CtaButton>
                        <CtaButton onClick={() => selectImage()} disabled={isPending}>
                            이대로 하기
                        </CtaButton>
                    </div>
                )}
            </div>
        </BackdropScene>
    );
}
