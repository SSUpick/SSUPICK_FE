import { create } from 'zustand';

export type ToastState = 'success' | 'error';

export type ToastItem = {
    id: number;
    message: string;
    state: ToastState;
};

type ToastStore = {
    toasts: ToastItem[];
    show: (message: string, state?: ToastState, duration?: number) => void;
    dismiss: (id: number) => void;
};

let nextId = 0;
const DEFAULT_DURATION = 2200;

export const useToastStore = create<ToastStore>((set, get) => ({
    toasts: [],
    show: (message, state = 'success', duration = DEFAULT_DURATION) => {
        const id = nextId++;
        set({ toasts: [...get().toasts, { id, message, state }] });
        window.setTimeout(() => get().dismiss(id), duration);
    },
    dismiss: id => {
        set({ toasts: get().toasts.filter(t => t.id !== id) });
    },
}));

/**
 * Imperative API — 어디서든 호출 가능 (이벤트 핸들러, 비동기 작업 콜백 등).
 * React 컴포넌트 안에서도 hook 없이 사용 가능.
 */
export const toast = {
    success: (message: string, duration?: number) =>
        useToastStore.getState().show(message, 'success', duration),
    error: (message: string, duration?: number) =>
        useToastStore.getState().show(message, 'error', duration),
};
