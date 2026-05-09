export type DeviceType = 'IOS' | 'ANDROID';
export type RedirectType = 'LOCAL' | 'PROD';

export type AuthKakaoLoginRequestDto = {
    code: string;
    deviceType: DeviceType;
    redirectType: RedirectType;
};

export type AuthKakaoLoginResponseDto = {
    userId: number;
    accessToken: string;
    refreshToken: string;
    onboardingCompleted: boolean;
    aiImageGenerated: boolean;
};

export type AuthReissueResponseDto = {
    accessToken: string;
    refreshToken: string;
};

export type AuthTestLoginRequestDto = {
    testUserId: string;
    deviceType: DeviceType;
};

export type AuthTestLoginResponseDto = {
    userId: number;
    accessToken: string;
    refreshToken: string;
    onboardingCompleted: boolean;
    aiImageGenerated: boolean;
    remainingCouponCount: number;
};
