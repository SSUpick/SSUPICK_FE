import kakaoIcon from '@/assets/kakao_icon.svg';

type KakaoButtonProps = {
    onClick?: () => void;
};

export function KakaoButton({ onClick }: KakaoButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex h-58 w-full items-center justify-between rounded-14 bg-kakao-yellow px-10"
        >
            <img src={kakaoIcon} alt="" aria-hidden className="size-24" />
            <span className="text-lg font-semibold text-kakao-text">카카오로 계속하기</span>
            <span aria-hidden className="size-24" />
        </button>
    );
}
