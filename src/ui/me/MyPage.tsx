import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import sampleImg from '@/assets/ssuny.webp';
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
    const profiles = tab === 'opened' ? MOCK_PROFILES.slice(0, 4) : [];

    return (
        <div className="flex min-h-svh flex-col bg-white-default">
            <PageHeader
                title="마이페이지"
                rightSlot={
                    <button
                        type="button"
                        aria-label="설정"
                        onClick={() => navigate(ROUTES.SETTINGS)}
                        className="text-black-400"
                    >
                        <GearIcon className="size-22" />
                    </button>
                }
            />

            <section className="flex flex-col items-center gap-12 px-22 pt-12">
                <img
                    src={MY_PROFILE.imageUrl}
                    alt={MY_PROFILE.nickname}
                    className="size-120 rounded-14 object-cover"
                />
                <p className="text-lg font-bold text-black-900">{MY_PROFILE.nickname}</p>
                <OutlineChipButton onClick={() => navigate(ROUTES.ME_EDIT)}>
                    내 정보 수정
                </OutlineChipButton>
            </section>

            <section className="px-22 pt-22">
                <button
                    type="button"
                    onClick={() => navigate(ROUTES.COUPON)}
                    className="flex h-58 w-full items-center justify-between rounded-14 border border-pink-default/40 bg-pink-light px-18"
                >
                    <div className="flex items-center gap-12">
                        <img
                            src={couponImg}
                            alt=""
                            aria-hidden
                            className="size-32 object-contain"
                        />
                        <span className="text-base font-semibold text-black-800">내 쿠폰</span>
                    </div>
                    <span className="text-lg font-bold text-pink-point">
                        {MY_PROFILE.couponCount}개
                    </span>
                </button>
            </section>

            <div className="mt-22 h-12 bg-black-100" />

            <div className="grid grid-cols-2 border-b border-black-200">
                <TabButton active={tab === 'opened'} onClick={() => setTab('opened')}>
                    내가 열람한 사람
                </TabButton>
                <TabButton active={tab === 'openedMe'} onClick={() => setTab('openedMe')}>
                    나를 열람한 사람
                </TabButton>
            </div>

            {profiles.length === 0 ? (
                <div className="m-22 flex flex-col items-center justify-center gap-14 rounded-14 bg-black-100 py-44">
                    <p className="text-sm font-medium text-black-700">아직 열람한 사람이 없어요!</p>
                    <AvatarIcon className="size-44 text-black-400" />
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-x-23 gap-y-26 px-22 py-22">
                    {profiles.map(p => (
                        <ProfileCard
                            key={p.id}
                            {...p}
                            onClick={() => navigate(cardDetailPath(p.id))}
                        />
                    ))}
                </div>
            )}
        </div>
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
            className={`relative flex h-44 items-center justify-center text-base font-semibold ${
                active ? 'text-black-800' : 'text-black-400'
            }`}
        >
            {children}
            {active && (
                <span aria-hidden className="absolute right-0 -bottom-1 left-0 h-2 bg-black-800" />
            )}
        </button>
    );
}
