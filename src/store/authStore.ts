import { create } from 'zustand';

type AuthState = {
    accessToken: string | null;
    setTokens: (accessToken: string, refreshToken: string) => void;
    clearTokens: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
    accessToken: localStorage.getItem('accessToken'),
    setTokens: (accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        set({ accessToken });
    },
    clearTokens: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ accessToken: null });
    },
}));
