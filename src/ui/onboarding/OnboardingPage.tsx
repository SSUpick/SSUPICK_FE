import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import helloVideo from '@/assets/hello_loop.mp4';
import { CtaButton } from '@/components/button/CtaButton';
import { DialogBubble } from '@/components/feedback/DialogBubble';
import { PageBackground } from '@/components/layout/PageBackground';
import { ROUTES } from '@/constants/routes';
import { trackEvent } from '@/utils/analytics';

type Step = {
    text: ReactNode;
    showHint?: boolean;
    showButtons?: boolean;
};

const STEPS: Step[] = [
    {
        text: (
            <>
                기다리고 있었어.
                <br /> 나는 이 섬의 안내자, 슈니야.
            </>
        ),
        showHint: true,
    },
    {
        text: (
            <>
                여기선…
                <br /> 사람 대신 ‘주민’으로 살아가게 돼.
            </>
        ),
    },
    {
        text: (
            <>
                공개된 주민은
                <br /> 자신만의 주민 카드를 가져야 해.
            </>
        ),
    },
    {
        text: (
            <>
                사진 한 장만 주면,
                <br /> 너를 이 섬의 주민으로 만들어줄게!
            </>
        ),
    },
    {
        text: (
            <>
                부담되면 나중에 해도 괜찮아.
                <br /> 먼저 주민들을 둘러볼래?
            </>
        ),
        showButtons: true,
    },
];

const ONBOARDING_SEEN_KEY = 'onboarding_seen';

export function OnboardingPage() {
    const [step, setStep] = useState(0);
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (localStorage.getItem(ONBOARDING_SEEN_KEY)) {
            navigate(ROUTES.EXPLORE, { replace: true });
        }
    }, [navigate]);

    // 모바일에서 백그라운드 → 복귀 시 자동 재생 보장
    useEffect(() => {
        const resume = () => {
            const v = videoRef.current;
            if (!v || document.visibilityState !== 'visible') return;
            if (v.paused) v.play().catch(() => {});
        };
        document.addEventListener('visibilitychange', resume);
        window.addEventListener('pageshow', resume);
        return () => {
            document.removeEventListener('visibilitychange', resume);
            window.removeEventListener('pageshow', resume);
        };
    }, []);

    const current = STEPS[step];
    const isLast = step === STEPS.length - 1;

    const handleTap = () => {
        if (current.showButtons) return;
        if (!isLast) {
            const next = step + 1;
            if (STEPS[next].showButtons) {
                localStorage.setItem(ONBOARDING_SEEN_KEY, '1');
            }
            setStep(next);
        }
    };

    return (
        <>
            <PageBackground />
            <div onClick={handleTap} className="relative min-h-dvh w-full">
                <div className="absolute top-0 -right-20 bottom-0 -left-20 overflow-hidden">
                    <video
                        ref={videoRef}
                        src={helloVideo}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute bottom-0 left-1/2 w-[120dvw] max-w-520 -translate-x-1/2 object-cover"
                    />
                </div>

                <div className="absolute bottom-120 left-1/2 w-full -translate-x-1/2">
                    <DialogBubble>{current.text}</DialogBubble>
                </div>

                {current.showHint && (
                    <p className="text-white-default/80 absolute bottom-70 left-1/2 -translate-x-1/2 animate-pulse text-lg font-medium tracking-tight whitespace-nowrap">
                        터치해서 계속하기
                    </p>
                )}

                {current.showButtons && (
                    <div className="absolute bottom-44 left-1/2 grid w-full -translate-x-1/2 grid-cols-2 gap-20">
                        <CtaButton
                            variant="secondary"
                            onClick={() => {
                                trackEvent('onboarding_explore_click');
                                navigate(ROUTES.EXPLORE);
                            }}
                        >
                            둘러보기
                        </CtaButton>
                        <CtaButton
                            onClick={() => {
                                trackEvent('onboarding_profile_create_click');
                                navigate(ROUTES.PROFILE_CREATE);
                            }}
                        >
                            프로필 만들기
                        </CtaButton>
                    </div>
                )}
            </div>
        </>
    );
}
