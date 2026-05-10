import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/store/authStore';

import { logout } from '../api';

export function useLogout() {
    const clearTokens = useAuthStore(state => state.clearTokens);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: logout,
        onSettled: () => {
            clearTokens();
            navigate(ROUTES.LOGIN, { replace: true });
        },
    });
}
