import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

import { useAuthStore } from '@/store/authStore';
import { useSessionStore } from '@/store/sessionStore';

export const http = axios.create({
    baseURL: 'https://ssu-pick.shop',
    headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 동시 401 요청들을 재발급 완료 후 일괄 재시도하기 위한 큐
let isRefreshing = false;
let pendingQueue: ((token: string) => void)[] = [];

function flushQueue(token: string) {
    pendingQueue.forEach(cb => cb(token));
    pendingQueue = [];
}

http.interceptors.response.use(
    res => res,
    async (err: unknown) => {
        if (!axios.isAxiosError(err) || err.response?.status !== 401) {
            return Promise.reject(err);
        }

        const originalRequest = err.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // reissue 요청 자체가 401이면 리프레시 토큰도 만료 → 세션 종료
        if (originalRequest.url?.includes('/api/auth/token/reissue')) {
            useAuthStore.getState().clearTokens();
            useSessionStore.getState().setExpired();
            return Promise.reject(err);
        }

        // 이미 재시도한 요청이면 큐에 올려서 재발급 완료를 기다림
        if (originalRequest._retry) {
            return new Promise(resolve => {
                pendingQueue.push(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    resolve(http(originalRequest));
                });
            });
        }

        originalRequest._retry = true;

        if (isRefreshing) {
            return new Promise(resolve => {
                pendingQueue.push(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    resolve(http(originalRequest));
                });
            });
        }

        isRefreshing = true;

        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) throw new Error('no refresh token');

            // reissueToken은 순환 참조 방지를 위해 직접 import하지 않고 inline 호출
            const { data } = await http.post<{
                data: { accessToken: string; refreshToken: string };
            }>('/api/auth/token/reissue', null, {
                headers: { 'Refresh-Token': refreshToken },
            });

            const newAccessToken = data.data.accessToken;
            const newRefreshToken = data.data.refreshToken;

            useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);
            flushQueue(newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return http(originalRequest);
        } catch {
            useAuthStore.getState().clearTokens();
            useSessionStore.getState().setExpired();
            return Promise.reject(err);
        } finally {
            isRefreshing = false;
            pendingQueue = [];
        }
    },
);
