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
        <div className="flex min-h-svh flex-col bg-pink-light">
            <PageHeader title="쿠폰 결제하기" />

            <ul className="flex flex-col gap-12 px-22 pt-22">
                {COUPON_PLANS.map(plan => (
                    <li key={plan.id}>
                        <button
                            type="button"
                            onClick={() => handleSelect(plan)}
                            className="flex h-90 w-full items-center justify-between rounded-14 bg-white-default px-18"
                        >
                            <div className="flex items-center gap-14">
                                <img
                                    src={couponImg}
                                    alt=""
                                    aria-hidden
                                    className="size-58 object-contain"
                                />
                                <div className="flex flex-col items-start">
                                    <span className="text-lg font-bold text-black-800">
                                        {plan.count}개
                                    </span>
                                    <span className="text-xs font-medium text-black-400">
                                        {plan.count}회 열람
                                    </span>
                                </div>
                            </div>
                            <span className="text-xl font-bold text-pink-point">
                                {formatPrice(plan.price)}
                            </span>
                        </button>
                    </li>
                ))}
            </ul>

            <button
                type="button"
                className="mt-auto self-end px-22 pb-22 text-sm font-medium text-black-400"
            >
                문의하기
            </button>
        </div>
    );
}
