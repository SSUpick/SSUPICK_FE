type TicketIconProps = {
    className?: string;
};

export function TicketIcon({ className }: TicketIconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
            className={className}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2.5a1.5 1.5 0 0 0 0 3V15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2.5a1.5 1.5 0 0 0 0-3V7Z"
                fill="currentColor"
            />
            <line x1="9" y1="5" x2="9" y2="17" stroke="white" strokeWidth="1.5" strokeDasharray="2 2" />
        </svg>
    );
}
