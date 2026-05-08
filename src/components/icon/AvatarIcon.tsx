type AvatarIconProps = {
    className?: string;
};

export function AvatarIcon({ className }: AvatarIconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
            className={className}
        >
            <circle cx="12" cy="8" r="4.5" fill="currentColor" />
            <path
                d="M3 20c0-3.866 4.029-7 9-7s9 3.134 9 7H3Z"
                fill="currentColor"
            />
        </svg>
    );
}
