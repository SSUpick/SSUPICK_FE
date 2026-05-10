import type { Gender } from '@/features/user/types';

export type ProfileViewUserResponseDto = {
    userId: number;
    nickname: string;
    gender: Gender;
    mbti: string;
    appeals: string[];
    profileUrl: string;
    viewedAt: string;
};

export type ProfileViewListResponseDto = {
    viewedUsers: ProfileViewUserResponseDto[];
    viewerUsers: ProfileViewUserResponseDto[];
};
