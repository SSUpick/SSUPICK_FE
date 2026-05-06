import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './layout/Layout';
import { ROUTES } from '@/constants/routes';
import { SplashPage } from '@/ui/splash/SplashPage';
import { LoginPage } from '@/ui/auth/LoginPage';
import { KakaoCallbackPage } from '@/ui/auth/KakaoCallbackPage';
import { OnboardingPage } from '@/ui/onboarding/OnboardingPage';
import { TermsPage } from '@/ui/legal/TermsPage';
import { FeedPage } from '@/ui/feed/FeedPage';
import { CardDetailPage } from '@/ui/feed/CardDetailPage';
import { MyPage } from '@/ui/me/MyPage';
import { ServerErrorPage } from '@/ui/error/ServerErrorPage';
import { NotFoundPage } from '@/ui/error/NotFoundPage';

export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { path: ROUTES.ROOT, element: <SplashPage /> },
            { path: ROUTES.LOGIN, element: <LoginPage /> },
            { path: ROUTES.KAKAO_CALLBACK, element: <KakaoCallbackPage /> },
            { path: ROUTES.ONBOARDING, element: <OnboardingPage /> },
            { path: ROUTES.TERMS, element: <TermsPage /> },
            { path: ROUTES.FEED, element: <FeedPage /> },
            { path: ROUTES.CARD_DETAIL, element: <CardDetailPage /> },
            { path: ROUTES.ME, element: <MyPage /> },
            { path: ROUTES.SERVER_ERROR, element: <ServerErrorPage /> },
            { path: '*', element: <NotFoundPage /> },
        ],
    },
]);
