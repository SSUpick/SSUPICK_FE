import { useEffect } from 'react';

import ssuny from '@/assets/ssuny.webp';
import { SpeechBubble } from '@/components/feedback/SpeechBubble';

import { BackdropScene } from './BackdropScene';

const LINES = [
    '흠.. 느낌 좋은데?',
    '눈이 맑게주고 있어, 어린 사람인지.',
    '조금만 기다려, 거의 다 됐어',
];

type GeneratingStepProps = {
    onDone: () => void;
};

export function GeneratingStep({ onDone }: GeneratingStepProps) {
    useEffect(() => {
        const timer = window.setTimeout(onDone, 2400);
        return () => window.clearTimeout(timer);
    }, [onDone]);

    return (
        <BackdropScene>
            <div className="flex flex-col items-center gap-10 pt-44">
                {LINES.map((line) => (
                    <SpeechBubble key={line} variant="white">
                        {line}
                    </SpeechBubble>
                ))}
            </div>

            <img
                src={ssuny}
                alt=""
                aria-hidden
                className="pointer-events-none absolute bottom-0 left-1/2 h-440 w-auto -translate-x-1/2 object-contain"
            />
        </BackdropScene>
    );
}
