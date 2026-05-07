import womanIcon from '@/assets/woman_icon.svg';
import manIcon from '@/assets/man_icon.svg';

type ProfileCardProps = {
    imageUrl: string;
    nickname: string;
    mbti: string;
    keywords: string[];
    gender: 'woman' | 'man';
    onClick?: () => void;
};

export function ProfileCard({
    imageUrl,
    nickname,
    mbti,
    keywords,
    gender,
    onClick,
}: ProfileCardProps) {
    const isWoman = gender === 'woman';
    const genderIcon = isWoman ? womanIcon : manIcon;
    const mbtiClass = isWoman
        ? 'bg-pink-light text-pink-point'
        : 'bg-blue-100 text-blue-800';

    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-160 flex-col items-start gap-7"
        >
            <img
                src={imageUrl}
                alt={nickname}
                className="h-200 w-160 rounded-8 object-cover"
            />
            <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-4">
                    <img src={genderIcon} alt="" className="size-15" />
                    <span className="text-sm font-semibold text-black-900">
                        {nickname}
                    </span>
                    <span
                        className={`flex h-18 items-center justify-center rounded-4 px-8 text-2xs font-semibold ${mbtiClass}`}
                    >
                        {mbti}
                    </span>
                </div>
                <ul className="flex flex-col items-start gap-2 text-xs font-medium text-black-700">
                    {keywords.slice(0, 3).map((kw, idx) => (
                        <li key={`${idx}-${kw}`}>#{kw}</li>
                    ))}
                </ul>
            </div>
        </button>
    );
}
