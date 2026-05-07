import { useNavigate } from 'react-router-dom';

import bg from '@/assets/bg.webp';
import ssuny from '@/assets/ssuny.webp';
import { KakaoButton } from '@/components/button/KakaoButton';
import { SpeechBubble } from '@/components/feedback/SpeechBubble';
import { ROUTES } from '@/constants/routes';

export function LoginPage() {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-svh w-full overflow-hidden">
            <img
                src={bg}
                alt=""
                aria-hidden
                className="pointer-events-none absolute inset-0 size-full object-cover"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-linear-to-b from-white-default to-transparent to-50%"
            />

            <img
                src={ssuny}
                alt=""
                aria-hidden
                className="pointer-events-none absolute bottom-90 left-1/2 h-440 w-auto -translate-x-1/2 object-contain"
            />

            <div className="absolute top-66 left-1/2 flex -translate-x-1/2 flex-col items-center gap-14 text-center whitespace-nowrap">
                <p className="text-base font-medium text-pink-point">
                    부담 없는 아바타 소개팅, 슈픽
                </p>
                <p className="text-3xl font-bold text-black-800">
                    사진 한 장으로
                    <br />
                    캐릭터 만들기!
                </p>
            </div>

            <div className="absolute top-220 left-1/2 -translate-x-1/2">
                <SpeechBubble variant="gray">
                    귀여운 캐릭터로 바로 바꿔줄게!
                </SpeechBubble>
            </div>

            <div className="absolute bottom-44 left-1/2 w-354 -translate-x-1/2">
                <KakaoButton onClick={() => navigate(ROUTES.ONBOARDING)} />
            </div>
        </div>
    );
}
