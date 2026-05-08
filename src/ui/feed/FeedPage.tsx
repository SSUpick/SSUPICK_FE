import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { ProfileCard } from '@/components/card/ProfileCard';
import { Toast } from '@/components/feedback/Toast';
import { cardDetailPath } from '@/constants/routes';
import { MOCK_PROFILES } from '@/features/feed/mock';

import { FeedHeader } from './_parts/FeedHeader';

const TOAST_MESSAGES: Record<string, string> = {
    profileEdit: '프로필 수정에 성공했습니다!',
    paymentSuccess: '쿠폰 결제에 성공했습니다!',
    profileCreate: '프로필 등록에 성공했어요!',
    profileOpen: '프로필 열람에 성공했어요!',
};

export function FeedPage() {
    const navigate = useNavigate();
    const [params, setParams] = useSearchParams();
    const toastKey = params.get('toast');
    const [toast, setToast] = useState<string | null>(
        toastKey && TOAST_MESSAGES[toastKey] ? TOAST_MESSAGES[toastKey] : null,
    );

    useEffect(() => {
        if (!toast) return;
        const timer = window.setTimeout(() => {
            setToast(null);
            if (toastKey) {
                params.delete('toast');
                setParams(params, { replace: true });
            }
        }, 2200);
        return () => window.clearTimeout(timer);
    }, [toast, toastKey, params, setParams]);

    return (
        <div className="relative flex min-h-svh w-full flex-col bg-white-default">
            <FeedHeader title="이상형을 찾아보세요!" />

            {toast && (
                <div className="pointer-events-none fixed top-66 left-1/2 z-10 -translate-x-1/2">
                    <Toast message={toast} />
                </div>
            )}

            <main className="grid grid-cols-2 justify-items-center gap-x-23 gap-y-26 px-22 pb-30">
                {MOCK_PROFILES.map(p => (
                    <ProfileCard key={p.id} {...p} onClick={() => navigate(cardDetailPath(p.id))} />
                ))}
            </main>
        </div>
    );
}
