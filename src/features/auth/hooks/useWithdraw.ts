import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/store/authStore';

import { withdraw } from '../api';

export function useWithdraw() {
    const clearTokens = useAuthStore(state => state.clearTokens);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: withdraw,
        onSuccess: () => {
            clearTokens();
            localStorage.removeItem('onboarding_seen');
            navigate(ROUTES.LOGIN, { replace: true });
        },
    });
}
