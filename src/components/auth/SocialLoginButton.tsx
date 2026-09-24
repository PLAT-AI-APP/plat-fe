import React from "react";
import { cn } from "@/lib/utils";

interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  /**
   * 외부 인증 페이지로 넘어가는 중. 페이지가 뜰 때까지 아무 변화가 없으면 여러 번 누르게 되므로
   * 누른 즉시 대기 표시를 하고 더 받지 않는다.
   */
  isPending?: boolean;
}

// id 를 고정값으로 박아 두면 카카오·구글 버튼이 같은 id 를 갖게 된다. 넘겨받은 id 를 쓴다.
const SocialLoginButton = ({
  icon,
  label,
  onClick,
  isPending = false,
  disabled,
  ...props
}: SocialButtonProps) => (
  <button
    type="button"
    {...props}
    onClick={onClick}
    disabled={disabled || isPending}
    aria-busy={isPending || undefined}
    className={cn(
      "relative flex h-11 w-full items-center justify-center rounded-lg border border-main bg-card hover:bg-card-hover",
      isPending && "pending-state",
    )}
  >
    <span
      className="absolute left-7.5 top-1/2 -translate-y-1/2"
    >
      {icon}
    </span>
    <span className="title-5 text-font-1">
      {label}
    </span>
  </button>
);

export default SocialLoginButton;
