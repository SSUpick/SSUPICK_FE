type PencilIconProps = {
    className?: string;
};

export function PencilIcon({ className }: PencilIconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
            className={className}
        >
            <path
                d="M4 20h4l10-10-4-4L4 16v4Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
            <path
                d="m13.5 6.5 4 4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    );
}
