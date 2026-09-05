/** 태블릿 이하로 간주하는 뷰포트 상한. Tailwind `lg`(1024px)의 바로 아래 경계와 맞춘다. */
export const TABLET_MAX_WIDTH_QUERY = "(max-width: 1023px)";

/**
 * 사이드바 레일조차 두지 않는 폭. 이 아래에서는 사이드바가 콘텐츠 폭을 전혀 쓰지 않고,
 * 헤더 버튼으로 여는 오버레이 드로어로만 존재한다 — 좁은 화면에서 70px 레일은
 * 카드가 쓸 폭의 상당 부분을 먹는다.
 */
export const MOBILE_MAX_WIDTH_QUERY = "(max-width: 639px)";
