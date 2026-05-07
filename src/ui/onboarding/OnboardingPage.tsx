import { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import bg from '@/assets/bg.webp';
import ssuny from '@/assets/ssuny.webp';
import { CtaButton } from '@/components/button/CtaButton';
import { DialogBubble } from '@/components/feedback/DialogBubble';
import { ROUTES } from '@/constants/routes';

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
                <br />
                {' '}나는 이 섬의 안내자, 슈니야.
            </>
        ),
        showHint: true,
    },
    {
        text: (
            <>
                여기선…
                <br />
                {' '}사람 대신 ‘주민’으로 살아가게 돼.
            </>
        ),
    },
    {
        text: (
            <>
                공개된 주민은
                <br />
                {' '}자신만의 <span className="font-bold">주민 카드</span>를 가져야 해.
            </>
        ),
    },
    {
        text: (
            <>
                사진 한 장만 주면,
                <br />
                {' '}너를 이 섬의 주민으로 만들어줄게!
            </>
        ),
    },
    {
        text: (
            <>
                부담되면 나중에 해도 괜찮아.
                <br />
                {' '}먼저 주민들을 둘러볼래?
            </>
        ),
        showButtons: true,
    },
];

export function OnboardingPage() {
    const [step, setStep] = useState(0);
    const navigate = useNavigate();

    const current = STEPS[step];
    const isLast = step === STEPS.length - 1;

    const handleTap = () => {
        if (current.showButtons) return;
        if (!isLast) setStep(step + 1);
    };

    return (
        <div
            onClick={handleTap}
            className="relative min-h-svh w-full overflow-hidden"
        >
            <img
                src={bg}
                alt=""
                aria-hidden
                className="pointer-events-none absolute inset-0 size-full object-cover"
            />
            <img
                src={ssuny}
                alt=""
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-1/2 h-989 w-474 -translate-x-1/2 -translate-y-1/2 object-contain"
            />

            <div className="absolute bottom-135 left-1/2 w-355 -translate-x-1/2">
                <DialogBubble>{current.text}</DialogBubble>
            </div>

            {current.showHint && (
                <p className="absolute bottom-72 left-1/2 -translate-x-1/2 text-lg font-semibold text-white-default/80 whitespace-nowrap">
                    터치해서 계속하기
                </p>
            )}

            {current.showButtons && (
                <div className="absolute bottom-44 left-1/2 flex -translate-x-1/2 gap-20">
                    <CtaButton
                        variant="secondary"
                        className="px-50"
                        onClick={() => navigate(ROUTES.EXPLORE)}
                    >
                        둘러보기
                    </CtaButton>
                    <CtaButton className="px-40">프로필 만들기</CtaButton>
                </div>
            )}
        </div>
    );
}
