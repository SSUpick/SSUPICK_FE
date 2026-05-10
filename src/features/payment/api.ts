import type { CommonResponse } from '@/types/api';
import { http } from '@/utils/http';

import type {
    CouponProduct,
    CouponProductResponseDto,
    PaymentVerifyRequestDto,
    PaymentVerifyResponseDto,
} from './types';

export const getCheckoutPage = (couponProduct: CouponProduct) =>
    http
        .post('/api/payments/checkout', null, {
            params: { couponProduct },
            responseType: 'text',
        })
        .then(r => r.data as string);

export const getCouponProducts = () =>
    http
        .get<CommonResponse<CouponProductResponseDto[]>>('/api/payments/coupon-products')
        .then(r => r.data.data);

export const verifyPayment = (paymentId: string, body: PaymentVerifyRequestDto) =>
    http
        .post<CommonResponse<PaymentVerifyResponseDto>>(`/api/payments/${paymentId}/verify`, body)
        .then(r => r.data.data);
