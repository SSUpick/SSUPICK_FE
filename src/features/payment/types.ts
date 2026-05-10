export type CouponProduct = 'COUPON_1' | 'COUPON_4' | 'COUPON_8';

export type PaymentVerifyRequestDto = {
    couponProduct: CouponProduct;
};

export type PaymentVerifyResponseDto = {
    paymentId: string;
    status: string;
    totalAmount: number;
    chargedCouponCount: number;
    remainingCouponCount: number;
};

export type CouponProductResponseDto = {
    productCode: CouponProduct;
    orderName: string;
    couponCount: number;
    price: number;
};
