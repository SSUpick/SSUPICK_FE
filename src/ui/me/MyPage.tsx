import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import couponImg from '@/assets/coupon.webp';
import defaultProfileImg from '@/assets/bg_onBoarding.webp';
import { OutlineChipButton } from '@/components/button/OutlineChipButton';
import { ProfileCard } from '@/components/card/ProfileCard';
import { AvatarIcon } from '@/components/icon/AvatarIcon';
import { GearIcon } from '@/components/icon/GearIcon';
import { SpinnerIcon } from '@/components/icon/SpinnerIcon';
import { PageHeader } from '@/components/layout/PageHeader';
import { ROUTES, cardDetailPath } from '@/constants/routes';
import { useProfileViewList } from '@/features/user/hooks/useProfileViewList';
import { useUserProfile } from '@/features/user/hooks/useUserProfile';
import { getImageUrl } from '@/utils/getImageUrl';

type Tab = 'opened' | 'openedMe';

export function MyPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [tab, setTab] = useState<Tab>('opened');

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
        queryClient.invalidateQueries({ queryKey: ['user', 'me', 'profile-views'] });
    }, [queryClient]);

    const { data: profile, isLoading: profileLoading } = useUserProfile();
    const { data: viewList, isLoading: viewLoading } = useProfileViewList();

    const users = tab === 'opened' ? (viewList?.viewedUsers ?? []) : (viewList?.viewerUsers ?? []);
    const isIncomplete = profile?.onboardingStatus === 'INCOMPLETE';
    const isKakaoDefault = profile?.profileUrl?.includes('kakaocdn.net') ?? false;
    const needsPhoto = isIncomplete && (!profile?.profileUrl || isKakaoDefault);
    const needsInfoOnly = isIncomplete && !!profile?.profileUrl && !isKakaoDefault;

    if (profileLoading) {
        return (
            <div className="flex min-h-svh items-center justify-center">
                <SpinnerIcon className="text-pink-point size-44" />
            </div>
        );
    }

    return (
        <>
            <PageHeader
                title="마이페이지"
                rightSlot={
                    <button
                        type="button"
                        aria-label="설정"
                        onClick={() => navigate(ROUTES.SETTINGS)}
                        className="text-black-300"
                    >
                        <GearIcon className="size-24" />
                    </button>
                }
            />

            <section className="mt-40 flex flex-col items-center">
                <div className="relative">
                    {needsPhoto ? (
                        <button
                            type="button"
                            onClick={() => navigate(ROUTES.PROFILE_CREATE)}
                            className="rounded-10 bg-black-100 flex h-171 w-137 items-center justify-center"
                        >
                            <AvatarIcon className="text-black-300 size-56" />
                        </button>
                    ) : (
                        <img
                            src={getImageUrl(profile?.profileUrl, defaultProfileImg)}
                            onError={e => {
                                e.currentTarget.src = defaultProfileImg;
                            }}
                            alt={profile?.nickname ?? '프로필'}
                            className="rounded-10 h-171 w-137 object-cover"
                        />
                    )}
                </div>
                <p className="text-black-900 mt-22 text-2xl font-semibold">
                    {profile?.nickname ?? ''}
                </p>
                <div className="mt-24">
                    <OutlineChipButton
                        onClick={() => {
                            if (needsPhoto) navigate(ROUTES.PROFILE_CREATE);
                            else if (needsInfoOnly) navigate(ROUTES.PROFILE_CREATE, { state: { skipToForm: true } });
                            else navigate(ROUTES.ME_EDIT);
                        }}
                    >
                        {isIncomplete ? '정보 등록하기' : '내 정보 수정'}
                    </OutlineChipButton>
                </div>
            </section>

            <button
                type="button"
                onClick={() => navigate(ROUTES.COUPON)}
                className="rounded-20 bg-white-default drop-shadow-coupon mt-30 flex h-76 w-full items-center justify-between border border-pink-100 pr-31 pl-16"
            >
                <div className="flex items-center gap-15">
                    <img src={couponImg} alt="" aria-hidden className="h-40 w-57 object-contain" />
                    <span className="text-pink-point/80 text-base font-semibold">내 이용권</span>
                </div>
                <span className="text-pink-point text-22 font-semibold">
                    {profile?.remainingCouponCount ?? 0}개
                </span>
            </button>

            <div aria-hidden className="bg-black-100 -mx-20 mt-32 h-23" />

            <div className="border-black-200 mt-35 grid grid-cols-2 border-b">
                <TabButton active={tab === 'opened'} onClick={() => setTab('opened')}>
                    내가 열람한 사람
                </TabButton>
                <TabButton active={tab === 'openedMe'} onClick={() => setTab('openedMe')}>
                    나를 열람한 사람
                </TabButton>
            </div>

            {viewLoading ? (
                <div className="mt-32 flex justify-center">
                    <SpinnerIcon className="text-pink-point size-44" />
                </div>
            ) : users.length === 0 ? (
                <div className="rounded-20 bg-black-100 mt-32 mb-20 flex h-146 w-full flex-col items-center gap-31 pt-15">
                    <p className="text-black-700 text-lg font-semibold">
                        {tab === 'opened'
                            ? '아직 열람한 사람이 없어요!'
                            : isIncomplete
                              ? '프로필을 등록 해야 상대방이 열람 가능해요!'
                              : '아직 나를 열람한 사람이 없어요!'}
                    </p>
                    <AvatarIcon className="text-black-400 size-46" />
                </div>
            ) : (
                <div className="mt-28 grid grid-cols-2 gap-x-27 gap-y-32 pb-28">
                    {users.map(p => (
                        <ProfileCard
                            key={p.userId}
                            profileUrl={p.profileUrl}
                            nickname={p.nickname}
                            gender={p.gender}
                            mbti={p.mbti}
                            appeals={p.appeals}
                            onClick={() => navigate(cardDetailPath(String(p.userId)))}
                        />
                    ))}
                </div>
            )}
        </>
    );
}

type TabButtonProps = {
    children: React.ReactNode;
    active: boolean;
    onClick: () => void;
};

function TabButton({ children, active, onClick }: TabButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`relative flex h-47 items-center justify-center py-6 text-lg font-semibold ${
                active ? 'text-black-800' : 'text-black-400'
            }`}
        >
            {children}
            {active && (
                <span aria-hidden className="bg-black-800 absolute right-0 -bottom-2 left-0 h-2" />
            )}
        </button>
    );
}
