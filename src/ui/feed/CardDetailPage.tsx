import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import airplaneImg from '@/assets/airplane.webp';
import couponImg from '@/assets/coupon.webp';
import defaultProfileImg from '@/assets/bg_onBoarding.webp';
import lockImg from '@/assets/lock.webp';
import { CtaButton } from '@/components/button/CtaButton';
import { Modal } from '@/components/feedback/Modal';
import { SpinnerIcon } from '@/components/icon/SpinnerIcon';
import { PageHeader } from '@/components/layout/PageHeader';
import { ROUTES } from '@/constants/routes';
import type { ProfileViewListResponseDto } from '@/features/profile-view/types';
import { getTargetUserProfile } from '@/features/user/api';
import { useUserProfile } from '@/features/user/hooks/useUserProfile';
import type { UserCardResponseDto, UserTargetProfileResponseDto } from '@/features/user/types';
import { toast } from '@/store/toastStore';
import { getImageUrl } from '@/utils/getImageUrl';

export function CardDetailPage() {
    const { profileId } = useParams<{ profileId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const targetUserId = Number(profileId);

    // 카드 기본 정보: explore 캐시 → 열람 목록 캐시 순으로 fallback
    const cards = queryClient.getQueryData<UserCardResponseDto[]>(['user', 'cards']);
    const viewList = queryClient.getQueryData<ProfileViewListResponseDto>([
        'user',
        'me',
        'profile-views',
    ]);
    const card =
        cards?.find(c => c.userId === targetUserId) ??
        viewList?.viewedUsers.find(u => u.userId === targetUserId) ??
        viewList?.viewerUsers.find(u => u.userId === targetUserId) ??
        null;

    // 내가 쿠폰을 써서 열람한 프로필인지 확인
    const isAlreadyViewed = viewList?.viewedUsers.some(u => u.userId === targetUserId) ?? false;

    const { data: myProfile } = useUserProfile();
    const couponCount = myProfile?.remainingCouponCount ?? 0;

    // 이미 열람한 프로필이면 자동으로 연락처 fetch (쿠폰 재차감 없음)
    const { data: autoProfile, isLoading: isAutoLoading } = useQuery({
        queryKey: ['user', targetUserId],
        queryFn: () => getTargetUserProfile(targetUserId),
        enabled: isAlreadyViewed,
        staleTime: Infinity,
    });

    // 이번 세션에서 방금 열람한 경우 (낙관적 표시)
    const [manualContact, setManualContact] = useState<string | null>(null);

    const contact =
        manualContact ??
        autoProfile?.contact ??
        // 이전 세션에서 열람 후 캐시에 남아있는 경우
        queryClient.getQueryData<UserTargetProfileResponseDto>(['user', targetUserId])?.contact ??
        null;

    const unlocked = !!contact;

    const { mutate: unlockProfile, isPending: isUnlocking } = useMutation({
        mutationFn: () => getTargetUserProfile(targetUserId),
        onSuccess: data => {
            queryClient.setQueryData(['user', targetUserId], data);
            setManualContact(data.contact);
            setModal(null);
            toast.success('프로필 열람에 성공했어요!');
        },
        onError: () => {
            setModal(null);
            toast.error('열람에 실패했어요. 쿠폰을 확인해주세요.');
        },
    });

    const [modal, setModal] = useState<'coupon' | 'lock' | null>(null);

    if (!card) {
        return (
            <div className="flex min-h-svh items-center justify-center">
                <p className="text-black-700 text-base">프로필 정보를 찾을 수 없어요.</p>
            </div>
        );
    }

    if (isAlreadyViewed && isAutoLoading) {
        return (
            <div className="flex min-h-svh items-center justify-center">
                <SpinnerIcon className="text-pink-point size-44" />
            </div>
        );
    }

    const handleCopy = async () => {
        if (!contact) return;
        try {
            await navigator.clipboard.writeText(contact);
            toast.success('연락처가 복사됐어요!');
        } catch {
            toast.error('복사에 실패했어요.');
        }
    };

    const handleOpenAttempt = () => {
        if (unlocked) return;
        if (couponCount > 0) setModal('coupon');
        else setModal('lock');
    };

    return (
        <div className="bg-white-default relative flex min-h-dvh flex-col">
            <PageHeader title={card.nickname} />

            <main className="flex flex-1 flex-col items-center gap-13 pt-12 pb-22">
                <img
                    src={getImageUrl(card.profileUrl, defaultProfileImg)}
                    onError={e => {
                        e.currentTarget.src = defaultProfileImg;
                    }}
                    alt={card.nickname}
                    className="rounded-14 aspect-308/385 w-full object-cover"
                />

                <div className="flex flex-col items-center gap-10">
                    <div className="flex items-center gap-7">
                        <span className="text-black-900 text-22 font-semibold">
                            {card.nickname}
                        </span>
                        <span className="rounded-6 bg-pink-light text-pink-point flex h-28 items-center justify-center px-12 text-base font-semibold">
                            {card.mbti}
                        </span>
                    </div>
                    <ul className="text-black-700 flex flex-col items-center gap-10 text-base font-medium">
                        {card.appeals.slice(0, 3).map((appeal, idx) => (
                            <li key={`${idx}-${appeal}`}>#{appeal}</li>
                        ))}
                    </ul>
                </div>

                <section className="mt-auto flex w-full flex-col gap-16">
                    <div className="flex items-center gap-6">
                        <img src={airplaneImg} alt="" aria-hidden className="size-24" />
                        <h2 className="text-black-700 text-xl font-semibold">연락처</h2>
                    </div>

                    {unlocked ? (
                        <div className="bg-pink-light text-pink-point rounded-20 relative flex h-82 w-full items-center justify-center text-xl font-semibold">
                            {contact}
                            <button
                                type="button"
                                onClick={handleCopy}
                                aria-label="연락처 복사"
                                className="absolute right-20"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.8}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-pink-point size-22"
                                    aria-hidden
                                >
                                    <rect x="9" y="9" width="13" height="13" rx="2" />
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={handleOpenAttempt}
                            className="bg-pink-light rounded-20 flex h-82 w-full items-center justify-center gap-8"
                        >
                            <img
                                src={lockImg}
                                alt=""
                                aria-hidden
                                className="size-32 object-contain"
                            />
                            <span className="text-pink-point text-xl font-semibold">
                                쿠폰으로 열람하기
                            </span>
                        </button>
                    )}
                </section>
            </main>

            <Modal open={modal !== null} onClose={() => setModal(null)}>
                {modal === 'coupon' ? (
                    <CouponConfirmDialog
                        currentCount={couponCount}
                        isPending={isUnlocking}
                        onConfirm={() => unlockProfile()}
                    />
                ) : (
                    <NoCouponDialog
                        onGoToCoupon={() => {
                            setModal(null);
                            navigate(ROUTES.COUPON);
                        }}
                    />
                )}
            </Modal>
        </div>
    );
}

type CouponConfirmDialogProps = {
    currentCount: number;
    isPending: boolean;
    onConfirm: () => void;
};

function CouponConfirmDialog({ currentCount, isPending, onConfirm }: CouponConfirmDialogProps) {
    return (
        <div className="rounded-20 bg-white-default flex flex-col items-center gap-16 px-22 py-24">
            <img src={couponImg} alt="" aria-hidden className="h-100 w-auto object-contain" />
            <p className="text-black-800 text-center text-base font-medium">
                상대방 프로필을 열람하려면
                <br />
                쿠폰이 1개 차감돼요.
            </p>
            <p className="text-black-400 text-sm font-medium">
                현재 쿠폰: <span className="text-pink-point font-bold">{currentCount}개</span>
            </p>
            <CtaButton className="w-full" onClick={onConfirm} loading={isPending}>
                열람하기
            </CtaButton>
        </div>
    );
}

type NoCouponDialogProps = {
    onGoToCoupon: () => void;
};

function NoCouponDialog({ onGoToCoupon }: NoCouponDialogProps) {
    return (
        <div className="rounded-20 bg-white-default flex flex-col items-center gap-16 px-22 py-24">
            <img src={lockImg} alt="" aria-hidden className="h-100 w-auto object-contain" />
            <p className="text-black-800 text-center text-base font-medium">
                상대방 프로필을 열람하려면
                <br />
                쿠폰이 필요해요!
            </p>
            <CtaButton className="w-full" onClick={onGoToCoupon}>
                쿠폰 사러가기
            </CtaButton>
        </div>
    );
}
