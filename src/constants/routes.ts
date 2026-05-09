export const ROUTES = {
    ROOT: '/',
    LOGIN: '/login',
    KAKAO_CALLBACK: '/auth/kakao/callback',
    ONBOARDING: '/onboarding',
    TERMS: '/terms',
    PRIVACY: '/privacy',
    PROFILE_CREATE: '/profile/create',
    FEED: '/feed',
    CARD_DETAIL: '/feed/:profileId',
    EXPLORE: '/explore',
    COUPON: '/coupon',
    PAYMENT: '/payment',
    PAYMENT_PG: '/payment/pg',
    ME: '/me',
    ME_EDIT: '/me/edit',
    SETTINGS: '/settings',
    SERVER_ERROR: '/500',
} as const;

export const cardDetailPath = (profileId: string) => `/feed/${profileId}`;
