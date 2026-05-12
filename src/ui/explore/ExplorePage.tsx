import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CtaButton } from '@/components/button/CtaButton';
import { ProfileCard } from '@/components/card/ProfileCard';
import { AvatarIcon } from '@/components/icon/AvatarIcon';
import { ProfileCardSkeleton } from './_parts/ProfileCardSkeleton';
import { CONTACT } from '@/constants/contact';
import { ROUTES, cardDetailPath } from '@/constants/routes';
import type { Gender } from '@/features/user/types';
import { useUserCardList } from '@/features/user/hooks/useUserCardList';
import { useUserProfile } from '@/features/user/hooks/useUserProfile';

import { FeedHeader } from './_parts/FeedHeader';

type GenderFilter = 'all' | Gender;
const FILTER_OPTIONS: { label: string; value: GenderFilter }[] = [
    { label: '전체 보기', value: 'all' },
    { label: '남자만 보기', value: 'MALE' },
    { label: '여자만 보기', value: 'FEMALE' },
];

const SCROLL_THRESHOLD = 300;

export function ExplorePage() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<GenderFilter>('all');
    const { data: cards, isLoading } = useUserCardList();
    const { data: profile } = useUserProfile();

    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > SCROLL_THRESHOLD);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const filtered = filter === 'all' ? (cards ?? []) : (cards ?? []).filter(p => p.gender === filter);
    const showProfileCta = profile?.onboardingStatus === 'INCOMPLETE';

    return (
        <div className="bg-white-default flex min-h-svh w-full flex-col">
            <FeedHeader title="이상형을 찾아보세요!" />

            <div className="flex gap-10 pb-16">
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
                <main className="grid grid-cols-2 justify-items-center gap-x-23 gap-y-26 pb-30">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <ProfileCardSkeleton key={i} />
                    ))}
                </main>
            ) : filtered.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-16">
                    <AvatarIcon className="text-black-300 size-60" />
                    <p className="text-black-400 text-base font-medium">아직 주민이 없어요!</p>
                </div>
            ) : (
                <main
                    className={`grid grid-cols-2 justify-items-center gap-x-23 gap-y-26 ${showProfileCta ? 'pb-110' : 'pb-30'}`}
                >
                    {filtered.map(p => (
                        <ProfileCard
                            key={p.userId}
                            {...p}
                            onClick={() => navigate(cardDetailPath(String(p.userId)))}
                        />
                    ))}
                </main>
            )}

            <div
                className={`text-black-400 border-black-200 mt-auto flex flex-col gap-3 border-t pt-16 text-xs leading-18 tracking-tight ${showProfileCta ? 'pb-110' : 'pb-30'}`}
            >
                <p>상호: 슈픽 · 대표자: 백승현</p>
                <p>사업자등록번호: 282-45-01301</p>
                <p>통신판매신고번호: 신고 진행 중</p>
                <p>사업장 주소: 서울특별시 동작구 상도로 395-7</p>
                <p>전화: 010-4651-2952</p>
                <p>고객센터: {CONTACT.EMAIL}</p>
            </div>

            {/* 프로필 미등록 유저 CTA */}
            {showProfileCta && (
                <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-3xl bg-linear-to-t from-white via-white/90 to-transparent px-20 pt-12 pb-24">
                    <CtaButton onClick={() => navigate(ROUTES.PROFILE_CREATE)}>
                        내 프로필 등록하기
                    </CtaButton>
                </div>
            )}

            {/* 맨 위로 가기 버튼 — 프로필 CTA가 있으면 위로 올림 */}
            <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="맨 위로 가기"
                className={`bg-pink-default text-white-default fixed right-20 z-40 flex size-44 items-center justify-center rounded-full shadow-lg transition-all duration-200 ${
                    showProfileCta ? 'bottom-100' : 'bottom-32'
                } ${showScrollTop ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-20"
                    aria-hidden
                >
                    <path d="M18 15l-6-6-6 6" />
                </svg>
            </button>
        </div>
    );
}
