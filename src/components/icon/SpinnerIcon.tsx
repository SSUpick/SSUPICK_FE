type SpinnerIconProps = {
    className?: string;
};

export function SpinnerIcon({ className }: SpinnerIconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
            className={`animate-spin ${className ?? ''}`}
        >
            <path
                d="M12 4a8 8 0 1 1-8 8"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
            />
        </svg>
    );
}
