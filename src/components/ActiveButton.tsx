import { cn } from "@/lib/utils";
import React, { ComponentPropsWithoutRef, ReactNode } from "react";

// HTMLButtonElement의 모든 기본 속성을 포함하도록 확장
interface ActiveButtonProps extends ComponentPropsWithoutRef<"button"> {
  text: string;
  isActive: boolean;
  id?: string;
  children?: ReactNode;
  textClassName?: string;
  /**
   * 요청 진행 중. 입력이 모자라 못 누르는 상태(isActive=false)와 구분되도록 브랜드색은 그대로 두고
   * 스피너와 pending-state 로 "처리 중" 임을 보인다. 이 동안은 눌리지 않는다.
   */
  isPending?: boolean;
}

/**
 * 앱의 주요 CTA.
 *
 * 15개 화면에서 쓰이는데도 hover·press·focus 상태가 하나도 없었고,
 * 비활성일 때 글자가 text-font-1(본문과 같은 밝기)이라 눌리는 버튼과
 * 눌리지 않는 버튼이 똑같아 보였다.
 *
 * hover 를 색상 토큰이 아니라 brightness 로 처리하는 이유: 브랜드 오렌지는
 * 라이트/다크 모두 밝은 색이라 --brand-dark 로 바꾸면 라이트에서는 어두워져
 * 그 위 글자(--on-brand, 거의 검정)와 대비가 무너진다.
 */
const ActiveButton = ({
  className,
  text,
  isActive,
  type = "button",
  id,
  children,
  textClassName,
  disabled,
  isPending = false,
  ...props
}: ActiveButtonProps) => {
  const isDisabled = isPending || (disabled ?? !isActive);

  return (
    <button
      id={id}
      type={type}
      disabled={isDisabled}
      aria-busy={isPending || undefined}
      className={cn(
        "title-5 inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-lg transition",
        "hover:brightness-110 active:scale-[0.99] active:brightness-95",
        "disabled:pointer-events-none",
        isPending
          ? "pending-state"
          : "disabled:bg-card disabled:text-font-disabled",
        isActive || isPending
          ? "bg-brand text-on-brand"
          : "bg-card text-font-disabled",
        className,
      )}
      {...props}
    >
      {isPending && (
        <span
          aria-hidden="true"
          className="size-4 shrink-0 animate-spin rounded-full border-2 border-on-brand/40 border-t-on-brand"
        />
      )}
      {text && <span className={textClassName}>{text}</span>}
      {!(isPending && !text) && children}
    </button>
  );
};

export default ActiveButton;
