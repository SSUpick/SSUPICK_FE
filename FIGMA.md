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

## 3. 텍스트 / 사이즈 / 색상 — 1:1 검증 체크리스트 (필수)

피그마의 텍스트와 시각 요소를 옮길 때 **다음 속성을 하나도 빠짐 없이** 매칭한다. "가까우니까 OK"는 금지.

### 텍스트는 다음 6개 속성 전부 점검

| 속성               | Figma 표기                                     | 우리 매핑                                                                                                                                                                     |
| ------------------ | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **font-family**    | `Pretendard` / `Pretendard Variable`           | body 폰트로 자동 적용 (`index.css`). 둘 중 어느 쪽이든 그대로 OK                                                                                                              |
| **font-size**      | `12px` / `18px` / `32px` 등                    | 의미 클래스 (`text-xs`=12 / `text-lg`=18 / `text-3xl`=32). **토큰값과 다르면 `index.css` `@theme`의 토큰 갱신 또는 새 토큰 추가**. 가장 가까운 값으로 절대 적당히 넘기지 마라 |
| **font-weight**    | `Medium`(500) / `SemiBold`(600) / `Bold`(700)  | `font-medium` / `font-semibold` / `font-bold`                                                                                                                                 |
| **color**          | hex (`#ff339c`, `#292b32` 등)                  | 토큰 클래스 (`text-pink-point`, `text-black-800`). **토큰값과 다르면 토큰 갱신** (1bit 차이라도)                                                                              |
| **letter-spacing** | `-0.18px`, `-0.12px` 등 (보통 폰트 크기 × -1%) | `tracking-tight` (= -0.01em, Pretendard 한국어 표준). 다른 비율이면 토큰 추가                                                                                                 |
| **line-height**    | `normal` / 숫자 (`24` 등)                      | normal은 그대로. 숫자면 `leading-N` (= Npx)                                                                                                                                   |

### 절대 금지

- ❌ **"가장 가까운 토큰으로 적당히"** — 32px ≠ `text-3xl`(30px) 라고 그냥 쓰는 행위. 토큰을 32px로 바꾸거나 새 토큰 추가.
- ❌ **눈으로 비슷해 보이는 색** — `#292b32`와 `#2c2f3b`는 다른 색. RGB diff 1bit이라도 다르면 토큰 갱신.
- ❌ **letter-spacing 누락** — Figma에서 -0.18px이라고 적혀 있으면 무조건 적용. "기본값으로 대충 둬도 되겠지" 금지.
- ❌ arbitrary 값 (`text-[32px]`, `tracking-[-0.18px]`) — CONVENTIONS 8.1.

### 컴포넌트 점검도 동일 — 기존 컴포넌트라도 Figma와 1:1 비교

말풍선 / 버튼 / 카드 등 **이미 우리 코드에 있는 컴포넌트라도 Figma 컴포넌트와 모든 시각 속성이 매칭되는지 검증**한다. 다음 모두:

- 배경 색 / 그라데이션
- border / border-radius
- **drop-shadow / box-shadow** (Figma 우측 패널의 Effects 값 그대로)
- padding / gap / 내부 정렬
- 텍스트 속성 6개 (위 표)
- 아이콘 / 이미지 자산 (`Figma 노드 이름 ≠ 실제 의미` 주의 — §4)

**기존 컴포넌트가 Figma와 다르면 컴포넌트를 갱신**한다. "비슷하니까 OK"로 새 컴포넌트 만들지 마라.

### 토큰 갱신/추가 절차

1. Figma 값 ≠ 기존 토큰값 발견 → `src/index.css` `@theme` 갱신 또는 새 토큰 추가
2. 영향 범위(`grep`) 확인 — 다른 페이지에 시각 영향 없는지
3. 코드 적용 + `pnpm build` 통과
4. **DESIGN_SYNC.md 트리거 발동** — `FIGMA.md` §6 토큰 매핑 표도 함께 갱신, 한 커밋으로 묶음

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

| 단일 합성                  | 분리                          |
| -------------------------- | ----------------------------- |
| 캐릭터-배경 정합성 ✅      | 캐릭터 위치/크기 자유 조정 ✅ |
| 위치 조정 불가, 압축 큼 ❌ | 정합성 직접 맞춰야 함 ❌      |

**판단 기준**: 텍스트/말풍선/CTA 같은 요소가 캐릭터 위에 정확히 놓여야 한다면 **단일 합성 우선 검토**. 그렇지 않고 캐릭터만 독립 배치면 분리 OK.

## 5. 기존 컴포넌트 재사용 우선

신규 생성 전 [src/components/](./src/components/) 안의 기존 컴포넌트 먼저 확인.

| 카테고리 | 위치                                                                                                                             |
| -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 버튼     | [src/components/button/](./src/components/button/) — `KakaoButton`, `CtaButton`, `ChipButton`, `OutlineChipButton`, `MbtiButton` |
| 입력     | [src/components/input/](./src/components/input/) — `TextInput`                                                                   |
| 피드백   | [src/components/feedback/](./src/components/feedback/) — `SpeechBubble`, `DialogBubble`, `Toast`                                 |
| 카드     | [src/components/card/](./src/components/card/) — `ProfileCard`                                                                   |
| 레이아웃 | [src/components/layout/](./src/components/layout/) — `PageHeader`                                                                |

기존 컴포넌트와 같은 의미면 **그대로 사용 또는 prop으로 variant 추가**. 새로 만들 때는:

- `<컴포넌트명>Props` 타입을 동일 파일 상단에 선언
- named export 강제 (default export 금지)
- 함수 선언문 사용

## 6. Figma 토큰 → 프로젝트 토큰 매핑

`get_variable_defs`로 받은 Figma 변수는 [src/index.css](./src/index.css) `@theme`의 우리 토큰으로 매핑한다. **모든 값은 Figma와 1:1 매칭** (§3 "1bit 차이라도 토큰 갱신" 룰 적용).

### 색상

| Figma 변수               | 프로젝트 토큰          | 클래스            |
| ------------------------ | ---------------------- | ----------------- |
| `pink/point` `#ff339c`   | `--color-pink-point`   | `text-pink-point` |
| `pink/default` `#ff50aa` | `--color-pink-default` | `bg-pink-default` |
| `kakao/yellow` `#fee500` | `--color-kakao-yellow` | `bg-kakao-yellow` |
| `black/900` `#000000`    | `--color-black-900`    | `text-black-900`  |
| `black/800` `#292b32`    | `--color-black-800`    | `text-black-800`  |

### 텍스트 사이즈

| 픽셀값   | 토큰                      | 클래스      |
| -------- | ------------------------- | ----------- |
| 10px     | `--text-2xs` (1rem)       | `text-2xs`  |
| 12px     | `--text-xs` (1.2rem)      | `text-xs`   |
| 14px     | `--text-sm` (1.4rem)      | `text-sm`   |
| 16px     | `--text-base` (1.6rem)    | `text-base` |
| 18px     | `--text-lg` (1.8rem)      | `text-lg`   |
| 20px     | `--text-xl` (2rem)        | `text-xl`   |
| 24px     | `--text-2xl` (2.4rem)     | `text-2xl`  |
| **32px** | **`--text-3xl` (3.2rem)** | `text-3xl`  |
| 36px     | `--text-4xl` (3.6rem)     | `text-4xl`  |
| 48px     | `--text-5xl` (4.8rem)     | `text-5xl`  |

### Letter spacing (tracking)

| Figma 표기                                                      | 비율 | 토큰                         | 클래스           |
| --------------------------------------------------------------- | ---- | ---------------------------- | ---------------- |
| `-0.18px` (18px 기준) / `-0.12px` (12px 기준) / `-Npx` (N×0.01) | -1%  | `--tracking-tight` (-0.01em) | `tracking-tight` |

> Pretendard 한국어 표기 시 거의 모든 텍스트가 -1% (-0.01em) tracking. Figma 픽셀 표기를 폰트 크기로 나누어 비율 확인 후 토큰 선택.

### 그림자

| Figma 표기                                          | 토큰                   | 클래스               |
| --------------------------------------------------- | ---------------------- | -------------------- |
| `0 0 5px rgba(0,0,0,0.1)` (말풍선 등 가벼운 글로우) | `--drop-shadow-bubble` | `drop-shadow-bubble` |

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
<p className="text-black-800 text-3xl">사진 한 장으로</p>
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
import appleLogo from '@/assets/apple-logo.png'; // 사실은 카카오 아이콘
```

✅ — 이미 있는 자산을 의미 기반으로 매핑

```tsx
import kakaoIcon from '@/assets/kakao_icon.svg';
```

## 9. 페이지 레이아웃 / Outlet 룰

[Layout.tsx](./src/apps/layout/Layout.tsx)는 모든 페이지의 셸을 다음과 같이 강제한다.

```tsx
<div className="bg-white-default mx-auto flex min-h-svh w-full max-w-3xl flex-col px-20">
    <Outlet />
</div>
```

| 속성        | 값                          | 의미                                                            |
| ----------- | --------------------------- | --------------------------------------------------------------- |
| `max-w-3xl` | 48rem (= 480px @ 1rem=10px) | 모바일 최대 폭. 더 넓은 화면에서는 가운데 정렬되어 480px로 표시 |
| `mx-auto`   | auto                        | 가로 가운데 정렬                                                |
| `px-20`     | 좌우 20px (2rem)            | **모든 페이지에 일관된 좌우 거터**                              |
| `min-h-svh` | viewport 높이               | 콘텐츠가 적어도 흰 배경이 viewport를 채움                       |

### 페이지 작성 룰

- 페이지 컴포넌트는 **`w-full`** 로 작성한다. 폭은 Layout이 결정.
- 좌우 거터는 Layout이 자동 적용 (px-20). 각 페이지에서 `px-N`을 따로 박지 마라.
- 콘텐츠 영역 폭 = `max(viewport, max-w-3xl) - 40px`. 좁은 viewport(390 등)에서도 좌우 20px 거터는 유지되고 콘텐츠 영역만 축소.
- Figma 디자인의 절대 px 폭 요소(예: `w=354`)는 콘텐츠 영역 안에서 비례 또는 `w-full`로 변환. 좁은 viewport에서 잘리지 않도록.

### 풀-블리드(full-bleed) 화면 — 거터 escape

LoginPage 같은 인트로/스플래시 화면처럼 배경 이미지가 화면 끝까지 차야 할 때, **bg 레이어만** 거터를 escape하고 콘텐츠(텍스트/CTA 등)는 padded 영역에 그대로 둔다.

#### 권장 패턴 — bg 레이어만 escape (LoginPage 실사용 패턴)

```tsx
<div className="relative min-h-svh w-full">
    {/* bg 레이어: -left-20 -right-20으로 Layout px-20을 escape */}
    <div className="pointer-events-none absolute top-0 -right-20 bottom-0 -left-20 overflow-hidden">
        <img src={bg} alt="" aria-hidden className="absolute inset-0 size-full object-cover" />
        <div
            aria-hidden
            className="from-white-default absolute inset-0 bg-linear-to-b to-transparent to-50%"
        />
    </div>

    {/* 콘텐츠는 outer 기준(=padded 영역)에 그대로 배치 */}
    <div className="absolute inset-x-0 bottom-48">
        <KakaoButton />
    </div>
</div>
```

- bg 레이어 wrapper는 `-left-20 -right-20`으로 양옆 padding을 상쇄 → 화면 끝까지 차는 풀-블리드
- bg wrapper에 `overflow-hidden`을 둬서 이미지가 자기 wrapper 밖으로 나가지 않게
- outer div에는 **`overflow-hidden`을 넣지 마라** — 그러면 bg 레이어의 escape가 잘림
- 콘텐츠 요소(text/bubble/button 등)는 outer 기준 absolute → 자동으로 padded 영역에 배치
- 풀폭이 필요한 CTA는 wrapper에 `inset-x-0` (`w-354` 같은 고정폭 X)

#### 주의

- 거터 escape는 **명시적인 풀-블리드 의도가 있을 때만**. 일반 페이지는 그대로 두자.
- outer에 `overflow-hidden`이 없으면 매우 짧은 viewport(<530px 등)에서 캐릭터 이미지가 위로 overflow 가능. 실 디바이스 범위 밖이라 무시 가능, 신경 쓰이면 콘텐츠만 별도 `absolute inset-0 overflow-hidden` wrapper로 감쌀 것.

## 10. 디자인 변경 ↔ 문서 동기화

디자인이 업데이트될 때마다 관련 md 파일을 갱신한다. 자세한 룰과 트리거는 [DESIGN_SYNC.md](./DESIGN_SYNC.md) 참조.
