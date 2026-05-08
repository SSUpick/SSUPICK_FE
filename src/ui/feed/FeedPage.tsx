import { useNavigate } from 'react-router-dom';

import { ProfileCard } from '@/components/card/ProfileCard';
import { cardDetailPath } from '@/constants/routes';
import { MOCK_PROFILES } from '@/features/feed/mock';
import { useNavigateToast } from '@/hooks/useNavigateToast';

import { FeedHeader } from './_parts/FeedHeader';

export function FeedPage() {
    const navigate = useNavigate();
    useNavigateToast();

    return (
        <div className="bg-white-default relative flex min-h-svh w-full flex-col">
            <FeedHeader title="이상형을 찾아보세요!" />

            <main className="grid grid-cols-2 justify-items-center gap-x-23 gap-y-26 px-22 pb-30">
                {MOCK_PROFILES.map(p => (
                    <ProfileCard key={p.id} {...p} onClick={() => navigate(cardDetailPath(p.id))} />
                ))}
            </main>
        </div>
    );
}
