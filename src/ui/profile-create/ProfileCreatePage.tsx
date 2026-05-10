import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';

import { generateAiImage } from '@/features/ai-image/api';
import type { AiImageResponseDto } from '@/features/ai-image/types';
import { registerUserOnboarding } from '@/features/user/api';
import { ROUTES } from '@/constants/routes';
import { toast } from '@/store/toastStore';
import { compressImage } from '@/utils/compressImage';

import { CardFormStep } from './_parts/CardFormStep';
import type { CardFormValues } from './_parts/CardFormStep';
import { GeneratingStep } from './_parts/GeneratingStep';
import { PhotoPreviewStep } from './_parts/PhotoPreviewStep';
import { PhotoUploadStep } from './_parts/PhotoUploadStep';
import { ResultStep } from './_parts/ResultStep';

type Step = 'upload' | 'preview' | 'generating' | 'result' | 'form';

const MAX_ATTEMPTS = 3;

export function ProfileCreatePage() {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>('upload');
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [aiImage, setAiImage] = useState<AiImageResponseDto | null>(null);
    const [attempts, setAttempts] = useState(0);

    const { mutate: startGeneration, data: generateResult } = useMutation({
        mutationFn: generateAiImage,
        onSuccess: data => {
            if (data.status === 'DONE') {
                setAiImage(data);
                setStep('result');
            }
        },
        onError: () => {
            toast.error('이미지 생성에 실패했어요.');
            setStep('upload');
        },
    });

    const { mutateAsync: submitOnboarding } = useMutation({
        mutationFn: registerUserOnboarding,
        onSuccess: () => {
            navigate(ROUTES.EXPLORE, {
                replace: true,
                state: { toast: '프로필 등록에 성공했어요!' },
            });
        },
    });

    const handlePicked = (file: File) => {
        setPhotoFile(file);
        setStep('preview');
    };

    const handleConfirmPhoto = async () => {
        if (!photoFile) return;
        try {
            const compressed = await compressImage(photoFile);
            setAttempts(n => n + 1);
            startGeneration(compressed);
            setStep('generating');
        } catch {
            toast.error('사진을 처리하는 데 실패했어요.');
        }
    };

    const handleGeneratingDone = (result: AiImageResponseDto) => {
        setAiImage(result);
        setStep('result');
    };

    const handleGeneratingError = () => {
        toast.error('이미지 생성에 실패했어요.');
        setStep('upload');
    };

    const handleRetry = () => {
        if (attempts >= MAX_ATTEMPTS) return;
        setPhotoFile(null);
        setAiImage(null);
        setStep('upload');
    };

    const handleSubmitForm = async (values: CardFormValues) => {
        try {
            await submitOnboarding({
                nickname: values.nickname,
                mbti: values.mbti,
                appeals: values.appeals,
                contact: values.contact,
                gender: values.gender,
            });
        } catch {
            toast.error('프로필 등록에 실패했어요.');
        }
    };

    if (step === 'upload') return <PhotoUploadStep onPicked={handlePicked} />;
    if (step === 'preview' && photoFile)
        return <PhotoPreviewStep file={photoFile} onConfirm={handleConfirmPhoto} />;
    if (step === 'generating')
        return (
            <GeneratingStep
                aiImageId={generateResult?.aiImageId ?? null}
                onDone={handleGeneratingDone}
                onError={handleGeneratingError}
            />
        );
    if (step === 'result' && aiImage)
        return (
            <ResultStep
                generatedImageUrl={aiImage.generatedImageUrl}
                aiImageId={aiImage.aiImageId}
                attempts={attempts}
                maxAttempts={MAX_ATTEMPTS}
                onRetry={handleRetry}
                onConfirm={() => setStep('form')}
            />
        );
    return <CardFormStep onSubmit={handleSubmitForm} />;
}
