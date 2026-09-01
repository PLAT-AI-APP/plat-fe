import { cn } from "@/lib/utils";
import React, { ComponentPropsWithoutRef, ReactNode } from "react";

// HTMLButtonElement의 모든 기본 속성을 포함하도록 확장
interface ActiveButtonProps extends ComponentPropsWithoutRef<"button"> {
  text: string;
  isActive: boolean;
  id?: string;
  children?: ReactNode;
  textClassName?: string;
}

const ActiveButton = ({
  className,
  text,
  isActive,
  type = "button",
  id,
  children,
  textClassName,
  ...props
}: ActiveButtonProps) => {
  return (
    <button
      id={id}
      type={type}
      disabled={!isActive}
      className={cn(
        "h-11 w-full title-5 rounded-lg transition",
        isActive
          ? "bg-brand text-on-brand cursor-pointer"
          : "bg-card text-font-1 cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {text && <span className={textClassName}>{text}</span>}
      {children}
    </button>
  );
};

export default ActiveButton;
