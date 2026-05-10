export type Gender = 'MALE' | 'FEMALE';
export type OnboardingStatus = 'INCOMPLETE' | 'COMPLETED';

export type UserOnboardingRequestDto = {
    nickname: string;
    mbti: string;
    appeals: string[];
    contact: string;
    gender: Gender;
};

export type UserUpdateProfileRequestDto = {
    nickname?: string;
    mbti?: string;
    appeals?: string[];
    contact?: string;
};

export type UserProfileResponseDto = {
    userId: number;
    name: string;
    email: string;
    profileUrl: string;
    gender: Gender;
    age: number;
    onboardingStatus: OnboardingStatus;
    nickname: string;
    mbti: string;
    contact: string;
    appeals: string[];
    remainingCouponCount: number;
};

export type UserCardResponseDto = {
    userId: number;
    nickname: string;
    gender: Gender;
    mbti: string;
    appeals: string[];
    profileUrl: string;
};

export type UserTargetProfileResponseDto = {
    userId: number;
    nickname: string;
    mbti: string;
    profileUrl: string;
    appeals: string[];
    contact: string;
};
