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

## 2. 레이아웃 — 의도에 맞는 도구 선택 (flex / absolute 공존 가능)

MCP가 반환하는 px 좌표는 **디자인 의도 추론 입력**이지 그대로 박는 final값이 아니다. 어떤 CSS 도구로 표현할지는 의도에 따라 결정한다. **한쪽으로 강제하지 마라.**

### flex가 적합한 경우

- 형제를 양 끝으로 보내기: `justify-between` (margin/top으로 흉내 금지)
- 단일 자식 가운데 정렬: `items-center justify-center` (margin/top으로 흉내 금지)
- 같은 의미 그룹 내 균등 간격 스택: `flex flex-col gap-N`
- 컨테이너 영역 분할(헤더/메인/푸터 등): `flex flex-col` + `justify-between` 또는 `gap`

### absolute가 적합한 경우

- 풀스크린 배경 / 그라데이션 (`inset-0`)
- 배지 / 오버레이 / 토스트
- **캔버스 스타일 디자인** — 일러스트 + 텍스트 + CTA가 절대좌표로 합성된 인트로/스플래시 화면처럼, 페이지 자체가 절대좌표 캔버스로 디자인된 경우 페이지 레벨 absolute 사용 OK

### 중요 — 한 페이지 안에서 absolute와 flex는 공존한다

```
페이지 외곽 = absolute 캔버스          ← OK
└─ 텍스트 두 줄 그룹 = flex flex-col   ← OK (그룹 내부는 의미적 스택)
└─ 풀스크린 배경 = absolute inset-0    ← OK
└─ 캐릭터 = absolute bottom-N           ← OK
```

"MCP가 absolute 토했으니 무조건 flex로 변환"도, "원본이 절대좌표니 무조건 absolute" 도 둘 다 잘못. **의도 기반 선택.**

### 주의 — top + bottom 앵커 혼용 시 viewport 높이 영향

- 같은 absolute 컨테이너에 `top-N` 자식과 `bottom-N` 자식이 섞이면, viewport 높이가 디자인 기준(844px)과 다를 때 두 그룹 사이 거리가 가변이 된다.
- 캔버스 스타일 디자인에서 의도된 동작이라면 OK. 다만 §7의 짧은 viewport (iPhone SE 667 등) 시각 검증으로 충돌 없는지 확인 필수.
- 충돌이 보이면 → 캐릭터 등 가변 요소를 `max-h-N` + `min-h-0` 으로 축소 가능하게 하거나, 충돌하는 부분만 부분 flex로 묶는다.

### MUST NOT

- 단일 자식인데 의도 없이 `gap-N` 넣기
- `justify-between` 또는 `items-center` 로 충분한 단순 케이스에 `mt-N` / `top-N`으로 위치 흉내
- `mt-[14px]`, `text-[32px]`, `bg-[#292b32]` 같은 arbitrary 값 (CONVENTIONS 8.1 위반)
- Figma 노드 이름(`Apple Logo`, `Group 47`)을 시맨틱하게 신뢰

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

### A. top/bottom 앵커 혼용 — 트레이드오프 인지하고 사용

```tsx
<div className="relative min-h-svh">
    <div className="absolute top-105">텍스트</div>
    <img className="absolute bottom-90 h-440" />
</div>
```

이 구조는 viewport 높이에 따라 두 요소 간 거리가 가변이다.

- 844px(피그마 타겟): ssuny 상단 = 844 - 90 - 440 = **314px**, 텍스트와 거리 = 209px
- 667px(iPhone SE): ssuny 상단 = 667 - 90 - 440 = **137px**, 텍스트와 거리 = 32px (충돌 직전)

→ **캔버스 디자인이 의도한 동작이면 OK.** 충돌이 보이면 그때 부분적으로 조정하면 된다:

- 가변 요소(캐릭터)에 `max-h-N` + `min-h-0` 적용해서 viewport 높이에 따라 축소되게
- 충돌하는 두 그룹만 부분 flex로 묶기
- 문제 없으면 그대로 둬도 됨 — 굳이 전체를 flex로 갈아엎지 마라

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

## 9. 페이지 레이아웃 / Outlet 룰

[Layout.tsx](./src/apps/layout/Layout.tsx)는 모든 페이지의 셸을 다음과 같이 강제한다.

```tsx
<div className="mx-auto flex min-h-svh w-full max-w-3xl flex-col bg-white-default px-20">
    <Outlet />
</div>
```

| 속성 | 값 | 의미 |
|------|----|----|
| `max-w-3xl` | 48rem (= 480px @ 1rem=10px) | 모바일 최대 폭. 더 넓은 화면에서는 가운데 정렬되어 480px로 표시 |
| `mx-auto` | auto | 가로 가운데 정렬 |
| `px-20` | 좌우 20px (2rem) | **모든 페이지에 일관된 좌우 거터** |
| `min-h-svh` | viewport 높이 | 콘텐츠가 적어도 흰 배경이 viewport를 채움 |

### 페이지 작성 룰

- 페이지 컴포넌트는 **`w-full`** 로 작성한다. 폭은 Layout이 결정.
- 좌우 거터는 Layout이 자동 적용 (px-20). 각 페이지에서 `px-N`을 따로 박지 마라.
- 콘텐츠 영역 폭 = `max(viewport, max-w-3xl) - 40px`. 좁은 viewport(390 등)에서도 좌우 20px 거터는 유지되고 콘텐츠 영역만 축소.
- Figma 디자인의 절대 px 폭 요소(예: `w=354`)는 콘텐츠 영역 안에서 비례 또는 `w-full`로 변환. 좁은 viewport에서 잘리지 않도록.

### 풀-블리드(full-bleed) 화면 — 거터 escape

LoginPage 같은 인트로/스플래시 화면처럼 배경 이미지가 화면 끝까지 차야 한다면 `-mx-20`으로 거터를 escape:

```tsx
<div className="-mx-20 relative w-screen max-w-[inherit] overflow-hidden">
    <img src={bg} className="absolute inset-0 size-full object-cover" />
    {/* 안쪽 콘텐츠는 다시 px-20 또는 별도 wrapper */}
</div>
```

거터 escape는 **명시적인 풀-블리드 의도가 있을 때만**. 기본은 거터 유지.

## 10. 디자인 변경 ↔ 문서 동기화

디자인이 업데이트될 때마다 관련 md 파일을 갱신한다. 자세한 룰과 트리거는 [DESIGN_SYNC.md](./DESIGN_SYNC.md) 참조.
