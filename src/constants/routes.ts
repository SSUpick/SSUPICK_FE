export const ROUTES = {
    ROOT: '/',
    LOGIN: '/login',
    KAKAO_CALLBACK: '/auth/kakao/callback',
    ONBOARDING: '/onboarding',
    TERMS: '/terms',
    FEED: '/feed',
    CARD_DETAIL: '/feed/:profileId',
    ME: '/me',
} as const;

export const cardDetailPath = (profileId: string) => `/feed/${profileId}`;
