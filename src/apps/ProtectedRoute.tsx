import { Navigate, Outlet } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/store/authStore';

export function ProtectedRoute() {
    const accessToken = useAuthStore(state => state.accessToken);

    if (!accessToken) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return <Outlet />;
}
