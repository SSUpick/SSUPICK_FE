import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

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
    const [photoUrl, setPhotoUrl] = useState<string>('');
    const [attempts, setAttempts] = useState(0);

    const handlePicked = (url: string) => {
        setPhotoUrl(url);
        setStep('preview');
    };

    const handleConfirmPhoto = () => {
        setAttempts((n) => n + 1);
        setStep('generating');
    };

    const handleGeneratingDone = () => setStep('result');

    const handleRetry = () => {
        if (attempts >= MAX_ATTEMPTS) return;
        setStep('generating');
        setAttempts((n) => n + 1);
    };

    const handleConfirmResult = () => setStep('form');

    const handleSubmitForm = async (values: CardFormValues) => {
        // TODO: API 연동 — 프로필 생성
        void values;
        await new Promise((r) => window.setTimeout(r, 700));
        navigate(`${ROUTES.FEED}?toast=profileCreate`, { replace: true });
    };

    if (step === 'upload') return <PhotoUploadStep onPicked={handlePicked} />;
    if (step === 'preview')
        return <PhotoPreviewStep photoUrl={photoUrl} onConfirm={handleConfirmPhoto} />;
    if (step === 'generating') return <GeneratingStep onDone={handleGeneratingDone} />;
    if (step === 'result')
        return (
            <ResultStep
                photoUrl={photoUrl}
                attempts={attempts}
                maxAttempts={MAX_ATTEMPTS}
                onRetry={handleRetry}
                onConfirm={handleConfirmResult}
            />
        );
    return <CardFormStep onSubmit={handleSubmitForm} />;
}
