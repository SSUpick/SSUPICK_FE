import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import sampleImg from '@/assets/ssuny.webp';
import { CtaButton } from '@/components/button/CtaButton';
import { CloseRoundIcon } from '@/components/icon/CloseRoundIcon';
import { PencilIcon } from '@/components/icon/PencilIcon';
import { PlusIcon } from '@/components/icon/PlusIcon';
import { PageHeader } from '@/components/layout/PageHeader';
import { ROUTES } from '@/constants/routes';
import { KEYWORD_MAX_LENGTH, MAX_KEYWORDS, keywordsSchema } from '@/schemas/keyword';
import { sanitizeInput } from '@/utils/sanitize';

const DEFAULT_KEYWORDS = ['고양이상', '키 160cm', '청순'];

type EditFormValues = {
    nickname: string;
    mbti: string;
    contact: string;
};

const DEFAULT_VALUES: EditFormValues = {
    nickname: '숭실대 카리나',
    mbti: 'INTJ',
    contact: '@ssu_pick',
};

export function MyEditPage() {
    const navigate = useNavigate();
    const { register, handleSubmit, setValue } = useForm<EditFormValues>({
        defaultValues: DEFAULT_VALUES,
    });
    const [keywords, setKeywords] = useState<string[]>(DEFAULT_KEYWORDS);
    const [keywordError, setKeywordError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = handleSubmit(async () => {
        const result = keywordsSchema.safeParse(keywords);
        if (!result.success) {
            setKeywordError(result.error.issues[0]?.message ?? '키워드 형식 오류');
            return;
        }
        setKeywordError(null);
        setSubmitting(true);
        // TODO: API 연동 시 전송 직전에 sanitizeInput()+trim() 적용해 payload 구성 (백엔드 parameterized query 필수)
        await new Promise(r => window.setTimeout(r, 600));
        setSubmitting(false);
        navigate(`${ROUTES.FEED}?toast=profileEdit`, { replace: true });
    });

    const updateKeyword = (idx: number, val: string) => {
        setKeywords(ks => ks.map((k, i) => (i === idx ? val : k)));
        setKeywordError(null);
    };
    const removeKeyword = (idx: number) => {
        setKeywords(ks => ks.filter((_, i) => i !== idx));
        setKeywordError(null);
    };
    const addKeyword = () => {
        setKeywords(ks => [...ks, '']);
        setKeywordError(null);
    };

    return (
        <form onSubmit={onSubmit} className="flex flex-1 flex-col">
            <PageHeader title="프로필 수정하기" />

            <div className="mt-30 flex justify-center">
                <img
                    src={sampleImg}
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
                    error={keywordError}
                >
                    <div className="flex flex-col gap-10">
                        {keywords.map((kw, idx) => (
                            <KeywordInput
                                key={idx}
                                value={kw}
                                onChange={v => updateKeyword(idx, v)}
                                onRemove={() => removeKeyword(idx)}
                                placeholder="최대 8자"
                                allowRemove={keywords.length > 1}
                            />
                        ))}
                        {keywords.length < MAX_KEYWORDS && (
                            <button
                                type="button"
                                onClick={addKeyword}
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
                <CtaButton type="submit" loading={submitting} className="w-full">
                    {submitting ? '저장 중...' : '저장하기'}
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

function KeywordInput({
    value,
    onChange,
    onRemove,
    placeholder,
    allowRemove,
}: KeywordInputProps) {
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
