import { Link } from 'react-router-dom';

import { ChevronRightIcon } from '@/components/icon/ChevronRightIcon';
import { PageHeader } from '@/components/layout/PageHeader';
import { ROUTES } from '@/constants/routes';

type SettingsLink = {
    label: string;
    to?: string;
    onClick?: () => void;
    showArrow?: boolean;
};

type SettingsSection = {
    label: string;
    items: SettingsLink[];
};

export function SettingsPage() {
    const sections: SettingsSection[] = [
        {
            label: '약관',
            items: [
                { label: '서비스 이용약관', to: ROUTES.TERMS, showArrow: true },
                { label: '개인정보 수집 및 이용 동의', to: ROUTES.TERMS, showArrow: true },
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

    return (
        <div className="bg-white-default flex min-h-svh flex-col">
            <PageHeader title="설정" />

            <div className="flex flex-1 flex-col px-22 pt-12">
                {sections.map((section, idx) => (
                    <section
                        key={section.label}
                        className={idx === 0 ? 'pb-20' : 'border-black-200 border-t pt-20 pb-20'}
                    >
                        <p className="text-black-400 pb-12 text-xs font-medium">{section.label}</p>
                        <ul className="flex flex-col">
                            {section.items.map(item => (
                                <li key={item.label}>
                                    <SettingsRow {...item} />
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>
        </div>
    );
}

function SettingsRow({ label, to, onClick, showArrow }: SettingsLink) {
    const inner = (
        <span className="text-black-800 flex h-44 w-full items-center justify-between text-base font-medium">
            {label}
            {showArrow && <ChevronRightIcon className="text-black-400 size-20" />}
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
