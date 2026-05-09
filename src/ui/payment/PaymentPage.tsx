import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import couponImg from '@/assets/coupon.webp';
import { CtaButton } from '@/components/button/CtaButton';
import { PageHeader } from '@/components/layout/PageHeader';
import { usePayment } from '@/features/payment/hooks/usePayment';
import type { CouponProduct } from '@/features/payment/types';

const formatPrice = (n: number) => `${n.toLocaleString('ko-KR')}원`;

export function PaymentPage() {
    const [params] = useSearchParams();
    const count = Number(params.get('count') ?? '1');
    const price = Number(params.get('price') ?? '1000');
    const product = (params.get('product') ?? 'COUPON_1') as CouponProduct;
    const orderName = params.get('orderName') ?? `쿠폰 ${count}개`;

    const [method, setMethod] = useState<'card' | null>('card');
    const { pay, isPending } = usePayment();

    const handlePay = () => {
        pay(product, price, orderName);
    };

    return (
        <div className="bg-white-default flex min-h-svh flex-col">
            <PageHeader title="결제하기" />

            <section className="flex items-center justify-between py-14">
                <div className="flex items-center gap-14">
                    <img src={couponImg} alt="" aria-hidden className="size-58 object-contain" />
                    <div className="flex flex-col items-start">
                        <span className="text-black-800 text-lg font-bold">쿠폰</span>
                        <span className="text-black-400 text-xs font-medium">수량 {count}개</span>
                    </div>
                </div>
                <span className="text-black-800 text-xl font-bold">{formatPrice(price)}</span>
            </section>

            <div className="bg-black-100 h-12" />

            <section className="flex flex-col gap-12 pt-20 pb-20">
                <h2 className="text-black-800 text-base font-semibold">결제 방법</h2>
                <button
                    type="button"
                    onClick={() => setMethod('card')}
                    className={`rounded-10 bg-white-default flex h-58 w-full items-center justify-center border text-base font-medium ${
                        method === 'card'
                            ? 'border-pink-point text-pink-point'
                            : 'border-black-300 text-black-800'
                    }`}
                >
                    신용 · 체크카드
                </button>
            </section>

            <div className="mt-auto pb-22">
                <CtaButton
                    className="w-full"
                    onClick={handlePay}
                    loading={isPending}
                    disabled={method === null}
                >
                    {formatPrice(price)} 결제하기
                </CtaButton>
            </div>
        </div>
    );
}
