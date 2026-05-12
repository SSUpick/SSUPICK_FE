export const ROUTES = {
    ROOT: '/',
    LOGIN: '/login',
    KAKAO_CALLBACK: '/auth/kakao/callback',
    ONBOARDING: '/onboarding',
    TERMS: '/terms',
    PRIVACY: '/privacy',
    REFUND: '/refund',
    PROFILE_CREATE: '/profile/create',
    EXPLORE: '/explore',
    CARD_DETAIL: '/explore/:profileId',
    COUPON: '/coupon',
    PAYMENT: '/payment',
    ME: '/me',
    ME_EDIT: '/me/edit',
    SETTINGS: '/settings',
    SERVER_ERROR: '/500',
} as const;

export const cardDetailPath = (profileId: string) => `/explore/${profileId}`;
