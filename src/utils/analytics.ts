declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
        dataLayer?: unknown[];
    }
}

const GA_MEASUREMENT_ID = 'G-KSNX1VES8E';

/** GA4 초기화. Vite의 mode가 production일 때만 동작 (`pnpm dev`에서는 no-op). */
export function initAnalytics() {
    if (!import.meta.env.PROD) return;

    window.dataLayer = window.dataLayer ?? [];
    const gtag = (...args: unknown[]) => {
        window.dataLayer!.push(args);
    };
    window.gtag = gtag;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
    window.gtag?.('event', name, params);
}
