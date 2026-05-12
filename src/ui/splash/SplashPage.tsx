import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/store/authStore';

export function SplashPage() {
    const navigate = useNavigate();
    const accessToken = useAuthStore(s => s.accessToken);

    useEffect(() => {
        if (accessToken) {
            navigate(ROUTES.EXPLORE, { replace: true });
        } else {
            navigate(ROUTES.LOGIN, { replace: true });
        }
    }, [navigate, accessToken]);

    return <div className="bg-pink-light min-h-svh" />;
}
