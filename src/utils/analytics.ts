declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
        dataLayer?: unknown[];
    }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

/** GA4 초기화. Vite mode가 production이고 ID가 주입된 경우에만 동작. */
export function initAnalytics() {
    if (!import.meta.env.PROD) return;
    if (!GA_MEASUREMENT_ID) return;

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
