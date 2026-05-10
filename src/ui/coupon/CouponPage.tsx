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
                className="bg-linear-to-b from-white-default to-pink-50 pointer-events-none absolute top-0 -right-20 bottom-0 -left-20"
            />

            <div className="relative flex flex-1 flex-col">
                <PageHeader title="쿠폰 결제하기" />

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
                                    className="rounded-14 bg-white-default border-pink-100 drop-shadow-coupon flex h-111 w-full items-center gap-28 border pt-24 pb-24 pl-24 pr-27"
                                >
                                    <img
                                        src={couponImg}
                                        alt=""
                                        aria-hidden
                                        className="h-63 w-89 shrink-0 object-contain"
                                    />
                                    <div className="flex flex-1 items-center justify-between">
                                        <div className="flex flex-col items-start gap-2">
                                            <span className="text-black-800 text-lg font-medium">
                                                {plan.couponCount}개
                                            </span>
                                            <span className="text-black-700 text-xs font-normal">
                                                {plan.couponCount}회 열람
                                            </span>
                                        </div>
                                        <span className="text-pink-point text-22 font-medium whitespace-nowrap">
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
