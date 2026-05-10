import defaultProfileImg from '@/assets/bg_onBoarding.webp';
import manIcon from '@/assets/man_icon.svg';
import womanIcon from '@/assets/woman_icon.svg';
import type { Gender } from '@/features/user/types';
import { getImageUrl } from '@/utils/getImageUrl';

type ProfileCardProps = {
    profileUrl: string;
    nickname: string;
    mbti: string;
    appeals: string[];
    gender: Gender;
    onClick?: () => void;
};

export function ProfileCard({
    profileUrl,
    nickname,
    mbti,
    appeals,
    gender,
    onClick,
}: ProfileCardProps) {
    const isWoman = gender === 'FEMALE';
    const genderIcon = isWoman ? womanIcon : manIcon;
    const mbtiClass = isWoman ? 'bg-pink-light text-pink-point' : 'bg-blue-100 text-blue-800';

    return (
        <button type="button" onClick={onClick} className="flex w-full flex-col items-start gap-7">
            <img
                src={getImageUrl(profileUrl, defaultProfileImg)}
                onError={e => {
                    e.currentTarget.src = defaultProfileImg;
                }}
                alt={nickname}
                className="rounded-8 aspect-3/4 w-full object-cover"
            />
            <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-4">
                    <img src={genderIcon} alt="" className="size-15" />
                    <span className="text-black-900 text-sm leading-22 font-semibold">
                        {nickname}
                    </span>
                    <span
                        className={`rounded-4 text-2xs flex h-18 items-center justify-center px-8 font-semibold ${mbtiClass}`}
                    >
                        {mbti}
                    </span>
                </div>
                <ul className="text-black-700 flex flex-col items-start gap-2 text-xs leading-22 font-medium">
                    {appeals.slice(0, 3).map((appeal, idx) => (
                        <li key={`${idx}-${appeal}`}>#{appeal}</li>
                    ))}
                </ul>
            </div>
        </button>
    );
}
