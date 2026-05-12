import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import defaultProfileImg from '@/assets/bg_onBoarding.webp';
import { CtaButton } from '@/components/button/CtaButton';
import { MbtiButton } from '@/components/button/MbtiButton';
import { CloseRoundIcon } from '@/components/icon/CloseRoundIcon';
import { PencilIcon } from '@/components/icon/PencilIcon';
import { PlusIcon } from '@/components/icon/PlusIcon';
import { SpinnerIcon } from '@/components/icon/SpinnerIcon';
import { PageHeader } from '@/components/layout/PageHeader';
import { ROUTES } from '@/constants/routes';
import { updateUserProfile } from '@/features/user/api';
import { useUserProfile } from '@/features/user/hooks/useUserProfile';
import type { UserProfileResponseDto } from '@/features/user/types';
import { KEYWORD_MAX_LENGTH, MAX_KEYWORDS, keywordsSchema } from '@/schemas/keyword';
import { toast } from '@/store/toastStore';
import { sanitizeInput } from '@/utils/sanitize';
import { getImageUrl } from '@/utils/getImageUrl';

const MBTI_PAIRS: [string, string][] = [
    ['E', 'I'],
    ['S', 'N'],
    ['T', 'F'],
    ['J', 'P'],
];

function initLetters(mbti: string): Record<number, string> {
    if (mbti.length !== 4) return {};
    return Object.fromEntries([...mbti].map((char, i) => [i, char]));
}

// 로딩 완료 후 profile을 prop으로 받아 상태를 직접 초기화 (effect 내 setState 방지)
function EditForm({ profile }: { profile: UserProfileResponseDto }) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [nickname, setNickname] = useState(profile.nickname);
    const [letters, setLetters] = useState<Record<number, string>>(() => initLetters(profile.mbti));
    const [appeals, setAppeals] = useState<string[]>(
        profile.appeals.length > 0 ? profile.appeals : [''],
    );
    const [contact, setContact] = useState(profile.contact);
    const [appealError, setAppealError] = useState<string | null>(null);

    const mbti = useMemo(() => MBTI_PAIRS.map((_, i) => letters[i] ?? '').join(''), [letters]);

    const formValid =
        nickname.trim().length > 0 &&
        mbti.length === 4 &&
        appeals.some(k => k.trim().length > 0) &&
        contact.trim().length > 0;

    const { mutate: submitUpdate, isPending } = useMutation({
        mutationFn: updateUserProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
            navigate(ROUTES.ME, {
                replace: true,
                state: { toast: '프로필 수정에 성공했습니다!' },
            });
        },
        onError: err => {
            if (axios.isAxiosError(err) && err.response?.data?.code === 'USER_400_4') {
                toast.error('비속어가 포함된 키워드는 사용할 수 없습니다.');
            } else {
                toast.error('프로필 수정에 실패했어요.');
            }
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formValid || isPending) return;
        const result = keywordsSchema.safeParse(appeals);
        if (!result.success) {
            setAppealError(result.error.issues[0]?.message ?? '키워드 형식 오류');
            return;
        }
        setAppealError(null);
        submitUpdate({
            nickname: sanitizeInput(nickname).trim(),
            mbti,
            appeals: appeals.map(k => sanitizeInput(k).trim()),
            contact: sanitizeInput(contact).trim(),
        });
    };

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

    return (
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
            <PageHeader title="프로필 수정하기" />

            <div className="mt-30 flex justify-center">
                <img
                    src={getImageUrl(profile.profileUrl, defaultProfileImg)}
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
                        value={nickname}
                        onChange={v => setNickname(v.slice(0, 10))}
                        onClear={() => setNickname('')}
                        placeholder="닉네임을 입력해주세요"
                    />
                </Field>

                <Field label="MBTI">
                    <div className="flex flex-col gap-16">
                        <MbtiRow
                            letters={MBTI_PAIRS.map(p => p[0])}
                            selected={letters}
                            onPick={(idx, letter) =>
                                setLetters(prev => ({ ...prev, [idx]: letter }))
                            }
                        />
                        <MbtiRow
                            letters={MBTI_PAIRS.map(p => p[1])}
                            selected={letters}
                            onPick={(idx, letter) =>
                                setLetters(prev => ({ ...prev, [idx]: letter }))
                            }
                        />
                    </div>
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
                                placeholder={
                                    idx === 0 ? '고양이상' : idx === 1 ? '키 160cm' : '청순'
                                }
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
                                <PlusIcon className="text-pink-default size-20" />
                            </button>
                        )}
                    </div>
                </Field>

                <Field label="연락처" labelClass="text-22">
                    <EditableInput
                        value={contact}
                        onChange={v => setContact(v.slice(0, 50))}
                        onClear={() => setContact('')}
                        placeholder="예: @ssu_pick"
                    />
                </Field>
            </div>

            <div className="mt-auto pt-30 pb-22">
                <CtaButton type="submit" disabled={!formValid} loading={isPending} className="w-full">
                    {isPending ? '저장 중...' : '저장하기'}
                </CtaButton>
            </div>
        </form>
    );
}

export function MyEditPage() {
    const { data: profile, isLoading } = useUserProfile();

    if (isLoading || !profile) {
        return (
            <div className="flex min-h-svh items-center justify-center">
                <SpinnerIcon className="text-pink-point size-44" />
            </div>
        );
    }

    return <EditForm profile={profile} />;
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
    value: string;
    onChange: (val: string) => void;
    onClear: () => void;
    placeholder?: string;
};

function EditableInput({ value, onChange, onClear, placeholder }: EditableInputProps) {
    const [focused, setFocused] = useState(false);
    return (
        <div className="bg-black-100 rounded-10 flex h-60 items-center px-14">
            <input
                value={value}
                placeholder={placeholder}
                onChange={e => onChange(sanitizeInput(e.target.value))}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
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

type MbtiRowProps = {
    letters: string[];
    selected: Record<number, string>;
    onPick: (idx: number, letter: string) => void;
};

function MbtiRow({ letters, selected, onPick }: MbtiRowProps) {
    return (
        <div className="flex gap-10">
            {letters.map((letter, idx) => (
                <MbtiButton
                    key={letter}
                    active={selected[idx] === letter}
                    onClick={() => onPick(idx, letter)}
                >
                    {letter}
                </MbtiButton>
            ))}
        </div>
    );
}
