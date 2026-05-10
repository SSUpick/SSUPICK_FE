import axios from 'axios';

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

http.interceptors.response.use(
    res => res,
    err => {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
            useSessionStore.getState().setExpired();
        }
        return Promise.reject(err);
    },
);
