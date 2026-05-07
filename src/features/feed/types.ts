export type FeedProfile = {
    id: string;
    imageUrl: string;
    nickname: string;
    mbti: string;
    keywords: string[];
    gender: 'woman' | 'man';
};

export type FeedListResponseDto = {
    profiles: FeedProfile[];
    nextCursor?: string;
};
