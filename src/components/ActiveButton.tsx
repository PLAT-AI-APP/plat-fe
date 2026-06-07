import { cn } from "@/lib/utils";
import React, { ComponentPropsWithoutRef, ReactNode } from "react";

// HTMLButtonElement의 모든 기본 속성을 포함하도록 확장
interface ActiveButtonProps extends ComponentPropsWithoutRef<"button"> {
  text: string;
  isActive: boolean;
  id?: string;
  children?: ReactNode;
}

const ActiveButton = ({
  className,
  text,
  isActive,
  type = "submit",
  id,
  children,
  ...props
}: ActiveButtonProps) => {
  return (
    <button
      id={id}
      type={type}
      disabled={!isActive}
      className={cn(
        "w-full h-11.5 title-3 rounded-lg transition-all",
        isActive
          ? "bg-brand text-font-4 cursor-pointer"
          : "bg-card text-font-1 cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {text}
      {children}
    </button>
  );
};

export default ActiveButton;
