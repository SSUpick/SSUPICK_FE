import bg from '@/assets/bg_onBoarding_wide.webp';
import chatBubble_gray from '@/assets/chatBubble_gray.svg';
import { KakaoButton } from '@/components/button/KakaoButton';
import { PageBackground } from '@/components/layout/PageBackground';
import { useNavigateToast } from '@/hooks/useNavigateToast';

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}&response_type=code`;

function handleKakaoLogin() {
    window.location.href = KAKAO_AUTH_URL;
}

export function LoginPage() {
    useNavigateToast();

    return (
        <>
            <PageBackground />
            <div className="relative min-h-dvh w-full">
                <div className="absolute top-0 -right-20 bottom-0 -left-20 overflow-hidden">
                    <img
                        src={bg}
                        alt=""
                        aria-hidden
                        className="absolute top-1/2 left-1/2 h-dvh max-w-none -translate-x-1/2 -translate-y-1/2"
                    />
                </div>

                <div className="flex min-h-dvh w-full flex-col items-center">
                    <div className="short:h-[26dvh] short:max-h-180 absolute bottom-2/3 flex h-[30dvh] max-h-222 flex-col items-center justify-between text-center whitespace-nowrap">
                        <p className="text-pink-point short:text-base text-lg font-medium tracking-tight">
                            부담 없는 아바타 소개팅, 슈픽
                        </p>
                        <p className="text-black-800 supershort:text-2xl short:text-28 text-3xl font-semibold">
                            사진 한 장으로
                            <br />
                            캐릭터 만들기!
                        </p>

                        <div className="short:h-12 h-20 bg-transparent" />

                        <div className="animate-bubble-float relative">
                            <img src={chatBubble_gray} alt="" aria-hidden className="block" />
                            <p className="text-white-default absolute inset-0 flex items-center justify-center pb-13 text-center text-xs font-medium tracking-tight whitespace-nowrap">
                                귀여운 캐릭터로 바로 바꿔줄게!
                            </p>
                        </div>
                    </div>
                </div>

                <div className="absolute inset-x-0 bottom-48">
                    <KakaoButton onClick={handleKakaoLogin} />
                </div>
            </div>
        </>
    );
}
