# SSUPICK FE 컨벤션

## 1. 폴더 구조

```
src/
├── apps/              # 앱 셸 (라우팅, 레이아웃)
├── ui/                # 페이지 단위 (라우트당 1폴더)
├── components/        # 공용 재사용 컴포넌트
├── features/          # 도메인별 기능 모듈 (api, hooks, types)
├── hooks/             # 공용 커스텀 훅
├── store/             # 전역 상태 (zustand)
├── schemas/           # 검증 스키마
├── types/             # 공용 타입
├── utils/             # 유틸 함수
├── constants/         # 상수
└── assets/            # 정적 자산
```

- **페이지 컴포넌트는 `ui/<domain>/`** — 라우트 경로의 최상위 도메인으로 폴더링.
- **도메인 로직은 `features/<domain>/`** — `api.ts`, `hooks/`, `types.ts` 식으로 모음.
- **공용으로 2곳 이상에서 쓰는 것만** `components/`, `hooks/`, `utils/`로 끌어올림.

## 2. 네이밍

| 대상 | 규칙 | 예시 |
| --- | --- | --- |
| 컴포넌트 파일 | PascalCase | `FeedPage.tsx`, `ProfileCard.tsx` |
| 일반 파일 | camelCase | `useAuth.ts`, `formatDate.ts` |
| 폴더 | kebab-case 또는 단일 단어 | `profile-create/`, `feed/` |
| 컴포넌트/타입/인터페이스 | PascalCase | `UserProfile`, `CardProps` |
| 변수/함수 | camelCase | `getUserId`, `isLoggedIn` |
| 상수 | UPPER_SNAKE_CASE | `ROUTES`, `MAX_KEYWORDS` |
| 불리언 | `is/has/can/should` 접두 | `isOpen`, `hasCoupon` |
| 이벤트 핸들러 | `handle*` (내부), `on*` (props) | `handleClick`, `onSubmit` |

## 3. 컴포넌트 작성

- 함수 선언문 사용. `function FeedPage() {}`.
- **모든 컴포넌트는 named export로 통일.** default export 사용 금지.
- props 타입 이름은 **`<컴포넌트명>Props`**로 통일. 동일 파일 상단에 선언.
- 한 파일 = 한 컴포넌트 원칙. 보조 컴포넌트가 길어지면 별도 파일.

```tsx
type ProfileCardProps = {
    profileId: string;
    onSelect: (id: string) => void;
};

export function ProfileCard({ profileId, onSelect }: ProfileCardProps) {
    return <div>...</div>;
}
```

## 4. TypeScript

- `any` 금지. 모르겠으면 `unknown` 후 좁히기.
- API 요청/응답 타입은 `features/<domain>/types.ts`.
- props/지역 타입은 `type` 선호, 라이브러리 확장 등 합쳐야 할 때만 `interface`.
- 옵셔널 체이닝/널 병합 적극 사용 (`a?.b ?? fallback`).

## 5. 상태 관리

| 상태 종류 | 도구 |
| --- | --- |
| 서버 상태 (캐시, 비동기 데이터) | **TanStack Query** |
| 전역 클라이언트 상태 (인증, UI 토글 등) | **Zustand** |
| 폼 상태 | **react-hook-form** |
| 컴포넌트 로컬 상태 | `useState` / `useReducer` |

- 서버 데이터를 zustand에 복제하지 않는다 — query 캐시가 단일 소스.
- zustand 스토어는 도메인별로 분리 (`store/authStore.ts`, `store/uiStore.ts`).

## 6. API 통신

### 6.1 axios 인스턴스

`utils/http.ts`에 단일 인스턴스 정의 (baseURL, 토큰 인터셉터, 에러 정규화).

### 6.2 공통 응답 래퍼 — `CommonResponse`

백엔드 응답은 모두 동일한 래퍼로 내려온다고 가정. 인터셉터에서 `data` 필드만 언래핑한 뒤 도메인 코드에 넘긴다.

```ts
// types/api.ts
export type CommonResponse<T> = {
    status: number;
    message: string;
    data: T;
};
```

### 6.3 DTO 네이밍 — `RequestDto` / `ResponseDto` 통일

- 요청 바디 타입: **`<도메인><동작>RequestDto`**
- 응답 데이터 타입(언래핑된 `data` 부분): **`<도메인><동작>ResponseDto`**
- 모두 PascalCase, `features/<domain>/types.ts`에 선언.

```ts
// features/auth/types.ts
export type LoginRequestDto = {
    code: string;
};

export type LoginResponseDto = {
    accessToken: string;
    refreshToken: string;
    isNewUser: boolean;
};
```

### 6.4 API 함수

도메인별로 `features/<domain>/api.ts`에 모음. 함수명은 동사 + 도메인.

```ts
// features/auth/api.ts
import { http } from '@/utils/http';
import type { LoginRequestDto, LoginResponseDto } from './types';

export const login = (body: LoginRequestDto) =>
    http.post<LoginResponseDto>('/auth/login', body).then(r => r.data);
```

### 6.5 Query / Mutation 훅

- `features/<domain>/hooks/`에 배치.
- **query key는 배열 + 도메인 prefix**: `['feed', 'list', { gender }]`, `['profile', 'me']`.

```ts
// features/feed/hooks/useFeed.ts
export const useFeed = () =>
    useInfiniteQuery({
        queryKey: ['feed', 'list'],
        queryFn: ({ pageParam }) => fetchFeed(pageParam),
        initialPageParam: undefined,
        getNextPageParam: last => last.nextCursor,
    });
```

## 7. 라우팅

- 모든 경로는 `constants/routes.ts`의 `ROUTES`를 통해 참조. 문자열 하드코딩 금지.
- 동적 경로는 헬퍼 함수로 (`cardDetailPath(id)`).
- 페이지 이동은 `useNavigate()` 또는 `<Link to={ROUTES.X}>`.

## 8. 스타일링

- **Tailwind v4 우선**. 인라인 클래스로 해결.
- 전역 reset/베이스 스타일만 `index.css`.
- 동적 클래스는 `clsx` 같은 헬퍼 사용 (도입 시).
- 색상/spacing 등 디자인 토큰은 `index.css`의 `@theme`에 정의해서 Tailwind 클래스로 사용.
- 컴포넌트 단위 CSS-in-JS 도입 안 함 (Tailwind로 충분).

### 8.1 단위 — 1rem = 10px, Tailwind 클래스 숫자 = px값

`index.css`에서 `html { font-size: 62.5% }`로 1rem = 10px 고정. `@theme`에서 `--spacing: 0.1rem`으로 두면 **모든 spacing/sizing 클래스의 숫자가 그대로 px값**이 된다.

```css
@theme {
    --spacing: 0.1rem; /* 1 unit = 1px @ 1rem=10px */
}
```

| 피그마 | 클래스 |
| --- | --- |
| 13px | `mt-13`, `px-13`, `gap-13` |
| 16px | `mt-16`, `gap-16` |
| 24px | `px-24`, `leading-24` |
| 184px | `h-184 w-184` |
| 640px | `max-w-640` |

**룰**

- 피그마 inspect에서 본 px 숫자를 그대로 클래스에 박는다. 머리 굴리기 0.
- **arbitrary 값 (`mt-[1.3rem]`, `px-[14px]`) 사용 금지.** 모든 값은 일반 유틸 클래스로 표현 가능해야 한다.
- 폰트 크기는 의미적 클래스 (`text-sm`, `text-base`, `text-lg`)로 쓴다. `text-*` 토큰은 `@theme`에서 px 기준으로 정의돼 있음.
- 색상도 토큰만 사용 (`bg-pink-default`, `text-black-700`). 임의 hex 금지.

**주의 — 기본 Tailwind 직관 깨짐**

- `mt-4`는 4px (이전 16px 아님). 16px 원하면 `mt-16`
- `px-2`는 2px. 8px 원하면 `px-8`
- "n번 반복 = 4n px" 룰은 무시하고 **숫자 = px** 로만 본다

## 9. import 순서

1. 외부 라이브러리 (`react`, `react-router-dom`, ...)
2. 내부 절대 경로 (`@/...`)
3. 상대 경로 (`./...`)
4. 타입 전용 (`import type`)
5. 스타일/이미지

각 그룹 사이 빈 줄 1개. 컴포넌트는 named import로 받음.

```ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/hooks/useAuth';

import type { LoginResponseDto } from './types';
```

## 10. 커밋 메시지

`type: 한 줄 요약` 형식.

| type | 의미 |
| --- | --- |
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `refactor` | 리팩터 (동작 변화 X) |
| `style` | 포매팅, 세미콜론 등 |
| `chore` | 빌드/설정/패키지 |
| `docs` | 문서 |
| `test` | 테스트 |

예: `feat: 카카오 로그인 콜백 처리`

## 11. 기타

- ESLint/TS 에러는 PR 머지 전 0건.
- `console.log`는 PR 전 제거. 디버깅 로그는 `// TODO` 표시.
- 환경 변수는 `VITE_` 접두 + `.env.example`에 키만 명시.
- 비밀값(`.env`, 토큰 등) 절대 커밋 금지.
