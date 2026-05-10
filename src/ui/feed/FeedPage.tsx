import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProfileCard } from '@/components/card/ProfileCard';
import { cardDetailPath } from '@/constants/routes';
import { MOCK_PROFILES } from '@/features/feed/mock';
import type { Gender } from '@/features/user/types';
import { useNavigateToast } from '@/hooks/useNavigateToast';

import { FeedHeader } from './_parts/FeedHeader';

type FeedFilter = 'all' | Gender;

const FILTERS: { key: FeedFilter; label: string }[] = [
    { key: 'all', label: '전체 보기' },
    { key: 'MALE', label: '남자만 보기' },
    { key: 'FEMALE', label: '여자만 보기' },
];

export function FeedPage() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<FeedFilter>('all');
    useNavigateToast();

    const profiles =
        filter === 'all' ? MOCK_PROFILES : MOCK_PROFILES.filter(p => p.gender === filter);

    return (
        <div className="bg-white-default relative flex min-h-svh w-full flex-col">
            <FeedHeader title="이상형을 찾아보세요!" />

            <div className="flex items-center gap-10 pb-26">
                {FILTERS.map(({ key, label }) => {
                    const active = filter === key;
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setFilter(key)}
                            className={`rounded-full px-10 py-6 text-xs font-medium tracking-tighter ${
                                active
                                    ? 'bg-pink-light text-pink-default'
                                    : 'bg-black-100 text-black-400'
                            }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            <main className="grid grid-cols-2 justify-items-center gap-x-23 gap-y-26 pb-30">
                {profiles.map(p => (
                    <ProfileCard
                        key={p.userId}
                        {...p}
                        onClick={() => navigate(cardDetailPath(String(p.userId)))}
                    />
                ))}
            </main>
        </div>
    );
}
