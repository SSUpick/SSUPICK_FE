import { useNavigate } from 'react-router-dom';

import couponImg from '@/assets/coupon.webp';
import { PageHeader } from '@/components/layout/PageHeader';
import { ROUTES } from '@/constants/routes';

type CouponPlan = {
    id: string;
    count: number;
    price: number;
};

const COUPON_PLANS: CouponPlan[] = [
    { id: '1', count: 1, price: 1000 },
    { id: '2', count: 4, price: 3000 },
    { id: '3', count: 8, price: 5000 },
];

const formatPrice = (n: number) => `${n.toLocaleString('ko-KR')}원`;

export function CouponPage() {
    const navigate = useNavigate();

    const handleSelect = (plan: CouponPlan) => {
        navigate(`${ROUTES.PAYMENT}?count=${plan.count}&price=${plan.price}`);
    };

    return (
        <div className="relative flex min-h-dvh w-full flex-col">
            {/* full-bleed pink — Layout px-20 escape (FIGMA.md §9) */}
            <div
                aria-hidden
                className="bg-pink-light pointer-events-none absolute top-0 -right-20 bottom-0 -left-20"
            />

            <div className="relative flex flex-1 flex-col">
                <PageHeader title="쿠폰 결제하기" />

                <ul className="flex flex-col gap-12 pt-22">
                    {COUPON_PLANS.map(plan => (
                        <li key={plan.id}>
                            <button
                                type="button"
                                onClick={() => handleSelect(plan)}
                                className="rounded-14 bg-white-default flex h-90 w-full items-center justify-between px-18"
                            >
                                <div className="flex items-center gap-14">
                                    <img
                                        src={couponImg}
                                        alt=""
                                        aria-hidden
                                        className="size-58 object-contain"
                                    />
                                    <div className="flex flex-col items-start">
                                        <span className="text-black-800 text-lg font-bold">
                                            {plan.count}개
                                        </span>
                                        <span className="text-black-400 text-xs font-medium">
                                            {plan.count}회 열람
                                        </span>
                                    </div>
                                </div>
                                <span className="text-pink-point text-xl font-bold">
                                    {formatPrice(plan.price)}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>

                <button
                    type="button"
                    className="text-black-400 mt-auto self-end pb-22 text-sm font-medium"
                >
                    문의하기
                </button>
            </div>
        </div>
    );
}
