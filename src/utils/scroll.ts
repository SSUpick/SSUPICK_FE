/** window를 상단으로 스크롤. 기본 smooth, prefers-reduced-motion 등은 호출부에서 결정. */
export function scrollToTop(behavior: ScrollBehavior = 'smooth') {
    window.scrollTo({ top: 0, behavior });
}
