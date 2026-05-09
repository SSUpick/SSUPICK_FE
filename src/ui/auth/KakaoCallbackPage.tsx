import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';

import { SpinnerIcon } from '@/components/icon/SpinnerIcon';
import { ROUTES } from '@/constants/routes';
import { kakaoLogin } from '@/features/auth/api';
import type { DeviceType } from '@/features/auth/types';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/toastStore';

function getDeviceType(): DeviceType {
    if (/android/i.test(navigator.userAgent)) return 'ANDROID';
    return 'IOS';
}

export function KakaoCallbackPage() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const setTokens = useAuthStore((s) => s.setTokens);
    const hasFired = useRef(false);

    const { mutate } = useMutation({
        mutationFn: kakaoLogin,
        onSuccess: (data) => {
            setTokens(data.accessToken, data.refreshToken);

            if (data.onboardingCompleted) {
                navigate(ROUTES.EXPLORE, { replace: true });
            } else {
                navigate(ROUTES.ONBOARDING, { replace: true });
            }
        },
        onError: () => {
            toast.error('로그인에 실패했어요.');
            navigate(ROUTES.LOGIN, { replace: true });
        },
    });

    useEffect(() => {
        if (hasFired.current) return;
        hasFired.current = true;

        const code = params.get('code');
        if (!code) {
            navigate(ROUTES.LOGIN, { replace: true });
            return;
        }

        mutate({
            code,
            deviceType: getDeviceType(),
            redirectType: import.meta.env.PROD ? 'PROD' : 'LOCAL',
        });
    }, [mutate, navigate, params]);

    return (
        <div className="flex min-h-dvh items-center justify-center">
            <SpinnerIcon className="text-pink-point size-44" />
        </div>
    );
}
