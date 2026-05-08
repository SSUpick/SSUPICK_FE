# SSUPICK FE — Claude 작업 가이드

공통 가이드와 코드 컨벤션은 아래 파일을 항상 따른다.

@AGENTS.md
@CONVENTIONS.md
@FIGMA.md
@DESIGN_SYNC.md

## Claude 전용 메모

- 위 네 파일이 단일 소스. 룰을 추가/수정할 때는 항상 그쪽 파일을 갱신할 것.
- Figma MCP를 쓰는 모든 작업(`get_design_context`, `get_screenshot` 등)은 `FIGMA.md` 우선 참조.
- **디자인 관련 코드 수정 시 `DESIGN_SYNC.md`의 트리거 표를 확인하고, 해당하면 md도 함께 갱신해서 한 번에 제출.**
- 빌드 검증이 필요한 변경은 `pnpm build`로 마무리.
- 응답 언어는 한국어.
