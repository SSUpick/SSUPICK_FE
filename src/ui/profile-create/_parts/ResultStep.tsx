import { useEffect } from 'react';

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
};

export function ResultStep({
    generatedImageUrl,
    aiImageId,
    attempts,
    maxAttempts,
    onRetry,
    onConfirm,
}: ResultStepProps) {
    const isMaxed = attempts >= maxAttempts;

    const { mutate: selectImage, isPending } = useMutation({
        mutationFn: () => selectAiImage(aiImageId),
        onSuccess: onConfirm,
        onError: () => toast.error('이미지 선택에 실패했어요.'),
    });

    useEffect(() => {
        const handler = () => {
            toast.error('사진 저장 기능은 프로필 업로드 후 제공돼요!');
        };
        document.addEventListener('visibilitychange', handler);
        return () => document.removeEventListener('visibilitychange', handler);
    }, []);

    return (
        <BackdropScene>
            <div className="absolute top-85 left-1/2 flex -translate-x-1/2 flex-col items-center gap-15 text-center whitespace-nowrap">
                <p className="text-pink-point text-28 font-semibold">완성!</p>
                <p className="text-black-600 text-xl font-semibold">
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

            <div className="bg-white-default/50 backdrop-blur-bubble border-white-default rounded-14 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2">
                <div className="border-white-default rounded-14 h-381 w-305 overflow-hidden border">
                    <img
                        src={generatedImageUrl}
                        alt="생성된 캐릭터"
                        className="size-full object-cover"
                    />
                </div>
            </div>

            <div className="absolute inset-x-0 bottom-48 flex flex-col items-center gap-30">
                <div className="text-green-dark text-base font-medium">
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
                        onClick={() => selectImage()}
                        disabled={isPending}
                    >
                        이대로 하기
                    </CtaButton>
                ) : (
                    <div className="grid w-full grid-cols-2 gap-20">
                        <CtaButton variant="secondary" onClick={onRetry} disabled={isPending}>
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
