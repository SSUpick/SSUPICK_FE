import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { ROUTES } from '@/constants/routes';
import { verifyPayment } from '@/features/payment/api';
import type { CouponProduct } from '@/features/payment/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { toast } from '@/store/toastStore';

export function PaymentCompletePage() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const calledRef = useRef(false);

    const paymentId = params.get('paymentId');
    // 모바일: PortOne이 redirectUrl로 직접 보내기 때문에 couponProduct가 URL에 없음
    // sessionStorage에 저장해둔 값을 fallback으로 사용
    const couponProduct = (params.get('couponProduct') ??
        sessionStorage.getItem('pendingCouponProduct')) as CouponProduct | null;

    useEffect(() => {
        if (!paymentId || !couponProduct || calledRef.current) return;
        calledRef.current = true;

        verifyPayment(paymentId, { couponProduct })
            .then(() => {
                sessionStorage.removeItem('pendingCouponProduct');
                queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
                navigate(ROUTES.COUPON, {
                    replace: true,
                    state: { toast: '쿠폰 충전이 완료됐어요!' },
                });
            })
            .catch(err => {
                sessionStorage.removeItem('pendingCouponProduct');
                if (axios.isAxiosError(err) && err.response?.status === 409) {
                    queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
                    navigate(ROUTES.COUPON, {
                        replace: true,
                        state: { toast: '쿠폰 충전이 완료됐어요!' },
                    });
                    return;
                }
                toast.error('결제 검증에 실패했어요. 고객센터에 문의해주세요.');
                navigate(ROUTES.COUPON, { replace: true });
            });
    }, [paymentId, couponProduct, navigate, queryClient]);

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
