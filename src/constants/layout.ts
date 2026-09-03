/**
 * 사이드바 펼침/접힘 폭(px).
 *
 * 실제 레이아웃 폭은 globals.css 의 `--sidebar-width-folded` / `--sidebar-width-expanded`
 * 토큰이 정한다. 이 상수는 JS 계산이 필요한 곳(예: 스크롤 오프셋)을 위한 사본이며,
 * 두 값은 항상 같이 움직여야 한다.
 */
export const SIDEBAR_WIDTH = {
  expanded: 240,
  folded: 70,
} as const;

/** 태블릿 이하로 간주하는 뷰포트 상한. Tailwind `lg`(1024px)의 바로 아래 경계와 맞춘다. */
export const TABLET_MAX_WIDTH_QUERY = "(max-width: 1023px)";
