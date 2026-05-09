import * as PortOne from '@portone/browser-sdk/v2';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { useUserProfile } from '@/features/user/hooks/useUserProfile';
import { toast } from '@/store/toastStore';

import { verifyPayment } from '../api';
import type { CouponProduct } from '../types';

type PaymentState = 'idle' | 'pending' | 'success' | 'error';

export function usePayment() {
    const [state, setState] = useState<PaymentState>('idle');
    const navigate = useNavigate();
    const { data: profile } = useUserProfile();

    const pay = async (couponProduct: CouponProduct, price: number, orderName: string) => {
        setState('pending');

        // INIpay oid 제한 40자 이내
        const paymentId = `sp${Date.now()}${Math.random().toString(36).slice(2, 8)}`;

        // SDK 타입 정의에 alipayPlus가 required로 잘못 선언돼 있어 타입 단언으로 우회
        const response = await PortOne.requestPayment({
            storeId: import.meta.env.VITE_PORTONE_STORE_ID as string,
            channelKey: import.meta.env.VITE_PORTONE_CHANNEL_KEY as string,
            paymentId,
            orderName,
            totalAmount: price,
            currency: 'KRW',
            payMethod: 'CARD',
            customer: {
                email: profile?.email,
                fullName: profile?.name,
                phoneNumber: '01000000000', // TODO: 온보딩에 전화번호 수집 후 교체
            },
            // 모바일 리다이렉트 후 PaymentPgPage에서 verify 처리
            redirectUrl: `${window.location.origin}${ROUTES.PAYMENT_PG}?couponProduct=${couponProduct}`,
        } as Parameters<typeof PortOne.requestPayment>[0]);

        // 모바일 리다이렉트 모드: response === undefined (페이지 이탈)
        if (response === undefined) return;

        // 취소 또는 오류
        if (response.code) {
            setState('error');
            if (response.code !== 'USER_CANCEL') {
                toast.error('결제에 실패했어요. 다시 시도해주세요.');
            } else {
                setState('idle');
            }
            return;
        }

        // 팝업 결제 성공 → 검증
        try {
            await verifyPayment(response.paymentId, { couponProduct });
            setState('success');
            navigate(ROUTES.COUPON, {
                replace: true,
                state: { toast: '쿠폰 충전이 완료됐어요!' },
            });
        } catch {
            setState('error');
            toast.error('결제 검증에 실패했어요. 고객센터에 문의해주세요.');
        }
    };

    return { pay, isPending: state === 'pending' };
}
