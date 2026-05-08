import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import airplaneImg from '@/assets/airplane.webp';
import couponImg from '@/assets/coupon.webp';
import lockImg from '@/assets/lock.webp';
import womanIcon from '@/assets/woman_icon.svg';
import manIcon from '@/assets/man_icon.svg';
import { CtaButton } from '@/components/button/CtaButton';
import { Toast } from '@/components/feedback/Toast';
import { PageHeader } from '@/components/layout/PageHeader';
import { ROUTES } from '@/constants/routes';
import { findProfileById } from '@/features/feed/mock';

const CURRENT_COUPONS = 1;
const SAMPLE_CONTACT = '@ssupick';

export function CardDetailPage() {
    const { profileId } = useParams<{ profileId: string }>();
    const navigate = useNavigate();
    const profile = profileId ? findProfileById(profileId) : undefined;

    const [unlocked, setUnlocked] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [modal, setModal] = useState<'coupon' | 'lock' | null>(null);

    if (!profile) {
        return (
            <div className="flex min-h-svh items-center justify-center">
                <p className="text-black-700 text-base">존재하지 않는 카드입니다.</p>
            </div>
        );
    }

    const isWoman = profile.gender === 'woman';
    const genderIcon = isWoman ? womanIcon : manIcon;
    const mbtiClass = isWoman ? 'bg-pink-light text-pink-point' : 'bg-blue-100 text-blue-800';

    const handleOpenAttempt = () => {
        if (CURRENT_COUPONS > 0) setModal('coupon');
        else setModal('lock');
    };

    const handleConfirmOpen = () => {
        // TODO: API 연동 — 쿠폰 차감 + 프로필 열람
        setModal(null);
        setUnlocked(true);
        setShowToast(true);
        window.setTimeout(() => setShowToast(false), 2000);
    };

    return (
        <div className="bg-white-default relative flex min-h-svh flex-col">
            <PageHeader title={profile.nickname} />

            {showToast && (
                <div className="pointer-events-none fixed top-66 left-1/2 z-30 -translate-x-1/2">
                    <Toast message="프로필 열람에 성공했어요!" />
                </div>
            )}

            <div className="px-22 pt-12">
                <img
                    src={profile.imageUrl}
                    alt={profile.nickname}
                    className="rounded-14 aspect-9/10 w-full object-cover"
                />
            </div>

            <div className="flex flex-col items-center gap-10 px-22 pt-20">
                <div className="flex items-center gap-6">
                    <img src={genderIcon} alt="" className="size-20" />
                    <span className="text-black-900 text-lg font-bold">{profile.nickname}</span>
                    <span
                        className={`rounded-4 flex h-22 items-center px-8 text-xs font-semibold ${mbtiClass}`}
                    >
                        {profile.mbti}
                    </span>
                </div>
                <ul className="text-black-700 flex flex-col items-center gap-4 text-sm font-medium">
                    {profile.keywords.slice(0, 3).map((kw, idx) => (
                        <li key={`${idx}-${kw}`}>#{kw}</li>
                    ))}
                </ul>
            </div>

            <section className="mt-24 px-22">
                <div className="flex items-center gap-8 pb-12">
                    <img src={airplaneImg} alt="" aria-hidden className="size-20" />
                    <h2 className="text-black-800 text-base font-semibold">연락처</h2>
                </div>
                {unlocked && (
                    <div className="rounded-14 bg-pink-light text-pink-point flex w-full items-center justify-center px-16 py-14 text-base font-semibold">
                        {SAMPLE_CONTACT}
                    </div>
                )}
            </section>

            {!unlocked && (
                <div className="mt-auto px-22 pb-22">
                    <button
                        type="button"
                        onClick={handleOpenAttempt}
                        className="rounded-14 bg-pink-default text-white-default flex h-58 w-full items-center justify-center gap-8 text-lg font-semibold"
                    >
                        <img
                            src={couponImg}
                            alt=""
                            aria-hidden
                            className="size-22 object-contain"
                        />
                        쿠폰으로 열람하기
                    </button>
                </div>
            )}

            {modal && (
                <Backdrop onClose={() => setModal(null)}>
                    {modal === 'coupon' ? (
                        <CouponConfirmDialog
                            currentCount={CURRENT_COUPONS}
                            onConfirm={handleConfirmOpen}
                        />
                    ) : (
                        <NoCouponDialog
                            onGoToCoupon={() => {
                                setModal(null);
                                navigate(ROUTES.COUPON);
                            }}
                        />
                    )}
                </Backdrop>
            )}
        </div>
    );
}

type BackdropProps = {
    children: React.ReactNode;
    onClose: () => void;
};

function Backdrop({ children, onClose }: BackdropProps) {
    return (
        <div
            className="bg-black-900/40 fixed inset-0 z-40 flex items-center justify-center px-22"
            onClick={onClose}
        >
            <div onClick={e => e.stopPropagation()} className="w-full max-w-340">
                {children}
            </div>
        </div>
    );
}

type CouponConfirmDialogProps = {
    currentCount: number;
    onConfirm: () => void;
};

function CouponConfirmDialog({ currentCount, onConfirm }: CouponConfirmDialogProps) {
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
            <CtaButton className="w-full" onClick={onConfirm}>
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
