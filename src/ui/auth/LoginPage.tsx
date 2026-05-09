import bg from '@/assets/bg_onBoarding.webp';
import chatBubble_gray from '@/assets/chatBubble_gray.svg';
import { KakaoButton } from '@/components/button/KakaoButton';
import { useNavigateToast } from '@/hooks/useNavigateToast';

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}&response_type=code`;

function handleKakaoLogin() {
    window.location.href = KAKAO_AUTH_URL;
}

export function LoginPage() {
    useNavigateToast();

    return (
        <div className="relative min-h-dvh w-full">
            <div className="absolute top-0 -right-20 bottom-0 -left-20 overflow-hidden">
                <img
                    src={bg}
                    alt=""
                    aria-hidden
                    className="absolute top-1/2 left-1/2 min-h-dvh max-w-none -translate-x-1/2 -translate-y-1/2"
                />
            </div>

            <div className="flex min-h-dvh w-full flex-col items-center">
                <div className="absolute bottom-2/3 flex flex-col items-center gap-20 text-center whitespace-nowrap">
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
                    <KakaoButton onClick={handleKakaoLogin} />
                </div>
            </div>
        </div>
    );
}
