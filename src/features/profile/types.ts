export type Gender = 'male' | 'female';

export type ProfileCreateRequestDto = {
    nickname: string;
    gender: Gender;
    mbti: string;
    keywords: string[];
    contact: string;
    photoUrl: string;
};

export type ProfileCreateResponseDto = {
    profileId: string;
};
