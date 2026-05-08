import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { toast } from '@/store/toastStore';

/**
 * navigate state로 전달된 토스트 메시지를 도착 페이지에서 1회 표시한다.
 *
 * 사용 패턴:
 * - 출발 페이지: `navigate(ROUTES.FEED, { state: { toast: '저장 완료!' } })`
 * - 도착 페이지: `useNavigateToast()` 한 줄 호출
 *
 * 특징:
 * - mount 직후 useEffect로 토스트 호출 → 페이지 렌더링 후 자연스럽게 등장
 * - shownRef로 StrictMode 이중 mount 방지
 * - 표시 후 history state 비워서 뒤로가기/새로고침 시 재발화 방지
 *
 * navigate state 형식:
 * - `{ toast: string }` — success 토스트 (default)
 * - `{ toast: string, toastState: 'error' }` — error 토스트
 */
export function useNavigateToast() {
    const location = useLocation();
    const navigate = useNavigate();
    const shownRef = useRef(false);

    useEffect(() => {
        if (shownRef.current) return;
        const state = location.state as
            | { toast?: string; toastState?: 'success' | 'error' }
            | null;
        if (!state?.toast) return;
        shownRef.current = true;

        if (state.toastState === 'error') toast.error(state.toast);
        else toast.success(state.toast);

        // 히스토리에서 toast state 제거 — 뒤로가기/새로고침 시 재발화 방지
        navigate(location.pathname + location.search, { replace: true, state: null });
    }, [location.pathname, location.search, location.state, navigate]);
}
