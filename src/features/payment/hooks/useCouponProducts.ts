import { useQuery } from '@tanstack/react-query';

import { getCouponProducts } from '../api';

export const useCouponProducts = () =>
    useQuery({
        queryKey: ['payment', 'coupon-products'],
        queryFn: getCouponProducts,
        staleTime: 1000 * 60 * 10,
    });
