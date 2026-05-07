# SSUPICK FE — AI 에이전트 가이드

이 파일은 모든 AI 코딩 에이전트(Cursor, Codex, Aider 등)를 위한 공통 가이드. Claude Code는 별도로 `CLAUDE.md`를 참조한다.

코드 컨벤션은 항상 [`CONVENTIONS.md`](./CONVENTIONS.md)를 따른다.
Figma 디자인을 코드로 옮기는 작업(MCP 호출 포함)은 [`FIGMA.md`](./FIGMA.md)를 우선 참조한다.

## 프로젝트 개요

- 카카오 로그인 + AI 캐릭터 이미지 기반 소개팅 웹 서비스 (모바일 390px 고정 레이아웃)
- React 19 + TypeScript + Vite + Tailwind v4
- 라우팅: react-router-dom v7 (data router, `createBrowserRouter`)
- 서버 상태: TanStack Query / 전역: Zustand / 폼: react-hook-form / HTTP: axios

## 패키지 매니저

**pnpm 고정**. `npm`, `yarn` 사용 금지.

```bash
pnpm install        # 설치
pnpm dev            # 개발 서버
pnpm build          # tsc + vite build
pnpm lint           # eslint
```

## 경로 alias

- `@/*` → `src/*` (tsconfig + vite 양쪽 등록되어 있음)
- import 경로는 `@/...` 우선, 같은 폴더 내부만 상대 경로 허용

## 라우트 추가 규칙

1. `src/constants/routes.ts`의 `ROUTES`에 경로 추가
2. `src/ui/<domain>/<Page>.tsx` 생성 (도메인은 라우트 최상위 segment 기준, named export)
3. `src/apps/router.tsx`의 children에 등록 (문자열 X, `ROUTES.X` 사용)

## 컴포넌트 작성 핵심

- **named export 통일** (default export 금지)
- props 타입명은 **`<컴포넌트명>Props`** (예: `ProfileCardProps`)
- 함수 선언문 사용

## API 통신 핵심

- 응답 래퍼: `CommonResponse<T>` (`types/api.ts`)
- 요청/응답 DTO: **`<도메인><동작>RequestDto` / `<도메인><동작>ResponseDto`** (PascalCase, `features/<domain>/types.ts`)
- axios 인스턴스: `utils/http.ts` 단일 정의

## 응답 언어

한국어로 응답.
