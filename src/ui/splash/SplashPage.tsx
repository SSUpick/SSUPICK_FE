import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

export function SplashPage() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate(ROUTES.LOGIN, { replace: true });
    }, [navigate]);

    return <div className="bg-pink-light min-h-svh" />;
}
