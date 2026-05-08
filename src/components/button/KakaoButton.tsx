import kakaoIcon from '@/assets/kakao_logo.svg';

type KakaoButtonProps = {
    onClick?: () => void;
};

export function KakaoButton({ onClick }: KakaoButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="rounded-14 bg-kakao-yellow flex h-58 w-full items-center justify-between px-10"
        >
            <div className="flex items-center justify-center">
                <img src={kakaoIcon} alt="" aria-hidden />
            </div>
            <span className="text-kakao-text text-lg font-semibold">카카오로 계속하기</span>
            <span aria-hidden className="w-31" />
        </button>
    );
}
