import sampleImg from '@/assets/bg_onBoarding.webp';

import type { UserCardResponseDto } from '@/features/user/types';

export const MOCK_PROFILES: UserCardResponseDto[] = [
    { userId: 1, profileUrl: sampleImg, nickname: '숭실대 카리나', mbti: 'INTJ', appeals: ['최대8글자입니다', '최대8글자입니다', '최대8글자입니다'], gender: 'FEMALE' },
    { userId: 2, profileUrl: sampleImg, nickname: '숭실대 차은우', mbti: 'ESFP', appeals: ['최대8글자입니다', '최대8글자입니다', '최대8글자입니다'], gender: 'MALE' },
    { userId: 3, profileUrl: sampleImg, nickname: '숭실대 카리나', mbti: 'INTJ', appeals: ['고양이상', '청순'], gender: 'FEMALE' },
    { userId: 4, profileUrl: sampleImg, nickname: '숭실대 차은우', mbti: 'ESFP', appeals: ['최대8글자입니다', '최대8글자입니다', '최대8글자입니다'], gender: 'MALE' },
    { userId: 5, profileUrl: sampleImg, nickname: '숭실대 카리나', mbti: 'INTJ', appeals: ['고양이상', '청순'], gender: 'FEMALE' },
    { userId: 6, profileUrl: sampleImg, nickname: '숭실대 차은우', mbti: 'ESFP', appeals: ['최대8글자입니다', '최대8글자입니다', '최대8글자입니다'], gender: 'MALE' },
    { userId: 7, profileUrl: sampleImg, nickname: '숭실대 카리나', mbti: 'INTJ', appeals: ['고양이상', '청순'], gender: 'FEMALE' },
    { userId: 8, profileUrl: sampleImg, nickname: '숭실대 차은우', mbti: 'ESFP', appeals: ['최대8글자입니다', '최대8글자입니다', '최대8글자입니다'], gender: 'MALE' },
];

export const findProfileById = (id: string): UserCardResponseDto | undefined =>
    MOCK_PROFILES.find(p => String(p.userId) === id);
