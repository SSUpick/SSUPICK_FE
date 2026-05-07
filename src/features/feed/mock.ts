import sampleImg from '@/assets/ssuny.webp';

import type { FeedProfile } from './types';

export const MOCK_PROFILES: FeedProfile[] = [
    { id: '1', imageUrl: sampleImg, nickname: '숭실대 카리나', mbti: 'INTJ', keywords: ['최대8글자입니다', '최대8글자입니다', '최대8글자입니다'], gender: 'woman' },
    { id: '2', imageUrl: sampleImg, nickname: '숭실대 차은우', mbti: 'ESFP', keywords: ['최대8글자입니다', '최대8글자입니다', '최대8글자입니다'], gender: 'man' },
    { id: '3', imageUrl: sampleImg, nickname: '숭실대 카리나', mbti: 'INTJ', keywords: ['고양이상', '청순'], gender: 'woman' },
    { id: '4', imageUrl: sampleImg, nickname: '숭실대 차은우', mbti: 'ESFP', keywords: ['최대8글자입니다', '최대8글자입니다', '최대8글자입니다'], gender: 'man' },
    { id: '5', imageUrl: sampleImg, nickname: '숭실대 카리나', mbti: 'INTJ', keywords: ['고양이상', '청순'], gender: 'woman' },
    { id: '6', imageUrl: sampleImg, nickname: '숭실대 차은우', mbti: 'ESFP', keywords: ['최대8글자입니다', '최대8글자입니다', '최대8글자입니다'], gender: 'man' },
    { id: '7', imageUrl: sampleImg, nickname: '숭실대 카리나', mbti: 'INTJ', keywords: ['고양이상', '청순'], gender: 'woman' },
    { id: '8', imageUrl: sampleImg, nickname: '숭실대 차은우', mbti: 'ESFP', keywords: ['최대8글자입니다', '최대8글자입니다', '최대8글자입니다'], gender: 'man' },
];

export const findProfileById = (id: string): FeedProfile | undefined =>
    MOCK_PROFILES.find((p) => p.id === id);
