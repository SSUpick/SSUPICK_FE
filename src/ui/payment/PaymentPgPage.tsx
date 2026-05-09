import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { PageHeader } from '@/components/layout/PageHeader';
import { verifyPayment } from '@/features/payment/api';
import type { CouponProduct } from '@/features/payment/types';
import { ROUTES } from '@/constants/routes';
import { toast } from '@/store/toastStore';

// 모바일에서 PortOne 리다이렉트 후 paymentId / couponProduct 쿼리로 돌아옴
export function PaymentPgPage() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const calledRef = useRef(false);

    const paymentId = params.get('paymentId');
    const couponProduct = params.get('couponProduct') as CouponProduct | null;

    useEffect(() => {
        if (!paymentId || !couponProduct || calledRef.current) return;
        calledRef.current = true;

        verifyPayment(paymentId, { couponProduct })
            .then(() => {
                navigate(ROUTES.COUPON, {
                    replace: true,
                    state: { toast: '쿠폰 충전이 완료됐어요!' },
                });
            })
            .catch(() => {
                toast.error('결제 검증에 실패했어요. 고객센터에 문의해주세요.');
                navigate(ROUTES.COUPON, { replace: true });
            });
    }, [paymentId, couponProduct, navigate]);

    return (
        <div className="bg-white-default flex min-h-svh flex-col">
            <PageHeader title="결제하기" />
            <div className="flex flex-1 items-center justify-center">
                <p className="text-black-400 text-center text-base font-medium">
                    결제 결과를 확인하고 있어요…
                </p>
            </div>
        </div>
    );
}
