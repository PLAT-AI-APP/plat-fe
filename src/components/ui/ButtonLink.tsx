import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import {
  buttonStyles,
  type ButtonSize,
  type ButtonVariant,
} from "./buttonStyles";

interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

/**
 * 버튼처럼 보이지만 이동하는 링크.
 *
 * 이동은 링크여야 한다 — 새 탭으로 열기·주소 복사·미리 가져오기가 모두
 * 링크에서만 동작한다. 그래서 button 으로 만들고 router.push 를 부르는 대신
 * Link 에 버튼 스타일을 입힌다. 스타일 계산은 Button 과 같은 함수를 쓴다.
 */
const ButtonLink = ({
  variant,
  size,
  fullWidth,
  startIcon,
  endIcon,
  className,
  children,
  ...props
}: ButtonLinkProps) => (
  <Link
    className={buttonStyles({ variant, size, fullWidth, className })}
    {...props}
  >
    {startIcon}
    {children}
    {endIcon}
  </Link>
);

export default ButtonLink;
