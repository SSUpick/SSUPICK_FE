import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProfileCard } from '@/components/card/ProfileCard';
import { AvatarIcon } from '@/components/icon/AvatarIcon';
import { SpinnerIcon } from '@/components/icon/SpinnerIcon';
import { cardDetailPath } from '@/constants/routes';
import type { Gender } from '@/features/user/types';
import { useUserCardList } from '@/features/user/hooks/useUserCardList';

import { FeedHeader } from '../feed/_parts/FeedHeader';

type GenderFilter = 'all' | Gender;

const FILTER_OPTIONS: { label: string; value: GenderFilter }[] = [
    { label: '전체 보기', value: 'all' },
    { label: '남자만 보기', value: 'MALE' },
    { label: '여자만 보기', value: 'FEMALE' },
];

export function ExplorePage() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<GenderFilter>('all');
    const { data: cards, isLoading } = useUserCardList();

    const filtered = (cards ?? []).filter((p) => filter === 'all' || p.gender === filter);

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

            {isLoading ? (
                <div className="flex flex-1 items-center justify-center">
                    <SpinnerIcon className="text-pink-point size-44" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-16">
                    <AvatarIcon className="text-black-300 size-60" />
                    <p className="text-black-400 text-base font-medium">아직 주민이 없어요!</p>
                </div>
            ) : (
                <main className="grid grid-cols-2 justify-items-center gap-x-23 gap-y-26 px-22 pb-30">
                    {filtered.map((p) => (
                        <ProfileCard
                            key={p.userId}
                            {...p}
                            onClick={() => navigate(cardDetailPath(String(p.userId)))}
                        />
                    ))}
                </main>
            )}
        </div>
    );
}
