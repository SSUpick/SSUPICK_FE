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
            <circle cx="12" cy="9" r="4" fill="currentColor" />
            <path
                d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"
                fill="currentColor"
            />
        </svg>
    );
}
