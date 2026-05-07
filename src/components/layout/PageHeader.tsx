import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { ChevronLeftIcon } from '@/components/icon/ChevronLeftIcon';

type PageHeaderProps = {
    title?: ReactNode;
    showBack?: boolean;
    onBack?: () => void;
    rightSlot?: ReactNode;
};

export function PageHeader({
    title,
    showBack = true,
    onBack,
    rightSlot,
}: PageHeaderProps) {
    const navigate = useNavigate();
    const handleBack = () => {
        if (onBack) onBack();
        else navigate(-1);
    };

    return (
        <header className="relative flex h-44 items-center justify-between px-22">
            <div className="flex items-center">
                {showBack && (
                    <button
                        type="button"
                        aria-label="뒤로 가기"
                        onClick={handleBack}
                        className="text-black-800"
                    >
                        <ChevronLeftIcon className="size-24" />
                    </button>
                )}
            </div>
            {title && (
                <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold text-black-800">
                    {title}
                </h1>
            )}
            <div className="flex items-center">{rightSlot}</div>
        </header>
    );
}
