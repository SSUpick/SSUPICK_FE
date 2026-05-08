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
        <header className="flex items-center justify-between pt-14 pb-14">
            <h1 className="text-black-900 text-22 font-semibold">{title}</h1>
            <div className="flex items-center gap-10">
                <button
                    type="button"
                    aria-label="쿠폰"
                    onClick={() => navigate(ROUTES.COUPON)}
                    className="bg-pink-point rounded-full p-4"
                >
                    <div className="flex size-24 items-center justify-center">
                        <TicketIcon className="h-16 w-20" />
                    </div>
                </button>
                <button
                    type="button"
                    aria-label="마이페이지"
                    onClick={() => navigate(ROUTES.ME)}
                    className="bg-pink-light text-pink-point rounded-full p-4"
                >
                    <AvatarIcon className="size-24" />
                </button>
            </div>
        </header>
    );
}
