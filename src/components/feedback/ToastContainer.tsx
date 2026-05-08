import { useToastStore } from '@/store/toastStore';

import { Toast } from './Toast';

/**
 * 전역 토스트 렌더러. Layout에 1회만 mount.
 * fixed top-47 viewport 가운데 정렬, 여러 토스트는 세로 스택.
 */
export function ToastContainer() {
    const toasts = useToastStore(s => s.toasts);

    if (toasts.length === 0) return null;

    return (
        <div className="pointer-events-none fixed top-47 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-8">
            {toasts.map(t => (
                <div key={t.id} className="animate-toast-in">
                    <Toast message={t.message} state={t.state} />
                </div>
            ))}
        </div>
    );
}
