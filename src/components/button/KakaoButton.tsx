type KakaoButtonProps = {
    onClick?: () => void;
};

export function KakaoButton({ onClick }: KakaoButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex h-58 w-full items-center justify-center rounded-14 bg-kakao-yellow text-lg font-semibold text-kakao-text"
        >
            카카오로 계속하기
        </button>
    );
}
