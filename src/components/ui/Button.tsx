import type { ComponentProps, ReactNode } from "react";
import {
  buttonStyles,
  chipStyles,
  type ButtonSize,
  type ButtonVariant,
} from "./buttonStyles";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  /** 요청 진행 중 표시. 클릭까지 막으려면 disabled 를 함께 준다. */
  isPending?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

/**
 * 앱의 기본 버튼.
 *
 * type 기본값을 "button" 으로 둔다. HTML 기본값은 "submit" 이라, 폼 안에 놓인
 * 장식용 버튼이 의도치 않게 폼을 제출하는 사고가 흔하다.
 *
 * 스타일 근거와 변형 목록은 buttonStyles.ts 에 있다.
 */
const Button = ({
  variant,
  size,
  fullWidth,
  isPending,
  startIcon,
  endIcon,
  className,
  type = "button",
  children,
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={buttonStyles({ variant, size, fullWidth, isPending, className })}
    {...props}
  >
    {startIcon}
    {children}
    {endIcon}
  </button>
);

export default Button;

interface ChipButtonProps extends ComponentProps<"button"> {
  selected?: boolean;
}

/**
 * 태그·필터용 알약형 토글 버튼.
 *
 * 선택 상태를 aria-pressed 로 함께 노출한다. 색만으로 상태를 전달하면
 * 스크린리더 사용자에게는 아무것도 전달되지 않는다.
 */
export const ChipButton = ({
  selected = false,
  className,
  type = "button",
  children,
  ...props
}: ChipButtonProps) => (
  <button
    type={type}
    aria-pressed={selected}
    className={chipStyles({ selected, className })}
    {...props}
  >
    {children}
  </button>
);
