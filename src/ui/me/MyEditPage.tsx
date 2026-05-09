import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import defaultProfileImg from '@/assets/bg_onBoarding.webp';
import { CtaButton } from '@/components/button/CtaButton';
import { CloseRoundIcon } from '@/components/icon/CloseRoundIcon';
import { PencilIcon } from '@/components/icon/PencilIcon';
import { PlusIcon } from '@/components/icon/PlusIcon';
import { SpinnerIcon } from '@/components/icon/SpinnerIcon';
import { PageHeader } from '@/components/layout/PageHeader';
import { ROUTES } from '@/constants/routes';
import { updateUserProfile } from '@/features/user/api';
import { useUserProfile } from '@/features/user/hooks/useUserProfile';
import { KEYWORD_MAX_LENGTH, MAX_KEYWORDS, keywordsSchema } from '@/schemas/keyword';
import { toast } from '@/store/toastStore';
import { sanitizeInput } from '@/utils/sanitize';
import { getImageUrl } from '@/utils/getImageUrl';

type EditFormValues = {
    nickname: string;
    mbti: string;
    contact: string;
};

export function MyEditPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: profile, isLoading } = useUserProfile();

    const { register, handleSubmit, setValue, reset } = useForm<EditFormValues>();
    const [appeals, setAppeals] = useState<string[]>(['']);
    const [appealError, setAppealError] = useState<string | null>(null);

    useEffect(() => {
        if (!profile) return;
        reset({
            nickname: profile.nickname,
            mbti: profile.mbti,
            contact: profile.contact,
        });
        setAppeals(profile.appeals.length > 0 ? profile.appeals : ['']);
    }, [profile, reset]);

    const { mutate: submitUpdate, isPending } = useMutation({
        mutationFn: updateUserProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
            navigate(ROUTES.ME, {
                replace: true,
                state: { toast: '프로필 수정에 성공했습니다!' },
            });
        },
        onError: () => toast.error('프로필 수정에 실패했어요.'),
    });

    const onSubmit = handleSubmit(values => {
        const result = keywordsSchema.safeParse(appeals);
        if (!result.success) {
            setAppealError(result.error.issues[0]?.message ?? '키워드 형식 오류');
            return;
        }
        setAppealError(null);
        submitUpdate({
            nickname: sanitizeInput(values.nickname).trim(),
            mbti: values.mbti.trim(),
            appeals: appeals.map(k => sanitizeInput(k).trim()),
            contact: sanitizeInput(values.contact).trim(),
        });
    });

    const updateAppeal = (idx: number, val: string) => {
        setAppeals(ks => ks.map((k, i) => (i === idx ? val : k)));
        setAppealError(null);
    };
    const removeAppeal = (idx: number) => {
        setAppeals(ks => ks.filter((_, i) => i !== idx));
        setAppealError(null);
    };
    const addAppeal = () => {
        setAppeals(ks => [...ks, '']);
        setAppealError(null);
    };

    if (isLoading) {
        return (
            <div className="flex min-h-svh items-center justify-center">
                <SpinnerIcon className="text-pink-point size-44" />
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} className="flex flex-1 flex-col">
            <PageHeader title="프로필 수정하기" />

            <div className="mt-30 flex justify-center">
                <img
                    src={getImageUrl(profile?.profileUrl, defaultProfileImg)}
                    onError={e => {
                        e.currentTarget.src = defaultProfileImg;
                    }}
                    alt="내 프로필"
                    className="rounded-8 drop-shadow-card h-285 w-228 object-cover"
                />
            </div>

            <div className="mt-46 flex flex-col gap-26">
                <Field label="닉네임">
                    <EditableInput
                        field={register('nickname', { required: true, maxLength: 10 })}
                        onClear={() => setValue('nickname', '')}
                        placeholder="닉네임을 입력해주세요"
                    />
                </Field>

                <Field label="MBTI">
                    <EditableInput
                        field={register('mbti', { required: true, maxLength: 4 })}
                        onClear={() => setValue('mbti', '')}
                        placeholder="예: INTJ"
                    />
                </Field>

                <Field
                    label="키워드"
                    labelClass="text-22"
                    helper="* 1칸 당 최대 8자 제한이 있어요."
                    error={appealError}
                >
                    <div className="flex flex-col gap-10">
                        {appeals.map((kw, idx) => (
                            <KeywordInput
                                key={idx}
                                value={kw}
                                onChange={v => updateAppeal(idx, v)}
                                onRemove={() => removeAppeal(idx)}
                                placeholder="최대 8자"
                                allowRemove={appeals.length > 1}
                            />
                        ))}
                        {appeals.length < MAX_KEYWORDS && (
                            <button
                                type="button"
                                onClick={addAppeal}
                                aria-label="키워드 추가"
                                className="border-pink-default rounded-10 bg-white-default flex h-60 w-full items-center justify-center border"
                            >
                                <PlusIcon className="text-pink-default size-38" />
                            </button>
                        )}
                    </div>
                </Field>

                <Field label="연락처" labelClass="text-22">
                    <PlainInput
                        field={register('contact', { required: true, maxLength: 50 })}
                        placeholder="예: @ssu_pick"
                    />
                </Field>
            </div>

            <div className="mt-auto pt-30 pb-22">
                <CtaButton type="submit" disabled={isPending} className="w-full">
                    {isPending ? (
                        <span className="flex items-center justify-center gap-8">
                            <SpinnerIcon className="size-18" />
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

type FieldProps = {
    label: string;
    labelClass?: string;
    helper?: string;
    error?: string | null;
    children: React.ReactNode;
};

function Field({ label, labelClass = 'text-lg', helper, error, children }: FieldProps) {
    return (
        <div>
            <label className={`text-black-800 font-semibold ${labelClass}`}>{label}</label>
            {helper && <p className="text-black-400 mt-5 text-base font-medium">{helper}</p>}
            {error && <p className="text-red-default mt-5 text-sm font-medium">{error}</p>}
            <div className={helper || error ? 'mt-16' : 'mt-10'}>{children}</div>
        </div>
    );
}

type EditableInputProps = {
    field: UseFormRegisterReturn;
    onClear: () => void;
    placeholder?: string;
};

function EditableInput({ field, onClear, placeholder }: EditableInputProps) {
    const [focused, setFocused] = useState(false);
    return (
        <div className="bg-black-100 rounded-10 flex h-60 items-center px-14">
            <input
                {...field}
                placeholder={placeholder}
                onChange={e => {
                    e.target.value = sanitizeInput(e.target.value);
                    field.onChange(e);
                }}
                onFocus={() => setFocused(true)}
                onBlur={e => {
                    setFocused(false);
                    field.onBlur(e);
                }}
                className="text-black-800 placeholder:text-black-400 min-w-0 flex-1 bg-transparent text-base font-medium outline-none"
            />
            <PencilIcon />
            {focused && (
                <button
                    type="button"
                    aria-label="입력 지우기"
                    onMouseDown={e => e.preventDefault()}
                    onClick={onClear}
                    className="text-black-400 ml-6 shrink-0"
                >
                    <CloseRoundIcon className="size-24" />
                </button>
            )}
        </div>
    );
}

type KeywordInputProps = {
    value: string;
    onChange: (val: string) => void;
    onRemove: () => void;
    placeholder?: string;
    allowRemove: boolean;
};

function KeywordInput({ value, onChange, onRemove, placeholder, allowRemove }: KeywordInputProps) {
    const [focused, setFocused] = useState(false);
    return (
        <div className="bg-black-100 rounded-10 flex h-60 items-center px-14">
            <input
                value={value}
                onChange={e => onChange(sanitizeInput(e.target.value))}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={placeholder}
                maxLength={KEYWORD_MAX_LENGTH}
                className="text-black-800 placeholder:text-black-400 min-w-0 flex-1 bg-transparent text-base font-medium outline-none"
            />
            <PencilIcon />
            {focused && allowRemove && (
                <button
                    type="button"
                    aria-label="키워드 삭제"
                    onMouseDown={e => e.preventDefault()}
                    onClick={onRemove}
                    className="text-black-400 ml-6 shrink-0"
                >
                    <CloseRoundIcon className="size-24" />
                </button>
            )}
        </div>
    );
}

type PlainInputProps = {
    field: UseFormRegisterReturn;
    placeholder?: string;
};

function PlainInput({ field, placeholder }: PlainInputProps) {
    return (
        <div className="bg-black-100 rounded-10 flex h-60 items-center px-14">
            <input
                {...field}
                placeholder={placeholder}
                onChange={e => {
                    e.target.value = sanitizeInput(e.target.value);
                    field.onChange(e);
                }}
                className="text-black-800 placeholder:text-black-400 min-w-0 flex-1 bg-transparent text-base font-medium outline-none"
            />
        </div>
    );
}
