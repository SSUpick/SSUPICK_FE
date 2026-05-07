import { useNavigate } from 'react-router-dom';

import couponImg from '@/assets/coupon.webp';
import { AvatarIcon } from '@/components/icon/AvatarIcon';
import { ROUTES } from '@/constants/routes';

type FeedHeaderProps = {
    title: string;
};

export function FeedHeader({ title }: FeedHeaderProps) {
    const navigate = useNavigate();

    return (
        <header className="flex items-center justify-between px-22 pt-14 pb-14">
            <h1 className="text-2xl font-bold text-black-900">{title}</h1>
            <div className="flex items-center gap-8">
                <button
                    type="button"
                    aria-label="쿠폰"
                    onClick={() => navigate(ROUTES.COUPON)}
                    className="flex size-32 items-center justify-center rounded-full bg-pink-point"
                >
                    <img
                        src={couponImg}
                        alt=""
                        aria-hidden
                        className="size-20 object-contain"
                    />
                </button>
                <button
                    type="button"
                    aria-label="마이페이지"
                    onClick={() => navigate(ROUTES.ME)}
                    className="flex size-32 items-center justify-center rounded-full bg-pink-light text-pink-point"
                >
                    <AvatarIcon className="size-20" />
                </button>
            </div>
        </header>
    );
}
