import { createBrowserRouter } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { LoginPage } from '@/ui/auth/LoginPage';
import { KakaoCallbackPage } from '@/ui/auth/KakaoCallbackPage';
import { OnboardingPage } from '@/ui/onboarding/OnboardingPage';
import { TermsPage } from '@/ui/legal/TermsPage';
import { PrivacyPage } from '@/ui/legal/PrivacyPage';
import { RefundPage } from '@/ui/legal/RefundPage';
import { ProfileCreatePage } from '@/ui/profile-create/ProfileCreatePage';
import { CardDetailPage } from '@/ui/explore/CardDetailPage';
import { ExplorePage } from '@/ui/explore/ExplorePage';
import { CouponPage } from '@/ui/coupon/CouponPage';
import { PaymentPage } from '@/ui/payment/PaymentPage';
import { PaymentCompletePage } from '@/ui/payment/PaymentCompletePage';
import { MyPage } from '@/ui/me/MyPage';
import { MyEditPage } from '@/ui/me/MyEditPage';
import { SettingsPage } from '@/ui/settings/SettingsPage';
import { ServerErrorPage } from '@/ui/error/ServerErrorPage';
import { NotFoundPage } from '@/ui/error/NotFoundPage';
import { SplashPage } from '@/ui/splash/SplashPage';

import { Layout } from './layout/Layout';
import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { path: ROUTES.ROOT, element: <SplashPage /> },
            { path: ROUTES.LOGIN, element: <LoginPage /> },
            { path: ROUTES.KAKAO_CALLBACK, element: <KakaoCallbackPage /> },
            { path: ROUTES.SERVER_ERROR, element: <ServerErrorPage /> },
            { path: '*', element: <NotFoundPage /> },
            {
                element: <ProtectedRoute />,
                children: [
                    { path: ROUTES.ONBOARDING, element: <OnboardingPage /> },
                    { path: ROUTES.TERMS, element: <TermsPage /> },
                    { path: ROUTES.PRIVACY, element: <PrivacyPage /> },
                    { path: ROUTES.REFUND, element: <RefundPage /> },
                    { path: ROUTES.PROFILE_CREATE, element: <ProfileCreatePage /> },
                    { path: ROUTES.CARD_DETAIL, element: <CardDetailPage /> },
                    { path: ROUTES.EXPLORE, element: <ExplorePage /> },
                    { path: ROUTES.COUPON, element: <CouponPage /> },
                    { path: ROUTES.PAYMENT, element: <PaymentPage /> },
                    { path: ROUTES.PAYMENT_COMPLETE, element: <PaymentCompletePage /> },
                    { path: ROUTES.ME, element: <MyPage /> },
                    { path: ROUTES.ME_EDIT, element: <MyEditPage /> },
                    { path: ROUTES.SETTINGS, element: <SettingsPage /> },
                ],
            },
        ],
    },
]);
