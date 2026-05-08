import { z } from 'zod';

export const MAX_KEYWORDS = 3;
export const KEYWORD_MAX_LENGTH = 8;

/** 한글/영문/숫자/공백만 허용 → SQL/스크립트 인젝션 위험 문자 자체 차단 (whitelist 방식). */
export const keywordSchema = z
    .string()
    .trim()
    .min(1, '키워드를 입력해주세요')
    .max(KEYWORD_MAX_LENGTH, `최대 ${KEYWORD_MAX_LENGTH}자까지 가능해요`)
    .regex(/^[가-힣a-zA-Z0-9 ]+$/, '한글/영문/숫자/공백만 사용 가능해요');

export const keywordsSchema = z
    .array(keywordSchema)
    .min(1, '키워드를 최소 1개 이상 입력해주세요')
    .max(MAX_KEYWORDS, `키워드는 최대 ${MAX_KEYWORDS}개까지 가능해요`);

export type Keyword = z.infer<typeof keywordSchema>;
