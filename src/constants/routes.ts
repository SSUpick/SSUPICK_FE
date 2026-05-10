export const ROUTES = {
    ROOT: '/',
    LOGIN: '/login',
    KAKAO_CALLBACK: '/auth/kakao/callback',
    ONBOARDING: '/onboarding',
    TERMS: '/terms',
    PRIVACY: '/privacy',
    REFUND: '/refund',
    PROFILE_CREATE: '/profile/create',
    FEED: '/feed',
    CARD_DETAIL: '/feed/:profileId',
    EXPLORE: '/explore',
    COUPON: '/coupon',
    PAYMENT: '/payment',
    PAYMENT_COMPLETE: '/payment/complete',
    ME: '/me',
    ME_EDIT: '/me/edit',
    SETTINGS: '/settings',
    SERVER_ERROR: '/500',
} as const;

export const cardDetailPath = (profileId: string) => `/feed/${profileId}`;
