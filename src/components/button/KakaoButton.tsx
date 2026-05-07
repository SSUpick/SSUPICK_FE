import kakaoIcon from '@/assets/kakao_icon.svg';

type KakaoButtonProps = {
    onClick?: () => void;
};

export function KakaoButton({ onClick }: KakaoButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="relative flex h-58 w-full items-center justify-center rounded-14 bg-kakao-yellow text-lg font-semibold text-kakao-text"
        >
            <img
                src={kakaoIcon}
                alt=""
                aria-hidden
                className="absolute left-20 size-24"
            />
            카카오로 계속하기
        </button>
    );
}
