import { useEffect, useState } from 'react';

import chatBubble_white from '@/assets/chatBubble_white.svg';
import waitingVideo from '@/assets/loop_video.mp4';

type Bubble = { id: number; text: string };

const TIMELINE: { time: number; text: string }[] = [
    { time: 1000, text: '흠… 느낌 좋은데?' },
    { time: 3500, text: '눈이 말해주고 있어.' },
    { time: 6000, text: '조금만 기다려, 거의 다 됐어!' },
    { time: 8000, text: '곧 만나자, 너만의 캐릭터로!' },
];

// reverseIndex 0 = 가장 아래(최신 등장), 2 = 가장 위(가장 오래된)
const TOP_CLASSES = ['top-240', 'top-160', 'top-80'];

const TOTAL_DURATION = 10000;
const MAX_BUBBLES = 3;

type GeneratingStepProps = {
    onDone: () => void;
};

export function GeneratingStep({ onDone }: GeneratingStepProps) {
    const [bubbles, setBubbles] = useState<Bubble[]>([]);

    useEffect(() => {
        let nextId = 0;
        const timers = TIMELINE.map(({ time, text }) =>
            window.setTimeout(() => {
                setBubbles(prev => [...prev, { id: nextId++, text }].slice(-MAX_BUBBLES));
            }, time),
        );
        const doneTimer = window.setTimeout(onDone, TOTAL_DURATION);

        return () => {
            timers.forEach(window.clearTimeout);
            window.clearTimeout(doneTimer);
        };
    }, [onDone]);

    return (
        <div className="relative min-h-dvh w-full">
            <div className="pointer-events-none absolute inset-y-0 -right-20 -left-20 overflow-hidden">
                <video
                    src={waitingVideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    aria-hidden
                    className="absolute top-1/2 left-1/2 w-[120dvw] max-w-600 -translate-x-1/2 -translate-y-1/2 object-cover"
                />
            </div>

            {bubbles.map((bubble, i) => {
                const reverseIndex = bubbles.length - 1 - i;
                return (
                    <div
                        key={bubble.id}
                        className={`absolute left-1/2 -translate-x-1/2 transition-all duration-500 ${TOP_CLASSES[reverseIndex]}`}
                    >
                        <div className="animate-bubble-in">
                            <div className="relative">
                                <img src={chatBubble_white} alt="" aria-hidden className="block" />
                                <p className="text-black-800 absolute inset-0 flex items-center justify-center pb-13 text-center text-xs font-medium tracking-tight whitespace-nowrap">
                                    {bubble.text}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
