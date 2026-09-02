/** 사이드바 펼침/접힘 폭(px). Sidebar와 ClientLayout 오버레이가 같은 값을 공유해야 어긋나지 않는다. */
export const SIDEBAR_WIDTH = {
  expanded: 240,
  folded: 70,
} as const;

/** 태블릿 이하로 간주하는 뷰포트 상한. Tailwind `lg`(1024px)의 바로 아래 경계와 맞춘다. */
export const TABLET_MAX_WIDTH_QUERY = "(max-width: 1023px)";
