import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { ChevronRightIcon } from '@/components/icon/ChevronRightIcon';
import { PageHeader } from '@/components/layout/PageHeader';
import { ROUTES } from '@/constants/routes';

type SettingsItem = {
    label: string;
    to?: string;
    onClick?: () => void;
    showArrow?: boolean;
};

type SettingsSection = {
    label: string;
    items: SettingsItem[];
};

const SECTIONS: SettingsSection[] = [
    {
        label: '약관',
        items: [
            { label: '서비스 이용약관', to: ROUTES.TERMS, showArrow: true },
            { label: '개인정보 처리방침', to: ROUTES.PRIVACY, showArrow: true },
        ],
    },
    {
        label: '계정 설정',
        items: [
            { label: '문의하기', showArrow: true },
            { label: '로그아웃' },
            { label: '회원탈퇴' },
        ],
    },
];

export function SettingsPage() {
    return (
        <div className="flex w-full flex-col">
            <PageHeader title="설정" />

            <div className="-mx-20 flex flex-col gap-6 pt-4">
                {SECTIONS.map((section, idx) => (
                    <Fragment key={section.label}>
                        {idx > 0 && <SectionDivider />}
                        <section className="flex flex-col gap-6">
                            <h2 className="text-black-500 flex h-42 items-center px-24 text-sm font-semibold tracking-tight">
                                {section.label}
                            </h2>
                            {section.items.map(item => (
                                <SettingsRow key={item.label} {...item} />
                            ))}
                        </section>
                    </Fragment>
                ))}
            </div>
        </div>
    );
}

function SectionDivider() {
    return (
        <div className="flex h-24 items-center px-24" aria-hidden>
            <div className="bg-black-200 h-px w-full" />
        </div>
    );
}

function SettingsRow({ label, to, onClick, showArrow }: SettingsItem) {
    const inner = (
        <span className="text-black-800 flex h-42 w-full items-center justify-between px-24 text-base font-semibold tracking-tight">
            {label}
            {showArrow && <ChevronRightIcon className="text-black-500 size-16" />}
        </span>
    );

    if (to) {
        return (
            <Link to={to} className="block">
                {inner}
            </Link>
        );
    }

    return (
        <button type="button" onClick={onClick} className="block w-full text-left">
            {inner}
        </button>
    );
}
