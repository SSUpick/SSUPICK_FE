const SQL_INJECTION_CHARS_RE = /['"`;\\<>]|--|\/\*|\*\//g;

/** 백엔드 parameterized query가 1차 방어선. 프런트 필터는 UX 검증 + 방어선 보강용. */
export function sanitizeInput(value: string): string {
    return value.replace(SQL_INJECTION_CHARS_RE, '');
}
