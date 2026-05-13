import { z } from 'zod';

export const NICKNAME_MAX_LENGTH = 7;

export function isValidNicknameLength(value: string): boolean {
    return value.length > 0 && value.length <= NICKNAME_MAX_LENGTH;
}

export const nicknameSchema = z
    .string()
    .min(1, '닉네임을 입력해주세요')
    .max(NICKNAME_MAX_LENGTH, `닉네임은 최대 ${NICKNAME_MAX_LENGTH}자까지 입력 가능해요`);

export type Nickname = z.infer<typeof nicknameSchema>;
