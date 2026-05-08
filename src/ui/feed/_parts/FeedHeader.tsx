import { useNavigate } from 'react-router-dom';

import { AvatarIcon } from '@/components/icon/AvatarIcon';
import { TicketIcon } from '@/components/icon/TicketIcon';
import { ROUTES } from '@/constants/routes';

type FeedHeaderProps = {
    title: string;
};

export function FeedHeader({ title }: FeedHeaderProps) {
    const navigate = useNavigate();

    return (
        <header className="flex items-center justify-between px-22 pt-14 pb-14">
            <h1 className="text-2xl font-semibold text-black-900">{title}</h1>
            <div className="flex items-center gap-8">
                <button
                    type="button"
                    aria-label="쿠폰"
                    onClick={() => navigate(ROUTES.COUPON)}
                    className="rounded-full bg-pink-point p-4 text-white-default"
                >
                    <TicketIcon className="size-24" />
                </button>
                <button
                    type="button"
                    aria-label="마이페이지"
                    onClick={() => navigate(ROUTES.ME)}
                    className="rounded-full bg-pink-light p-4 text-pink-point"
                >
                    <AvatarIcon className="size-24" />
                </button>
            </div>
        </header>
    );
}
