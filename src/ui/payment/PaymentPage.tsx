import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import couponImg from '@/assets/coupon.webp';
import { CtaButton } from '@/components/button/CtaButton';
import { PageHeader } from '@/components/layout/PageHeader';
import { ROUTES } from '@/constants/routes';

const formatPrice = (n: number) => `${n.toLocaleString('ko-KR')}원`;

export function PaymentPage() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const count = Number(params.get('count') ?? '1');
    const price = Number(params.get('price') ?? '1000');
    const [method, setMethod] = useState<'card' | null>('card');

    const handlePay = () => {
        navigate(`${ROUTES.PAYMENT_PG}?count=${count}&price=${price}`);
    };

    return (
        <div className="flex min-h-svh flex-col bg-white-default">
            <PageHeader title="결제하기" />

            <section className="flex items-center justify-between px-22 py-14">
                <div className="flex items-center gap-14">
                    <img
                        src={couponImg}
                        alt=""
                        aria-hidden
                        className="size-58 object-contain"
                    />
                    <div className="flex flex-col items-start">
                        <span className="text-lg font-bold text-black-800">쿠폰</span>
                        <span className="text-xs font-medium text-black-400">
                            수량 {count}개
                        </span>
                    </div>
                </div>
                <span className="text-xl font-bold text-black-800">
                    {formatPrice(price)}
                </span>
            </section>

            <div className="h-12 bg-black-100" />

            <section className="flex flex-col gap-12 px-22 pt-20 pb-20">
                <h2 className="text-base font-semibold text-black-800">결제 방법</h2>
                <button
                    type="button"
                    onClick={() => setMethod('card')}
                    className={`flex h-58 w-full items-center justify-center rounded-10 border bg-white-default text-base font-medium ${
                        method === 'card'
                            ? 'border-pink-point text-pink-point'
                            : 'border-black-300 text-black-800'
                    }`}
                >
                    신용 · 체크카드
                </button>
            </section>

            <div className="mt-auto px-22 pb-22">
                <CtaButton className="w-full" onClick={handlePay}>
                    {formatPrice(price)} 결제하기
                </CtaButton>
            </div>
        </div>
    );
}
