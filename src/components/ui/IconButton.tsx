import type { ComponentProps, ReactNode } from "react";
import {
  iconButtonStyles,
  type IconButtonShape,
  type IconButtonSize,
  type IconButtonTone,
} from "./buttonStyles";

interface IconButtonProps extends ComponentProps<"button"> {
  /**
   * 필수다. 아이콘만 있는 버튼은 접근성 이름이 없으면 스크린리더에서
   * "버튼" 으로만 읽힌다. 감사 시점에 aria-label 없는 아이콘 버튼이 다수였다.
   */
  "aria-label": string;
  size?: IconButtonSize;
  tone?: IconButtonTone;
  shape?: IconButtonShape;
  isPending?: boolean;
  children: ReactNode;
}

/**
 * 아이콘 전용 버튼.
 *
 * size 는 보이는 크기만 정한다. 눌리는 영역은 tap-target 유틸리티가 항상
 * 최소 44px 를 보장하므로, size-6(24px) 버튼도 터치로 정확히 누를 수 있다.
 */
const IconButton = ({
  size,
  tone,
  shape,
  isPending,
  className,
  type = "button",
  children,
  ...props
}: IconButtonProps) => (
  <button
    type={type}
    className={iconButtonStyles({ size, tone, shape, isPending, className })}
    {...props}
  >
    {children}
  </button>
);

export default IconButton;
