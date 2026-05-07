import sampleImg from '@/assets/ssuny.webp';
import { CtaButton } from '@/components/button/CtaButton';
import { ProfileCard } from '@/components/card/ProfileCard';

type Profile = {
    id: string;
    imageUrl: string;
    nickname: string;
    mbti: string;
    keywords: string[];
    gender: 'woman' | 'man';
};

const MOCK_PROFILES: Profile[] = [
    { id: '1', imageUrl: sampleImg, nickname: '숭실대 카리나', mbti: 'INTJ', keywords: ['최대8글자입니다', '최대8글자입니다', '최대8글자입니다'], gender: 'woman' },
    { id: '2', imageUrl: sampleImg, nickname: '숭실대 차은우', mbti: 'ESFP', keywords: ['최대8글자입니다', '최대8글자입니다', '최대8글자입니다'], gender: 'man' },
    { id: '3', imageUrl: sampleImg, nickname: '숭실대 카리나', mbti: 'INTJ', keywords: ['고양이상', '청순'], gender: 'woman' },
    { id: '4', imageUrl: sampleImg, nickname: '숭실대 차은우', mbti: 'ESFP', keywords: ['최대8글자입니다', '최대8글자입니다', '최대8글자입니다'], gender: 'man' },
    { id: '5', imageUrl: sampleImg, nickname: '숭실대 카리나', mbti: 'INTJ', keywords: ['고양이상', '청순'], gender: 'woman' },
    { id: '6', imageUrl: sampleImg, nickname: '숭실대 차은우', mbti: 'ESFP', keywords: ['최대8글자입니다', '최대8글자입니다', '최대8글자입니다'], gender: 'man' },
    { id: '7', imageUrl: sampleImg, nickname: '숭실대 카리나', mbti: 'INTJ', keywords: ['고양이상', '청순'], gender: 'woman' },
    { id: '8', imageUrl: sampleImg, nickname: '숭실대 차은우', mbti: 'ESFP', keywords: ['최대8글자입니다', '최대8글자입니다', '최대8글자입니다'], gender: 'man' },
];

export function ExplorePage() {
    return (
        <div className="flex min-h-svh w-full flex-col bg-white-default">
            <header className="flex items-center justify-between px-22 pt-71 pb-20">
                <h1 className="w-236 text-2xl font-semibold text-black-900">
                    이상형을 찾아보세요!
                </h1>
                <div className="flex items-center gap-10">
                    <button
                        type="button"
                        aria-label="쿠폰"
                        className="flex size-32 items-center justify-center rounded-full bg-pink-point"
                    />
                    <button
                        type="button"
                        aria-label="마이페이지"
                        className="flex size-32 items-center justify-center rounded-full bg-pink-light"
                    />
                </div>
            </header>

            <main className="grid flex-1 grid-cols-2 gap-x-23 gap-y-26 px-22 pb-100">
                {MOCK_PROFILES.map((p) => (
                    <ProfileCard key={p.id} {...p} />
                ))}
            </main>

            <div className="sticky bottom-0 px-21 py-20 bg-white-default">
                <CtaButton className="w-full">프로필 등록하기</CtaButton>
            </div>
        </div>
    );
}
