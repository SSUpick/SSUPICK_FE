import { create } from 'zustand';

type SessionState = {
    isExpired: boolean;
    setExpired: () => void;
    reset: () => void;
};

export const useSessionStore = create<SessionState>()(set => ({
    isExpired: false,
    setExpired: () => set({ isExpired: true }),
    reset: () => set({ isExpired: false }),
}));
