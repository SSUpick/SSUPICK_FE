import { useMemo, useState } from 'react';

import { ChipButton } from '@/components/button/ChipButton';
import { CtaButton } from '@/components/button/CtaButton';
import { MbtiButton } from '@/components/button/MbtiButton';
import { PlusIcon } from '@/components/icon/PlusIcon';
import { TextInput } from '@/components/input/TextInput';
import { PageHeader } from '@/components/layout/PageHeader';

import type { Gender } from '@/features/user/types';

const MBTI_PAIRS: [string, string][] = [
    ['E', 'I'],
    ['S', 'N'],
    ['T', 'F'],
    ['J', 'P'],
];
const NICKNAME_MAX = 10;
const KEYWORD_MAX = 8;
const CONTACT_MIN = 2;
const CONTACT_MAX = 50;
const KEYWORDS_MAX_COUNT = 3;
const KEYWORDS_MIN_COUNT = 1;

export type CardFormValues = {
    nickname: string;
    gender: Gender;
    mbti: string;
    appeals: string[];
    contact: string;
};

type CardFormStepProps = {
    onSubmit: (values: CardFormValues) => Promise<void> | void;
};

export function CardFormStep({ onSubmit }: CardFormStepProps) {
    const [nickname, setNickname] = useState('');
    const [gender, setGender] = useState<Gender | null>(null);
    const [letters, setLetters] = useState<Record<number, string>>({});
    const [appeals, setKeywords] = useState<string[]>(['']);
    const [contact, setContact] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const mbti = useMemo(() => MBTI_PAIRS.map((_, i) => letters[i] ?? '').join(''), [letters]);

    const contactLengthValid = contact.length >= CONTACT_MIN && contact.length <= CONTACT_MAX;
    const contactAlphanumValid = /[a-zA-Z0-9가-힣]/.test(contact);
    const contactValid = contactLengthValid && contactAlphanumValid;
    const contactError = contact.length > 0 && !contactValid;
    const contactErrorMsg = !contactLengthValid
        ? `연락처는 ${CONTACT_MIN}자 이상 ${CONTACT_MAX}자 이하로 입력해주세요.`
        : '영문, 숫자, 한글 중 하나 이상을 포함해주세요.';
    const validKeywords = appeals.map(k => k.trim()).filter(k => k.length > 0);

    const formValid =
        nickname.length > 0 &&
        nickname.length <= NICKNAME_MAX &&
        gender !== null &&
        mbti.length === 4 &&
        validKeywords.length >= KEYWORDS_MIN_COUNT &&
        validKeywords.every(k => k.length <= KEYWORD_MAX) &&
        contactValid;

    const handleLetter = (rowIdx: number, letter: string) => {
        setLetters(prev => ({ ...prev, [rowIdx]: letter }));
    };

    const handleAddKeyword = () => {
        if (appeals.length >= KEYWORDS_MAX_COUNT) return;
        setKeywords(prev => [...prev, '']);
    };

    const handleKeywordChange = (idx: number, value: string) => {
        setKeywords(prev => prev.map((k, i) => (i === idx ? value : k)));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formValid || !gender) return;
        setSubmitting(true);
        try {
            await onSubmit({
                nickname,
                gender,
                mbti,
                appeals: validKeywords,
                contact,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white-default flex min-h-dvh flex-col">
            <PageHeader title="카드 만들기" showBack={false} />

            <div className="flex flex-col gap-34 px-8 pt-12 pb-22">
                <FormSection
                    title="닉네임은?"
                    helpers={[`* 최대 ${NICKNAME_MAX}자 제한이 있어요.`]}
                >
                    <TextInput
                        value={nickname}
                        onChange={e => setNickname(e.target.value.slice(0, NICKNAME_MAX))}
                        placeholder="ex. 숭실대 카리나"
                    />
                </FormSection>

                <FormSection title="성별은?" helpers={['* 성별은 이후에 변경 불가능해요.']}>
                    <div className="flex gap-20">
                        <ChipButton active={gender === 'MALE'} onClick={() => setGender('MALE')}>
                            남자
                        </ChipButton>
                        <ChipButton
                            active={gender === 'FEMALE'}
                            onClick={() => setGender('FEMALE')}
                        >
                            여자
                        </ChipButton>
                    </div>
                </FormSection>

                <FormSection title="MBTI는?">
                    <div className="flex flex-col gap-16">
                        <MbtiRow
                            letters={MBTI_PAIRS.map(p => p[0])}
                            selected={letters}
                            onPick={handleLetter}
                        />
                        <MbtiRow
                            letters={MBTI_PAIRS.map(p => p[1])}
                            selected={letters}
                            onPick={handleLetter}
                        />
                    </div>
                </FormSection>

                <FormSection
                    title="키워드는?"
                    helpers={[
                        `* 최대 ${KEYWORDS_MAX_COUNT}개까지 추가할 수 있어요.`,
                        `* 키워드 1개 당 최대 ${KEYWORD_MAX}자 제한이 있어요.`,
                    ]}
                >
                    <div className="flex flex-col gap-16">
                        {appeals.map((kw, idx) => (
                            <TextInput
                                key={idx}
                                value={kw}
                                onChange={e =>
                                    handleKeywordChange(idx, e.target.value.slice(0, KEYWORD_MAX))
                                }
                                placeholder={
                                    idx === 0
                                        ? 'ex. 고양이상'
                                        : idx === 1
                                          ? 'ex. 키 160cm'
                                          : 'ex. 청순'
                                }
                            />
                        ))}
                        {appeals.length < KEYWORDS_MAX_COUNT && (
                            <button
                                type="button"
                                onClick={handleAddKeyword}
                                className="rounded-10 border-pink-default bg-white-default text-pink-point flex h-55 w-full items-center justify-center border"
                                aria-label="키워드 추가"
                            >
                                <PlusIcon className="size-20" />
                            </button>
                        )}
                    </div>
                </FormSection>

                <FormSection
                    title="연락처"
                    helpers={[
                        '인스타그램, 전화번호 등을 적어주세요.',
                        '이용권으로 프로필 조회 시 확인 가능한 공개 정보입니다.',
                    ]}
                    helperTone="muted"
                >
                    <div className="flex flex-col gap-8">
                        <TextInput
                            value={contact}
                            onChange={e => setContact(e.target.value.slice(0, CONTACT_MAX))}
                            error={contactError}
                            placeholder="@ssu_pick"
                        />
                        {contactError && (
                            <p className="text-red-default text-sm font-medium tracking-tighter">
                                {contactErrorMsg}
                            </p>
                        )}
                    </div>
                </FormSection>
            </div>

            <div className="px-8 pt-14 pb-22 flex flex-col gap-12">
                <p className="text-black-400 text-left text-xs font-medium tracking-tight leading-snug">
                    <span className="font-semibold">주의사항:</span> 사실과 다른 정보나 부적절한 내용이 포함된 경우,{' '}
                    관리자 확인 후 프로필이 삭제될 수 있습니다.
                </p>
                <CtaButton type="submit" disabled={!formValid} loading={submitting} className="w-full">
                    {submitting ? '등록 중...' : '등록하기'}
                </CtaButton>
            </div>
        </form>
    );
}

type FormSectionProps = {
    title: string;
    helpers?: string[];
    helperTone?: 'muted' | 'default';
    children: React.ReactNode;
};

function FormSection({ title, helpers, helperTone = 'default', children }: FormSectionProps) {
    const helperColor = helperTone === 'muted' ? 'text-black-700' : 'text-black-400';
    return (
        <section className="flex flex-col gap-16">
            <div className="flex flex-col gap-5">
                <h2 className="text-black-800 text-22 font-semibold tracking-tighter">{title}</h2>
                {helpers && (
                    <div
                        className={`flex flex-col text-sm font-medium tracking-tighter ${helperColor}`}
                    >
                        {helpers.map(h => (
                            <p key={h}>{h}</p>
                        ))}
                    </div>
                )}
            </div>
            <div>{children}</div>
        </section>
    );
}

type MbtiRowProps = {
    letters: string[];
    selected: Record<number, string>;
    onPick: (rowIdx: number, letter: string) => void;
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
