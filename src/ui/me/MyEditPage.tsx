import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import sampleImg from '@/assets/ssuny.webp';
import { CtaButton } from '@/components/button/CtaButton';
import { PencilIcon } from '@/components/icon/PencilIcon';
import { SpinnerIcon } from '@/components/icon/SpinnerIcon';
import { PageHeader } from '@/components/layout/PageHeader';
import { ROUTES } from '@/constants/routes';

type EditFormValues = {
    nickname: string;
    mbti: string;
    keyword1: string;
    keyword2: string;
    keyword3: string;
    contact: string;
};

const DEFAULT_VALUES: EditFormValues = {
    nickname: '숭실대 카리나',
    mbti: 'INTJ',
    keyword1: '고양이상',
    keyword2: '키 160cm',
    keyword3: '청순',
    contact: '@ssu_pick',
};

export function MyEditPage() {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm<EditFormValues>({
        defaultValues: DEFAULT_VALUES,
    });
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = handleSubmit(async () => {
        setSubmitting(true);
        // TODO: API 연동 — 프로필 수정
        await new Promise((r) => window.setTimeout(r, 600));
        setSubmitting(false);
        navigate(`${ROUTES.FEED}?toast=profileEdit`, { replace: true });
    });

    return (
        <form onSubmit={onSubmit} className="flex min-h-svh flex-col bg-white-default">
            <PageHeader title="프로필 수정하기" />

            <div className="flex justify-center px-22 pt-12">
                <img
                    src={sampleImg}
                    alt="내 프로필"
                    className="aspect-9/10 w-200 rounded-14 object-cover"
                />
            </div>

            <div className="flex flex-col gap-22 px-22 pt-30">
                <FieldGroup label="닉네임">
                    <EditableInput field={register('nickname', { required: true, maxLength: 10 })} />
                </FieldGroup>

                <FieldGroup label="MBTI">
                    <EditableInput field={register('mbti', { required: true, maxLength: 4 })} />
                </FieldGroup>

                <FieldGroup label="키워드" helper="* 1칸 당 최대 8자 제한이 있어요.">
                    <EditableInput field={register('keyword1', { maxLength: 8 })} />
                    <EditableInput field={register('keyword2', { maxLength: 8 })} />
                    <EditableInput field={register('keyword3', { maxLength: 8 })} />
                </FieldGroup>

                <FieldGroup label="연락처">
                    <EditableInput field={register('contact', { required: true, maxLength: 50 })} />
                </FieldGroup>
            </div>

            <div className="mt-auto px-22 pt-22 pb-22">
                <CtaButton type="submit" disabled={submitting} className="w-full">
                    {submitting ? (
                        <span className="flex items-center justify-center gap-8">
                            <SpinnerIcon className="size-20" />
                            저장 중...
                        </span>
                    ) : (
                        '저장하기'
                    )}
                </CtaButton>
            </div>
        </form>
    );
}

type FieldGroupProps = {
    label: string;
    helper?: string;
    children: React.ReactNode;
};

function FieldGroup({ label, helper, children }: FieldGroupProps) {
    return (
        <div className="flex flex-col gap-8">
            <label className="text-base font-semibold text-black-800">{label}</label>
            {helper && (
                <p className="-mt-4 text-xs font-medium text-black-400">{helper}</p>
            )}
            <div className="flex flex-col gap-10">{children}</div>
        </div>
    );
}

type EditableInputProps = {
    field: UseFormRegisterReturn;
};

function EditableInput({ field }: EditableInputProps) {
    return (
        <div className="relative">
            <input
                {...field}
                className="h-50 w-full rounded-10 bg-black-100 px-14 pr-40 text-base font-medium text-black-800 outline-none"
            />
            <PencilIcon className="pointer-events-none absolute top-1/2 right-14 size-20 -translate-y-1/2 text-black-400" />
        </div>
    );
}
