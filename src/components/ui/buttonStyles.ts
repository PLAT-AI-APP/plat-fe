import { cn } from "@/lib/utils";

/**
 * 버튼 스타일의 단일 출처.
 *
 * 감사 시점에 버튼 성격의 요소가 217개였고 그중 고유한 클래스 조합이 160개였다.
 * 즉 버튼 다섯 개 중 넷은 자기만의 스타일을 갖고 있었다. 모서리는 7종, 높이는
 * 14종, 같은 역할의 hover 표현이 6종으로 갈려 있었고, disabled 시각 처리를
 * 가진 버튼은 187개 중 7개(4%)뿐이었다.
 *
 * 여기 적힌 값은 새로 만든 디자인 언어가 아니라 **코드에서 이미 가장 많이 쓰이던
 * 조합을 정본으로 승격**한 것이다. 그래야 옮기는 과정에서 화면이 바뀌지 않는다.
 *
 * transition 은 넣지 않는다. styles/base.css 의 `button {}` 이 이미
 * transition-property 를 색/투명도/변형으로 한정해 전역 지정하고 있고,
 * 여기서 transition-colors 를 또 걸면 그 한정이 풀린다.
 * 포커스 링도 마찬가지로 base.css 의 :focus-visible 이 담당한다.
 */

export type ButtonVariant =
  | "primary"
  | "inverse"
  | "secondary"
  | "outline"
  | "brandSoft"
  | "ghost"
  | "quiet"
  | "danger";

export type ButtonSize = "lg" | "md" | "sm";

const BASE =
  "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap disabled:pointer-events-none disabled:text-font-disabled";

/** 면을 가진 변형이 비활성일 때. 면 없는 변형(ghost/quiet/danger)은 글자만 흐려진다. */
const FILLED_DISABLED = "disabled:bg-card disabled:border-transparent";

const VARIANT: Record<ButtonVariant, string> = {
  /**
   * 주 CTA.
   *
   * hover 를 색 토큰이 아니라 brightness 로 처리한다. 브랜드 오렌지는 라이트·다크
   * 모두 밝은 색이라 --brand-dark 로 바꾸면 라이트에서 오히려 어두워지고,
   * 그 위 글자(--on-brand, 거의 검정)와의 대비가 무너진다.
   */
  primary: cn(
    "bg-brand text-on-brand hover:brightness-110 active:scale-[0.99] active:brightness-95",
    FILLED_DISABLED,
  ),
  /** 팔로우·구독처럼 배경 위에서 가장 눈에 띄어야 하는 고대비 CTA. */
  inverse: cn("bg-font-1 text-dark hover:opacity-90", FILLED_DISABLED),
  /** 취소·보조. 주 CTA 옆에 나란히 놓이는 자리. */
  secondary: cn("bg-card text-font-1 hover:bg-card-hover", FILLED_DISABLED),
  /** 중립 테두리. 필터·정렬·소셜 로그인 등 가장 많이 쓰이는 형태. */
  outline: cn(
    "border border-main bg-dark text-font-2 hover:bg-btn-hover hover:text-font-1",
    FILLED_DISABLED,
  ),
  /** 브랜드 톤다운 CTA. 주 CTA 만큼 강하지 않아야 하는 유도 버튼. */
  brandSoft: cn(
    "border border-brand-dark bg-brand-opacity text-brand-dark hover:bg-brand-opacity-2",
    FILLED_DISABLED,
  ),
  /** 툴바·메뉴 항목. 평소엔 면이 없고 hover 에서만 면이 생긴다. */
  ghost: "text-font-2 hover:bg-btn-hover hover:text-font-1",
  /** 텍스트 링크형. 면이 아예 없다. */
  quiet: "text-font-2 hover:text-font-1",
  /**
   * 삭제·차단 등 파괴적 액션.
   *
   * 예전에는 이 자리에 text-font-accents(#ed1c24) 가 쓰였다. 앱에 빨강이
   * --danger / --font-error / --font-accents 세 종류 있었는데, 상태색 체계에
   * 속한 --danger 로 모은다.
   */
  danger: "text-danger hover:bg-danger-bg",
};

const SIZE: Record<ButtonSize, string> = {
  lg: "title-5 h-11 gap-1.5 rounded-xl px-4",
  md: "title-5 h-10 gap-1.5 rounded-xl px-4",
  sm: "title-6 h-8 gap-1 rounded-lg px-3",
};

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  /** 요청 진행 중. utilities.css 의 pending-state(cursor-wait + opacity) 를 건다. */
  isPending?: boolean;
  className?: string;
}

/** Button 과 ButtonLink 가 공유하는 클래스 계산. */
export const buttonStyles = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  isPending = false,
  className,
}: ButtonStyleOptions = {}) =>
  cn(
    BASE,
    VARIANT[variant],
    SIZE[size],
    fullWidth && "w-full",
    isPending && "pending-state",
    className,
  );

/* ------------------------------------------------------------------ *
 * 칩 / 토글
 * ------------------------------------------------------------------ */

/**
 * 태그·필터처럼 선택 상태를 갖는 알약형 버튼.
 *
 * 일반 variant 와 달리 선택 여부가 색을 결정하므로 별도로 둔다.
 */
export const chipStyles = ({
  selected = false,
  className,
}: { selected?: boolean; className?: string } = {}) =>
  cn(
    BASE,
    "title-6 h-8 rounded-full border px-3",
    selected
      ? "border-brand bg-brand-opacity text-brand-dark"
      : "border-main bg-dark text-font-2 hover:bg-btn-hover hover:text-font-1",
    className,
  );

/* ------------------------------------------------------------------ *
 * 아이콘 버튼
 * ------------------------------------------------------------------ */

export type IconButtonSize = "xs" | "sm" | "md" | "lg";
export type IconButtonTone = "ghost" | "surface" | "overlay";
export type IconButtonShape = "rounded" | "circle";

const ICON_SIZE: Record<IconButtonSize, string> = {
  xs: "size-6",
  sm: "size-7",
  md: "size-8",
  lg: "size-10",
};

const ICON_TONE: Record<IconButtonTone, string> = {
  ghost: "text-font-2 hover:bg-btn-hover hover:text-font-1",
  surface: "bg-card text-font-1 hover:bg-card-hover",
  /** 이미지 위에 얹히는 자리. 글자색은 테마와 무관하게 항상 밝다. */
  overlay:
    "bg-overlay-font/12 text-font-0 backdrop-blur-[1.54px] hover:bg-overlay-font/20",
};

export interface IconButtonStyleOptions {
  size?: IconButtonSize;
  tone?: IconButtonTone;
  shape?: IconButtonShape;
  isPending?: boolean;
  className?: string;
}

export const iconButtonStyles = ({
  size = "md",
  tone = "ghost",
  shape = "rounded",
  isPending = false,
  className,
}: IconButtonStyleOptions = {}) =>
  cn(
    BASE,
    // 아이콘 버튼은 대부분 44px 미만이라 터치 히트 영역을 따로 넓힌다.
    "tap-target",
    ICON_SIZE[size],
    ICON_TONE[tone],
    shape === "circle" ? "rounded-full" : "rounded-lg",
    isPending && "pending-state",
    className,
  );
