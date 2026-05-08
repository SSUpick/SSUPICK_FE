import { useMemo, useState } from 'react';

import { ChipButton } from '@/components/button/ChipButton';
import { CtaButton } from '@/components/button/CtaButton';
import { MbtiButton } from '@/components/button/MbtiButton';
import { TextInput } from '@/components/input/TextInput';
import { PlusIcon } from '@/components/icon/PlusIcon';
import { SpinnerIcon } from '@/components/icon/SpinnerIcon';
import { PageHeader } from '@/components/layout/PageHeader';

import type { Gender } from '@/features/profile/types';

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

export type CardFormValues = {
    nickname: string;
    gender: Gender;
    mbti: string;
    keywords: string[];
    contact: string;
};

type CardFormStepProps = {
    onSubmit: (values: CardFormValues) => Promise<void> | void;
};

export function CardFormStep({ onSubmit }: CardFormStepProps) {
    const [nickname, setNickname] = useState('');
    const [gender, setGender] = useState<Gender | null>(null);
    const [letters, setLetters] = useState<Record<number, string>>({});
    const [keywords, setKeywords] = useState<string[]>(['']);
    const [contact, setContact] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const mbti = useMemo(() => MBTI_PAIRS.map((_, i) => letters[i] ?? '').join(''), [letters]);

    const contactValid = contact.length >= CONTACT_MIN && contact.length <= CONTACT_MAX;
    const contactError = contact.length > 0 && !contactValid;
    const validKeywords = keywords.map(k => k.trim()).filter(k => k.length > 0);

    const formValid =
        nickname.length > 0 &&
        nickname.length <= NICKNAME_MAX &&
        gender !== null &&
        mbti.length === 4 &&
        validKeywords.length > 0 &&
        validKeywords.every(k => k.length <= KEYWORD_MAX) &&
        contactValid;

    const handleLetter = (rowIdx: number, letter: string) => {
        setLetters(prev => ({ ...prev, [rowIdx]: letter }));
    };

    const handleAddKeyword = () => {
        if (keywords.length >= KEYWORDS_MAX_COUNT) return;
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
                keywords: validKeywords,
                contact,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white-default flex min-h-dvh flex-col">
            <PageHeader title="카드 만들기" showBack={false} />

            <div className="flex flex-col gap-30 px-22 pt-12 pb-22">
                <FormSection
                    title="닉네임은?"
                    helpers={[`* 최대 ${NICKNAME_MAX}자 제한이 있어요.`]}
                >
                    <TextInput
                        value={nickname}
                        onChange={e => setNickname(e.target.value.slice(0, NICKNAME_MAX))}
                        placeholder="숭실대 카리나"
                    />
                </FormSection>

                <FormSection title="성별은?" helpers={['* 성별은 이후에 변경 불가능해요.']}>
                    <div className="flex gap-10">
                        <ChipButton active={gender === 'male'} onClick={() => setGender('male')}>
                            남자
                        </ChipButton>
                        <ChipButton
                            active={gender === 'female'}
                            onClick={() => setGender('female')}
                        >
                            여자
                        </ChipButton>
                    </div>
                </FormSection>

                <FormSection title="MBTI는?">
                    <div className="flex flex-col gap-10">
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
                    <div className="flex flex-col gap-10">
                        {keywords.map((kw, idx) => (
                            <TextInput
                                key={idx}
                                value={kw}
                                onChange={e =>
                                    handleKeywordChange(idx, e.target.value.slice(0, KEYWORD_MAX))
                                }
                                placeholder="ex. 고양이상"
                            />
                        ))}
                        {keywords.length < KEYWORDS_MAX_COUNT && (
                            <button
                                type="button"
                                onClick={handleAddKeyword}
                                className="rounded-10 border-pink-point text-pink-point flex h-60 w-full items-center justify-center border"
                                aria-label="키워드 추가"
                            >
                                <PlusIcon className="size-22" />
                            </button>
                        )}
                    </div>
                </FormSection>

                <FormSection
                    title="연락처"
                    helpers={[
                        '인스타그램, 전화번호 등을 적어주세요.',
                        '상대방이 쿠폰으로 열람 시에 확인 가능한 정보입니다.',
                    ]}
                    helperTone="muted"
                >
                    <div className="flex flex-col gap-6">
                        <TextInput
                            value={contact}
                            onChange={e => setContact(e.target.value.slice(0, CONTACT_MAX))}
                            error={contactError}
                            placeholder="@ssu_pick"
                        />
                        {contactError && (
                            <p className="text-red-default text-xs font-medium">
                                연락처는 {CONTACT_MIN}자 이상 {CONTACT_MAX}자 이하로 입력해주세요.
                            </p>
                        )}
                    </div>
                </FormSection>
            </div>

            <div className="bg-white-default sticky bottom-0 px-22 pt-14 pb-22">
                <CtaButton type="submit" disabled={!formValid || submitting} className="w-full">
                    {submitting ? (
                        <span className="flex items-center justify-center gap-8">
                            <SpinnerIcon className="size-20" />
                            등록 중...
                        </span>
                    ) : (
                        '등록하기'
                    )}
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
    const helperClass =
        helperTone === 'muted'
            ? 'text-sm font-medium text-black-700'
            : 'text-xs font-medium text-black-400';
    return (
        <section className="flex flex-col gap-10">
            <h2 className="text-black-800 text-lg font-bold">{title}</h2>
            {helpers && (
                <ul className="-mt-4 flex flex-col gap-2">
                    {helpers.map(h => (
                        <li key={h} className={helperClass}>
                            {h}
                        </li>
                    ))}
                </ul>
            )}
            <div className="pt-4">{children}</div>
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
