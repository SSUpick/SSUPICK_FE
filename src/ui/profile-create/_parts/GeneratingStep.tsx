import { useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import chatBubble_white from '@/assets/chatBubble_white.svg';
import waitingVideo from '@/assets/loop_video.mp4';
import { getAiImageStatus } from '@/features/ai-image/api';
import type { AiImageResponseDto } from '@/features/ai-image/types';

type Bubble = { id: number; text: string };

const TIMELINE: { time: number; text: string }[] = [
    { time: 1000, text: '흠… 느낌 좋은데?' },
    { time: 3500, text: '눈이 말해주고 있어.' },
    { time: 6000, text: '조금만 기다려, 거의 다 됐어!' },
    { time: 8000, text: '곧 만나자, 너만의 캐릭터로!' },
];

const TOP_CLASSES = ['top-240', 'top-160', 'top-80'];
const MAX_BUBBLES = 3;
const POLL_INTERVAL = 2000;

type GeneratingStepProps = {
    aiImageId: number | null;
    onDone: (result: AiImageResponseDto) => void;
    onError: () => void;
};

export function GeneratingStep({ aiImageId, onDone, onError }: GeneratingStepProps) {
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const handledRef = useRef(false);

    // 말풍선 애니메이션 타임라인
    useEffect(() => {
        let nextId = 0;
        const timers = TIMELINE.map(({ time, text }) =>
            window.setTimeout(() => {
                setBubbles(prev => [...prev, { id: nextId++, text }].slice(-MAX_BUBBLES));
            }, time),
        );
        return () => timers.forEach(window.clearTimeout);
    }, []);

    // 상태 폴링
    const { data: statusData } = useQuery({
        queryKey: ['ai-image', aiImageId, 'status'],
        queryFn: () => getAiImageStatus(aiImageId!),
        enabled: aiImageId !== null,
        refetchInterval: query => {
            const status = query.state.data?.status;
            if (status === 'DONE' || status === 'FAILED') return false;
            return POLL_INTERVAL;
        },
    });

    useEffect(() => {
        if (!statusData || handledRef.current) return;
        if (statusData.status === 'DONE') {
            handledRef.current = true;
            onDone(statusData);
        } else if (statusData.status === 'FAILED') {
            handledRef.current = true;
            onError();
        }
    }, [statusData, onDone, onError]);

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
