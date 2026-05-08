import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProfileCard } from '@/components/card/ProfileCard';
import { cardDetailPath } from '@/constants/routes';
import { MOCK_PROFILES } from '@/features/feed/mock';

import { FeedHeader } from '../feed/_parts/FeedHeader';

type GenderFilter = 'all' | 'man' | 'woman';

const FILTER_OPTIONS: { label: string; value: GenderFilter }[] = [
    { label: '전체 보기', value: 'all' },
    { label: '남자만 보기', value: 'man' },
    { label: '여자만 보기', value: 'woman' },
];

export function ExplorePage() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<GenderFilter>('all');

    const filtered = MOCK_PROFILES.filter(p => filter === 'all' || p.gender === filter);

    return (
        <div className="bg-white-default flex min-h-svh w-full flex-col">
            <FeedHeader title="이상형을 찾아보세요!" />

            <div className="flex gap-10 px-22 pb-16">
                {FILTER_OPTIONS.map(({ label, value }) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => setFilter(value)}
                        className={`inline-flex items-center justify-center rounded-full px-10 py-6 text-xs font-medium ${
                            filter === value
                                ? 'bg-pink-light text-pink-default'
                                : 'bg-black-100 text-black-400'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <main className="grid grid-cols-2 justify-items-center gap-x-23 gap-y-26 px-22 pb-30">
                {filtered.map(p => (
                    <ProfileCard key={p.id} {...p} onClick={() => navigate(cardDetailPath(p.id))} />
                ))}
            </main>
        </div>
    );
}
