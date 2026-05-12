import { useNavigate } from 'react-router-dom';

import couponImg from '@/assets/coupon.webp';
import { SpinnerIcon } from '@/components/icon/SpinnerIcon';
import { PageHeader } from '@/components/layout/PageHeader';
import { ROUTES } from '@/constants/routes';
import { useCouponProducts } from '@/features/payment/hooks/useCouponProducts';
import type { CouponProductResponseDto } from '@/features/payment/types';
import { useNavigateToast } from '@/hooks/useNavigateToast';

const formatPrice = (n: number) => `${n.toLocaleString('ko-KR')}원`;

export function CouponPage() {
    const navigate = useNavigate();
    const { data: products, isLoading } = useCouponProducts();
    useNavigateToast();

    const handleSelect = (plan: CouponProductResponseDto) => {
        navigate(
            `${ROUTES.PAYMENT}?count=${plan.couponCount}&price=${plan.price}&product=${plan.productCode}&orderName=${encodeURIComponent(plan.orderName)}`,
        );
    };

    return (
        <div className="relative flex min-h-dvh w-full flex-col">
            <div
                aria-hidden
                className="from-white-default pointer-events-none absolute top-0 -right-20 bottom-0 -left-20 bg-linear-to-b to-pink-50"
            />

            <div className="relative flex flex-1 flex-col">
                <PageHeader title="쿠폰 구매하기" />

                {isLoading ? (
                    <div className="flex flex-1 items-center justify-center">
                        <SpinnerIcon className="text-pink-point size-44" />
                    </div>
                ) : (
                    <ul className="flex flex-col gap-24 pt-22">
                        {(products ?? []).map(plan => (
                            <li key={plan.productCode}>
                                <button
                                    type="button"
                                    onClick={() => handleSelect(plan)}
                                    className="rounded-14 bg-white-default drop-shadow-coupon narrow:pl-13 narrow:pr-16 narrow:py-20 flex h-111 w-full items-center justify-between border border-pink-100 pt-24 pr-27 pb-24 pl-24"
                                >
                                    <img
                                        src={couponImg}
                                        alt=""
                                        aria-hidden
                                        className="fuckinNarrowest:mr-10 mr-20 h-63 w-89 shrink-0 object-contain"
                                    />
                                    <div className="flex min-w-0 flex-1 items-center justify-between gap-10">
                                        <div className="flex min-w-0 flex-col items-start gap-2">
                                            <span className="text-black-800 narrower:text-base text-left text-lg font-medium">
                                                쿠폰 {plan.couponCount}개
                                            </span>
                                            <span className="text-black-700 narrower:text-2xs text-xs font-normal">
                                                {plan.couponCount}회 조회
                                            </span>
                                        </div>
                                        <span className="text-pink-point narrower:text-xl text-22 font-medium whitespace-nowrap">
                                            {formatPrice(plan.price)}
                                        </span>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                <button
                    type="button"
                    className="text-black-700 mt-auto self-end pb-22 text-lg font-medium"
                >
                    문의하기
                </button>
            </div>
        </div>
    );
}
