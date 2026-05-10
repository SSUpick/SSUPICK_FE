import { useNavigate } from 'react-router-dom';

import { CtaButton } from '@/components/button/CtaButton';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/store/authStore';
import { useSessionStore } from '@/store/sessionStore';

export function SessionExpiredModal() {
    const isExpired = useSessionStore(state => state.isExpired);
    const reset = useSessionStore(state => state.reset);
    const clearTokens = useAuthStore(state => state.clearTokens);
    const navigate = useNavigate();

    if (!isExpired) return null;

    const handleConfirm = () => {
        clearTokens();
        reset();
        navigate(ROUTES.LOGIN, { replace: true });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black-900/50 px-20">
            <div className="bg-white-default flex w-full flex-col items-center gap-24 rounded-20 px-24 py-32">
                <div className="flex flex-col items-center gap-8">
                    <p className="text-black-800 text-lg font-bold">세션이 만료되었어요</p>
                    <p className="text-black-400 text-center text-sm font-medium">
                        다시 로그인해 주세요.
                    </p>
                </div>
                <CtaButton onClick={handleConfirm}>로그인하기</CtaButton>
            </div>
        </div>
    );
}
