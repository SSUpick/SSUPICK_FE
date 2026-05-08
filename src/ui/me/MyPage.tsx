import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import sampleImg from '@/assets/bg_onBoarding.webp';
import couponImg from '@/assets/coupon.webp';
import { ProfileCard } from '@/components/card/ProfileCard';
import { AvatarIcon } from '@/components/icon/AvatarIcon';
import { GearIcon } from '@/components/icon/GearIcon';
import { OutlineChipButton } from '@/components/button/OutlineChipButton';
import { PageHeader } from '@/components/layout/PageHeader';
import { ROUTES, cardDetailPath } from '@/constants/routes';
import { MOCK_PROFILES } from '@/features/feed/mock';

const MY_PROFILE = {
    nickname: '숭실대 카리나',
    imageUrl: sampleImg,
    couponCount: 8,
};

type Tab = 'opened' | 'openedMe';

export function MyPage() {
    const navigate = useNavigate();
    const [tab, setTab] = useState<Tab>('opened');
    const profiles = tab === 'openedMe' ? MOCK_PROFILES.slice(0, 4) : [];

    return (
        <>
            <PageHeader
                title="마이페이지"
                rightSlot={
                    <button
                        type="button"
                        aria-label="설정"
                        onClick={() => navigate(ROUTES.SETTINGS)}
                        className="text-black-800"
                    >
                        <GearIcon className="size-24" />
                    </button>
                }
            />

            <section className="mt-30 flex flex-col items-center">
                <img
                    src={MY_PROFILE.imageUrl}
                    alt={MY_PROFILE.nickname}
                    className="rounded-10 h-171 w-137 object-cover"
                />
                <p className="text-black-900 mt-17 text-2xl font-semibold">
                    {MY_PROFILE.nickname}
                </p>
                <div className="mt-19">
                    <OutlineChipButton onClick={() => navigate(ROUTES.ME_EDIT)}>
                        내 정보 수정
                    </OutlineChipButton>
                </div>
            </section>

            <button
                type="button"
                onClick={() => navigate(ROUTES.COUPON)}
                className="rounded-20 border-pink-100 bg-white-default drop-shadow-coupon mt-21 flex h-76 w-full items-center justify-between border pr-31 pl-16"
            >
                <div className="flex items-center gap-15">
                    <img src={couponImg} alt="" aria-hidden className="h-40 w-57 object-contain" />
                    <span className="text-pink-point/80 text-base font-semibold">내 쿠폰</span>
                </div>
                <span className="text-pink-point text-22 font-semibold">
                    {MY_PROFILE.couponCount}개
                </span>
            </button>

            <div aria-hidden className="bg-black-100 -mx-20 mt-24 h-23" />

            <div className="border-black-200 -mx-20 grid grid-cols-2 border-b">
                <TabButton active={tab === 'opened'} onClick={() => setTab('opened')}>
                    내가 열람한 사람
                </TabButton>
                <TabButton active={tab === 'openedMe'} onClick={() => setTab('openedMe')}>
                    나를 열람한 사람
                </TabButton>
            </div>

            {profiles.length === 0 ? (
                <div className="rounded-20 bg-black-100 mt-26 flex h-146 w-full flex-col items-center gap-31 pt-15">
                    <p className="text-black-700 text-lg font-semibold">
                        아직 열람한 사람이 없어요!
                    </p>
                    <AvatarIcon className="text-black-400 size-46" />
                </div>
            ) : (
                <div className="mt-22 grid grid-cols-2 gap-x-27 gap-y-26 pb-22">
                    {profiles.map(p => (
                        <ProfileCard
                            key={p.id}
                            {...p}
                            onClick={() => navigate(cardDetailPath(p.id))}
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
