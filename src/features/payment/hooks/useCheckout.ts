import { useMutation } from '@tanstack/react-query';

import { getCheckoutPage } from '@/features/payment/api';
import type { CouponProduct } from '@/features/payment/types';
import { toast } from '@/store/toastStore';

export function useCheckout(product: CouponProduct) {
    const { mutate: checkout, isPending } = useMutation({
        mutationFn: () => {
            sessionStorage.setItem('pendingCouponProduct', product);
            return getCheckoutPage(product);
        },
        onSuccess: html => {
            const redirectUrl = `${window.location.origin}/payment/complete?couponProduct=${product}`;

            // 데스크탑: checkout HTML이 response 수신 후 redirect를 하지 않으므로 직접 주입
            // 모바일: PortOne이 redirectUrl로 직접 리다이렉트하므로 이 코드는 실행되지 않음
            // → sessionStorage fallback으로 couponProduct 복원 (PaymentCompletePage 참고)
            const modifiedHtml = html.replace(
                'console.log("response:", response);',
                `console.log("response:", response);
      if (response && response.paymentId && !response.code) {
        window.location.href = '${redirectUrl}&paymentId=' + response.paymentId;
      }`,
            );

            document.open();
            document.write(modifiedHtml);
            document.close();
        },
        onError: err => {
            console.error('[Payment] checkout 실패', err);
            toast.error('결제 페이지를 불러오는 데 실패했어요.');
        },
    });

    return { checkout, isPending };
}
