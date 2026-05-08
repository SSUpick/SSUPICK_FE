type CloseRoundIconProps = {
    className?: string;
};

export function CloseRoundIcon({ className }: CloseRoundIconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
            className={className}
        >
            <path
                d="M7 7l10 10M17 7L7 17"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
