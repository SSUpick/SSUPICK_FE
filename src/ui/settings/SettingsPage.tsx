import { Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { CtaButton } from '@/components/button/CtaButton';
import { Modal } from '@/components/feedback/Modal';
import { ChevronRightIcon } from '@/components/icon/ChevronRightIcon';
import { PageHeader } from '@/components/layout/PageHeader';
import { ROUTES } from '@/constants/routes';
import { toast } from '@/store/toastStore';

const KAKAO_CHANNEL = 'http://pf.kakao.com/_xjJrxbX/chat';
const SUPPORT_EMAIL = 'seunghyun020907@naver.com';

type ModalKind = 'inquiry' | 'logout' | 'withdraw' | null;

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

export function SettingsPage() {
    const navigate = useNavigate();
    const [modal, setModal] = useState<ModalKind>(null);

    const closeModal = () => setModal(null);

    const handleLogout = () => {
        // TODO: API 연동 — 로그아웃 (토큰 클리어, 캐시 초기화)
        closeModal();
        navigate(ROUTES.LOGIN, { replace: true });
        toast.success('로그아웃됐어요.');
    };

    const handleWithdraw = () => {
        // TODO: API 연동 — 회원 탈퇴
        closeModal();
        navigate(ROUTES.LOGIN, { replace: true });
        toast.success('탈퇴 처리됐어요.');
    };

    const sections: SettingsSection[] = [
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
                { label: '문의하기', onClick: () => setModal('inquiry'), showArrow: true },
                { label: '로그아웃', onClick: () => setModal('logout') },
                { label: '회원탈퇴', onClick: () => setModal('withdraw') },
            ],
        },
    ];

    return (
        <div className="flex w-full flex-col">
            <PageHeader title="설정" />

            <div className="-mx-20 flex flex-col gap-6 pt-4">
                {sections.map((section, idx) => (
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

            <Modal open={modal !== null} onClose={closeModal}>
                {modal === 'inquiry' && <InquiryDialog onClose={closeModal} />}
                {modal === 'logout' && (
                    <ConfirmDialog
                        title="로그아웃 하시겠어요?"
                        description="다시 로그인하면 동일한 계정으로 이용할 수 있어요."
                        confirmLabel="로그아웃"
                        onCancel={closeModal}
                        onConfirm={handleLogout}
                    />
                )}
                {modal === 'withdraw' && (
                    <ConfirmDialog
                        title="정말 탈퇴하시겠어요?"
                        description="프로필 카드와 쿠폰을 포함한 계정 정보가 삭제되고, 복구할 수 없어요."
                        confirmLabel="탈퇴하기"
                        onCancel={closeModal}
                        onConfirm={handleWithdraw}
                    />
                )}
            </Modal>
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

type InquiryDialogProps = {
    onClose: () => void;
};

function InquiryDialog({ onClose }: InquiryDialogProps) {
    return (
        <div className="rounded-20 bg-white-default flex flex-col items-center gap-16 px-22 py-24">
            <p className="text-black-800 text-base font-semibold tracking-tight">
                문의 채널
            </p>
            <p className="text-black-500 text-center text-sm leading-22 font-medium tracking-tight">
                서비스 이용 중 궁금한 점이 있다면
                <br />
                아래 채널로 편하게 연락 주세요.
            </p>

            <div className="flex w-full flex-col gap-8">
                <a
                    href={KAKAO_CHANNEL}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-kakao-yellow text-kakao-text rounded-14 flex h-50 w-full items-center justify-center text-base font-semibold tracking-tight"
                >
                    카카오톡 1:1 문의
                </a>
                <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="bg-black-100 text-black-800 rounded-14 flex h-50 w-full flex-col items-center justify-center text-xs font-semibold tracking-tight"
                >
                    <span className="text-black-500 text-2xs font-medium">이메일</span>
                    <span>{SUPPORT_EMAIL}</span>
                </a>
            </div>

            <button
                type="button"
                onClick={onClose}
                className="text-black-500 text-sm font-medium tracking-tight"
            >
                닫기
            </button>
        </div>
    );
}

type ConfirmDialogProps = {
    title: string;
    description?: string;
    confirmLabel: string;
    onCancel: () => void;
    onConfirm: () => void;
};

function ConfirmDialog({
    title,
    description,
    confirmLabel,
    onCancel,
    onConfirm,
}: ConfirmDialogProps) {
    return (
        <div className="rounded-20 bg-white-default flex flex-col items-center gap-16 px-22 py-24">
            <div className="flex flex-col items-center gap-8">
                <p className="text-black-800 text-center text-base font-semibold tracking-tight">
                    {title}
                </p>
                {description && (
                    <p className="text-black-500 text-center text-sm leading-22 font-medium tracking-tight">
                        {description}
                    </p>
                )}
            </div>

            <div className="grid w-full grid-cols-2 gap-8">
                <CtaButton variant="secondary" onClick={onCancel}>
                    취소
                </CtaButton>
                <CtaButton onClick={onConfirm}>{confirmLabel}</CtaButton>
            </div>
        </div>
    );
}
