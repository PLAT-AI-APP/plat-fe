"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { FieldError } from "react-hook-form";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  isLabel?: boolean;
  boxClassName?: string;
  inputClassName?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

/**
 * 인증(로그인/회원가입) 폼에서 공통으로 사용되는 입력 필드 컴포넌트입니다.
 */
const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  (
    {
      label,
      error,
      isLabel = true,
      boxClassName,
      inputClassName,
      leftElement,
      rightElement,
      id,
      ...props
    },
    ref,
  ) => {
    // 고유 ID 생성 (id가 없을 경우 label 기반)
    const inputId = id || `auth-input-${label}`;

    return (
      <section className={cn("flex flex-col gap-2", boxClassName)}>
        {/* 라벨 영역 */}
        {isLabel && (
          <label htmlFor={inputId} className="text-sm font-medium text-font-1">
            {label}
          </label>
        )}

        <div className="relative flex flex-col">
          <div className="relative group">
            {/* 왼쪽 아이콘/엘리먼트 */}
            {leftElement && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center z-10">
                {leftElement}
              </div>
            )}

            {/* 입력창 */}
            <input
              ref={ref}
              id={inputId}
              {...props}
              className={cn(
                // 기본 스타일
                "w-full h-11 border border-border-main bg-black/20 rounded-lg px-4 py-3 text-sm text-font-1",
                "placeholder:text-font-2/50 focus:outline-none focus:border-brand transition-all",
                // 아이콘 유무에 따른 여백 조절
                leftElement && "pl-11",
                rightElement && "pr-11",
                // 에러 발생 시 스타일
                error && "border-font-accents focus:border-font-accents",
                inputClassName,
              )}
            />

            {/* 오른쪽 아이콘/엘리먼트 (비밀번호 보기 등) */}
            {rightElement && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center z-10">
                {rightElement}
              </div>
            )}
          </div>

          {/* 에러 메시지 영역 */}
          {error && (
            <span
              role="alert"
              className="pl-2 pt-1.5 text-font-accents text-xs"
            >
              {error.message}
            </span>
          )}
        </div>
      </section>
    );
  },
);

AuthInput.displayName = "AuthInput";

export default React.memo(AuthInput);
