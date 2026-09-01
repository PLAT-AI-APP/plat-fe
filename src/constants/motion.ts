/**
 * 앱 전역 모션 스케일.
 *
 * 이 파일이 생기기 전에는 duration 이 0.1 / 0.15 / 0.18 / 0.2 / 0.22 / 0.24 /
 * 0.3 / 0.4 / 0.45 / 0.9 / 1.0 으로 열 종류 넘게 흩어져 있었고, spring 설정도
 * 파일마다 복붙돼 있었다. 같은 성격의 움직임이 화면마다 다른 속도로 재생되면
 * 앱 전체가 어수선하게 느껴진다.
 *
 * 값은 globals.css 의 --motion-* 커스텀 프로퍼티와 짝을 이룬다. CSS 쪽을 바꾸면
 * 여기도 같이 바꿔야 한다.
 */

/** 초 단위 지속 시간. framer-motion 은 초를 쓴다. */
export const DURATION = {
  /** 색·투명도처럼 즉각적으로 느껴져야 하는 변화 */
  fast: 0.15,
  /** 기본값. 대부분의 hover·열림/닫힘 */
  base: 0.2,
  /** 사이드바·아코디언처럼 이동 거리가 큰 변화 */
  slow: 0.3,
} as const;

/**
 * 감속 곡선. 끝에서 부드럽게 멈춰 "도착했다"는 느낌을 준다.
 * 등장/이동의 기본값으로 쓴다.
 */
export const EASE_OUT = [0.32, 0.72, 0, 1] as const;

/** 왕복하거나 제자리로 돌아오는 변화(아코디언 펼침/접힘)에 쓴다. */
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

/** 기본 전환. 특별한 이유가 없으면 이걸 쓴다. */
export const TRANSITION = {
  duration: DURATION.base,
  ease: EASE_OUT,
} as const;

export const TRANSITION_FAST = {
  duration: DURATION.fast,
  ease: EASE_OUT,
} as const;

export const TRANSITION_SLOW = {
  duration: DURATION.slow,
  ease: EASE_OUT,
} as const;

/** 높이/폭이 열리고 닫히는 아코디언류. 왕복이라 in-out 을 쓴다. */
export const TRANSITION_COLLAPSE = {
  duration: DURATION.base,
  ease: EASE_IN_OUT,
} as const;

/**
 * 손가락으로 민 것처럼 따라붙는 움직임. 탭 밑줄·토글 손잡이처럼
 * 사용자의 조작에 직접 반응하는 요소에만 쓴다.
 */
export const SPRING_SNAPPY = {
  type: "spring",
  stiffness: 500,
  damping: 40,
} as const;

/** 사이드바처럼 면적이 큰 요소. 덜 튀도록 부드럽게. */
export const SPRING_SOFT = {
  type: "spring",
  stiffness: 300,
  damping: 34,
} as const;

/* ------------------------------------------------------------------ *
 * 공용 variants
 * ------------------------------------------------------------------ */

/** 오버레이·스크림 페이드 */
export const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
} as const;

/**
 * 모달·다이얼로그·팝오버 등장.
 * 위치가 아니라 transform(scale/y)만 움직여 레이아웃을 건드리지 않는다.
 */
export const popVariants = {
  initial: { opacity: 0, scale: 0.96, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 8 },
} as const;

/** 아래에서 올라오는 시트/툴팁 */
export const slideUpVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
} as const;

/**
 * 높이 접힘/펼침.
 * height 애니메이션은 레이아웃을 다시 계산시키지만, 내용 길이를 미리 알 수
 * 없는 아코디언에서는 대안이 마땅치 않다. 대신 지속 시간을 통일해 둔다.
 */
export const collapseVariants = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
} as const;
