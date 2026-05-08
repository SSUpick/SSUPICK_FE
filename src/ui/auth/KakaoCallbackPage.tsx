import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { SpinnerIcon } from '@/components/icon/SpinnerIcon';

export function KakaoCallbackPage() {
    const navigate = useNavigate();
    const [params] = useSearchParams();

    useEffect(() => {
        const code = params.get('code');
        // TODO: API 연동 — 카카오 인가 코드로 로그인
        if (!code) {
            navigate(ROUTES.LOGIN, { replace: true });
            return;
        }
        navigate(ROUTES.ONBOARDING, { replace: true });
    }, [navigate, params]);

    return (
        <div className="bg-pink-light text-pink-point flex min-h-svh items-center justify-center">
            <SpinnerIcon className="size-44" />
        </div>
    );
}
