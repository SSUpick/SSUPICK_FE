import { useNavigate } from 'react-router-dom';

import bg from '@/assets/bg_onBoarding.webp';
import chatBubble_gray from '@/assets/chatBubble_gray.svg';
import { KakaoButton } from '@/components/button/KakaoButton';
import { ROUTES } from '@/constants/routes';

export function LoginPage() {
    const navigate = useNavigate();

    //TODO: 카카오 로그인 연동

    return (
        <div className="relative min-h-dvh w-full">
            <div className="absolute top-0 -right-20 bottom-0 -left-20 overflow-hidden">
                <img
                    src={bg}
                    alt=""
                    aria-hidden
                    className="absolute -bottom-115 left-1/2 max-w-none -translate-x-1/2"
                />
            </div>

            <div className="flex min-h-dvh w-full flex-col items-center">
                <div className="absolute top-105 flex flex-col items-center gap-20 text-center whitespace-nowrap">
                    <p className="text-pink-point text-lg font-medium tracking-tight">
                        부담 없는 아바타 소개팅, 슈픽
                    </p>
                    <p className="text-black-800 text-3xl font-semibold">
                        사진 한 장으로
                        <br />
                        캐릭터 만들기!
                    </p>

                    <div className="mt-49 flex items-center justify-center">
                        <img src={chatBubble_gray} alt="" aria-hidden className="absolute block" />
                        <p className="text-white-default z-1 flex items-center justify-center pb-13 text-center text-xs font-medium tracking-tight whitespace-nowrap">
                            귀여운 캐릭터로 바로 바꿔줄게!
                        </p>
                    </div>
                </div>

                <div className="absolute inset-x-0 bottom-48">
                    <KakaoButton onClick={() => navigate(ROUTES.ONBOARDING)} />
                </div>
            </div>
        </div>
    );
}
