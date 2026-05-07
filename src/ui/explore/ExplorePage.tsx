import { useNavigate } from 'react-router-dom';

import { ProfileCard } from '@/components/card/ProfileCard';
import { CtaButton } from '@/components/button/CtaButton';
import { ROUTES, cardDetailPath } from '@/constants/routes';
import { MOCK_PROFILES } from '@/features/feed/mock';

import { FeedHeader } from '../feed/_parts/FeedHeader';

export function ExplorePage() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-svh w-full flex-col bg-white-default">
            <FeedHeader title="이상형을 찾아보세요!" />

            <main className="grid grid-cols-2 gap-x-23 gap-y-26 px-22 pb-100">
                {MOCK_PROFILES.map(p => (
                    <ProfileCard key={p.id} {...p} onClick={() => navigate(cardDetailPath(p.id))} />
                ))}
            </main>

            <div className="sticky bottom-0 bg-white-default px-22 py-14">
                <CtaButton className="w-full" onClick={() => navigate(ROUTES.PROFILE_CREATE)}>
                    프로필 등록하기
                </CtaButton>
            </div>
        </div>
    );
}
