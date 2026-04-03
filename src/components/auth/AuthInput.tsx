"use client";
import { cn } from "@/lib/utils";
import React from "react";

interface LoginInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  boxClassName?: string;
  InputClassName?: string;
  rightElement?: React.ReactNode;
  leftElement?: React.ReactNode;
  isLabel?: boolean; // 라벨 표시 여부, 기본값은 true
  error?: string;
}

const AuthInput = ({
  label,
  boxClassName,
  InputClassName,
  rightElement,
  leftElement,
  isLabel = true,
  error,
  ...props
}: LoginInputProps) => (
  <section
    id={`auth-field-section-${label}`}
    className={cn("flex flex-col gap-2", boxClassName)}
  >
    {isLabel && (
      <label
        id={`auth-label-${label}`}
        className="text-sm font-medium text-font-1"
      >
        {label}
      </label>
    )}

    <div id={`auth-input-wrapper-${label}`}>
      <div className="relative">
        <input
          id={`auth-input-field-${label}`}
          {...props}
          className={cn(
            "w-full h-11 border border-white/10 bg-black/20 rounded-lg px-4 py-3 text-sm text-font-1",
            "placeholder:text-font-2/50 focus:outline-none focus:border-font-1 transition-all",
            rightElement && "pr-12",
            leftElement && "pl-12",
            error && "border-font-accents",
            InputClassName,
          )}
        />

        {rightElement && (
          <div
            id={`auth-right-icon-${label}`}
            className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center justify-center"
          >
            {rightElement}
          </div>
        )}
        {leftElement && (
          <div
            id={`auth-left-icon-${label}`}
            className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center justify-center"
          >
            {leftElement}
          </div>
        )}
      </div>

      {error && (
        <span
          id={`error-message-${label}`}
          className="pl-2 pt-2 text-font-accents text-[12px]"
        >
          {error}
        </span>
      )}
    </div>
  </section>
);

export default React.memo(AuthInput);
