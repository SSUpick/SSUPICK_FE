# SSUPICK FE — Figma MCP 작업 가이드

이 파일은 Figma 디자인을 코드로 옮길 때의 규칙. 다른 코드 룰은 [`AGENTS.md`](./AGENTS.md) / [`CONVENTIONS.md`](./CONVENTIONS.md) 따른다.

## 0. 사전 인지 — Figma MCP의 한계

Figma MCP는 디자인 파일 품질에 결과가 강하게 종속된다. 다음을 전제로 깔고 작업한다.

- **Auto Layout 안 쓴 디자인**은 MCP가 절대좌표 + px로 토해낸다. 그대로 받아쓰면 _"top margin으로 위치 잡기 / 의미 없는 gap / `justify-between`이면 될 걸 absolute"_ 같은 코드가 나온다.
- MCP가 주는 React+Tailwind 코드는 **"디자인의 의미적 표현"** 일 뿐 최종 코드가 아니다. 무조건 우리 컨벤션으로 재해석.
- 노드 이름(`Group 47`, `Apple Logo`처럼 placeholder인 경우 흔함)을 시맨틱한 의미로 신뢰하지 말 것.
- Code Connect 미설정 시 일부 매핑은 `get_screenshot`만으로 추론된다. 추론한 부분은 코드 위에 한 줄 주석으로 명시.

## 1. 필수 흐름 (생략 금지)

1. `get_design_context(fileKey, nodeId)` — 노드의 구조/스펙
2. 응답이 너무 크면 `get_metadata`로 노드맵 먼저 → 필요한 자식 노드만 재요청
3. `get_screenshot` — 시각 레퍼런스 (1:1 검증용)
4. `get_variable_defs` — 토큰 매핑 확인
5. **위 1·3을 모두 받은 뒤에만** 구현 시작
6. 구현 후 DevTools 모바일 모드(390×844)에서 1:1 시각 비교

## 2. 레이아웃 규칙 — px 절대좌표를 flex/grid로 재해석 (가장 중요)

본 프로젝트는 **모바일 390×844 고정 디자인**. 그래도 viewport _높이_ 는 디바이스마다 다르다(iPhone SE 667 / Galaxy S20 800 / iPhone 14 Pro 852 …). 따라서 **세로 절대좌표를 그대로 박으면 무조건 깨진다.**

### MUST

- MCP의 px 좌표는 **참고용**. 의도를 읽고 flex로 변환.
- **수직 스택은 `flex flex-col` + `gap-N` 또는 `justify-between`** 으로. 각 요소를 `top-N`으로 따로 박지 마라.
- 단일 자식 가운데 정렬: `flex items-center justify-center` (top/margin으로 흉내 금지)
- 형제를 양 끝으로: `justify-between` (margin/top으로 흉내 금지)
- 페이지 셸은 **`flex min-h-svh flex-col`** 로 잡고, 그 안에서 Header / Main / CTA 영역을 `justify-between` 또는 `gap`으로 나눈다.

### MAY

- `absolute`는 **겹쳐 쌓는 의도가 명백한 경우에만** 허용:
    - 풀스크린 배경 이미지 (`inset-0`)
    - 배지 / 오버레이 / 토스트
    - 단일 부모-자식 정렬 (배경 이미지 위에 캐릭터 1장 등) — 단, 이 경우 부모도 `absolute` 컨텍스트여야 의미 있음

### MUST NOT

- **`top-N`(위 기준)과 `bottom-N`(아래 기준)을 한 컨테이너에서 섞기** ← viewport 높이 변화에 따라 요소가 충돌하거나 이격된다 (LoginPage에서 실제 발생, 8번 안티패턴 참고)
- 단일 자식인데 `gap-N` 넣기
- `justify-between`이면 충분한데 `mt-N` / `top-N`으로 위치 조정
- `absolute`를 일반 레이아웃 도구로 사용
- `mt-[14px]`, `text-[32px]`, `bg-[#292b32]` 같은 arbitrary 값 (CONVENTIONS 8.1 위반)

## 3. 사이즈 / 타이포 / 색상

[CONVENTIONS.md 8.1절](./CONVENTIONS.md) 그대로 따른다. 핵심만:

- 피그마 inspect의 px 숫자를 그대로 클래스에 박는다. `mt-16` = 16px.
- arbitrary 값 금지.
- 텍스트는 의미 클래스만 (`text-sm` / `text-base` / `text-lg` / `text-3xl` …).
- 토큰에 없는 값(예: 32px이지만 `text-3xl` = 30px)은 **가장 가까운 토큰** 사용. 정확값이 꼭 필요하면 `src/index.css`의 `@theme`에 토큰 추가 후 사용.
- 색상은 토큰만 (`bg-pink-default`, `text-black-800`). 임의 hex 금지.

## 4. Asset 규칙

### MCP 응답 처리

- MCP가 `localhost` source를 반환하면 그 source를 **그대로 사용**. placeholder 만들지 않는다.
- 새 아이콘 패키지(`lucide-react`, `react-icons` 등) **import 금지**. 자산은 모두 Figma payload + `src/assets/` 안에서 해결.

### 네이밍 미스매치 처리 (디자이너 ↔ 우리 자산)

- `src/assets/`에 **같은 의미의 이미지가 이미 있으면 Figma 네이밍과 무관하게 기존 파일 우선**.
    - 예: Figma 노드 이름이 `Apple Logo`라도 실제 의미가 카카오 아이콘 → `src/assets/kakao_icon.svg` 사용.
    - 예: Figma `Group 47.png`이 우리 캐릭터 → `src/assets/ssuny.webp` 사용.
- 진짜 새 자산일 때만 `src/assets/`에 추가. 파일명은 **kebab/snake-case + 의미 있는 이름** (`Group 47.png` ❌, `kakao_bubble.svg` ✅).
- `.webp` 우선 (이미 변환된 자산 다수). PNG는 fallback 또는 투명도 필수일 때만.

### 합성 이미지 vs 분리 이미지

Figma는 종종 **배경 + 캐릭터 + 장식을 단일 합성 이미지**로 export 한다. 우리 자산은 분리되어 있는 경우가 많다(예: `bg.webp` + `ssuny.webp`). 둘 다 동작 방식이 달라서 어느 쪽을 쓸지 의식적으로 결정해야 한다.

| 단일 합성 | 분리 |
|----------|------|
| 캐릭터-배경 정합성 ✅ | 캐릭터 위치/크기 자유 조정 ✅ |
| 위치 조정 불가, 압축 큼 ❌ | 정합성 직접 맞춰야 함 ❌ |

**판단 기준**: 텍스트/말풍선/CTA 같은 요소가 캐릭터 위에 정확히 놓여야 한다면 **단일 합성 우선 검토**. 그렇지 않고 캐릭터만 독립 배치면 분리 OK.

## 5. 기존 컴포넌트 재사용 우선

신규 생성 전 [src/components/](./src/components/) 안의 기존 컴포넌트 먼저 확인.

| 카테고리 | 위치 |
|---------|------|
| 버튼 | [src/components/button/](./src/components/button/) — `KakaoButton`, `CtaButton`, `ChipButton`, `OutlineChipButton`, `MbtiButton` |
| 입력 | [src/components/input/](./src/components/input/) — `TextInput` |
| 피드백 | [src/components/feedback/](./src/components/feedback/) — `SpeechBubble`, `DialogBubble`, `Toast` |
| 카드 | [src/components/card/](./src/components/card/) — `ProfileCard` |
| 레이아웃 | [src/components/layout/](./src/components/layout/) — `PageHeader` |

기존 컴포넌트와 같은 의미면 **그대로 사용 또는 prop으로 variant 추가**. 새로 만들 때는:

- `<컴포넌트명>Props` 타입을 동일 파일 상단에 선언
- named export 강제 (default export 금지)
- 함수 선언문 사용

## 6. Figma 토큰 → 프로젝트 토큰 매핑

`get_variable_defs`로 받은 Figma 변수는 [src/index.css](./src/index.css) `@theme`의 우리 토큰으로 매핑한다.

| Figma 변수 | 프로젝트 토큰 | 클래스 예 |
|-----------|--------------|----------|
| `pink/point` `#ff339c` | `--color-pink-point` | `text-pink-point` |
| `pink/default` `#ff50aa` | `--color-pink-default` | `bg-pink-default` |
| `kakao/yellow` `#fee500` | `--color-kakao-yellow` | `bg-kakao-yellow` |
| `black/900` `#000000` | `--color-black-900` | `text-black-900` |
| `black/800` `#292b32` ≈ 우리 `#2c2f3b` | `--color-black-800` | `text-black-800` |

**미세값 차이는 프로젝트 토큰 우선.** Figma `#292b32`와 우리 `#2c2f3b`처럼 1~2비트 차이면 우리 토큰을 쓴다. 정말 새 색이면 디자이너에게 토큰 등록부터 요청.

## 7. 작업 후 검증

- `pnpm build` 통과 (TypeScript + Vite)
- DevTools (F12 → Ctrl+Shift+M) 390×844 프리셋에서 시각 비교
- **짧은 viewport (예: 667px iPhone SE) 에서도 레이아웃이 안 깨지는지 확인** — 깨지면 §2 위반(top/bottom 혼용) 가능성
- `pnpm dev --host`로 실기기 1회 (특히 카카오 로그인 같은 OAuth 흐름)

## 8. 안티패턴 (실제 사례)

### A. top/bottom 앵커 혼용 → viewport 높이에 따라 요소 충돌

❌ **이번 LoginPage에서 실제 깨진 패턴**

```tsx
<div className="relative min-h-svh">
  <div className="absolute top-105">텍스트</div>
  <div className="absolute top-271">말풍선</div>
  <img className="absolute bottom-90 h-440" />
  <button className="absolute bottom-48" />
</div>
```

iPhone SE(667px)에서 ssuny 상단 = 667 - 90 - 440 = **137px**, 말풍선 하단 = 271 + 50 = 321px → 말풍선이 토끼 몸통 한가운데 박힘.

✅ **flex column으로 영역 분할**

```tsx
<div className="flex min-h-svh flex-col items-center">
    <header className="flex flex-col items-center gap-20 pt-105">
        <p className="text-lg font-medium text-pink-point">…</p>
        <p className="text-3xl font-semibold text-black-800">…</p>
    </header>
    <main className="flex flex-1 flex-col items-center justify-end">
        <SpeechBubble variant="gray">…</SpeechBubble>
        <img src={ssuny} alt="" className="h-440" />
    </main>
    <footer className="w-354 pb-48">
        <KakaoButton />
    </footer>
</div>
```

### B. MCP가 토해낸 absolute 좌표 그대로 박기

❌

```tsx
<div className="absolute left-[20px] top-[14px] w-[350px] gap-[10px]">
```

✅ **flex 의도로 재해석 + 컨벤션 클래스**

```tsx
<div className="flex w-full items-center gap-10 px-20 pt-14">
```

### C. arbitrary 값 + 임의 색상

❌

```tsx
<p className="text-[32px] text-[#292b32]">사진 한 장으로</p>
```

✅ **토큰 + 의미 클래스** (32px ≠ `text-3xl`(30px) 라도 가장 가까운 토큰 사용)

```tsx
<p className="text-3xl text-black-800">사진 한 장으로</p>
```

### D. 단일 자식인데 gap

❌

```tsx
<div className="flex flex-col items-center gap-20">
    <KakaoButton />
</div>
```

✅

```tsx
<div className="flex items-center justify-center">
    <KakaoButton />
</div>
```

### E. justify-between이면 될 걸 margin으로

❌ MCP 출력 그대로

```tsx
<header className="flex">
    <div>로고</div>
    <div className="ml-[214px]">메뉴</div>
</header>
```

✅

```tsx
<header className="flex items-center justify-between">
    <div>로고</div>
    <div>메뉴</div>
</header>
```

### F. Figma 노드 이름을 그대로 신뢰

❌

```tsx
import appleLogo from '@/assets/apple-logo.png';  // 사실은 카카오 아이콘
```

✅ — 이미 있는 자산을 의미 기반으로 매핑

```tsx
import kakaoIcon from '@/assets/kakao_icon.svg';
```
