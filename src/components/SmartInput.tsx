"use client";

import { ArrowDown, ArrowRight, ArrowUp } from "@/icons";
import { cn } from "@/lib/utils";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { FieldError } from "react-hook-form";

interface SmartInputProps extends React.InputHTMLAttributes<
  HTMLInputElement | HTMLTextAreaElement
> {
  label?: string;
  maxLength?: number;
  required?: boolean;
  type?: "input" | "textarea" | "modal";
  isOpen?: boolean;
  inputClassName?: string;
  isBorder?: boolean;
  minLine?: number;
  maxLine?: number;
  description?: string;
  modalComponents?: React.ReactNode;
  toggleIsOpen?: () => void;
  error?: FieldError;
  rightElement?: React.ReactNode;
}

const SmartInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  SmartInputProps
>(
  (
    {
      label,
      placeholder,
      maxLength,
      required = false,
      type = "input",
      inputClassName,
      isBorder = true,
      maxLine,
      minLine,
      description,
      className,
      value,
      isOpen,
      modalComponents,
      toggleIsOpen,
      onChange,
      error = undefined,
      rightElement,
      ...rest
    },
    ref,
  ) => {
    const isTextarea = type === "textarea";
    const isModal = type === "modal";

    // 아이콘 넓이를 측정하기 위한 Ref와 State
    const iconRef = useRef<HTMLDivElement>(null);
    const [paddingLeft, setPaddingLeft] = useState<number>(16); // 기본값 16px (pl-4)

    useEffect(() => {
      if (rightElement && iconRef.current) {
        // 아이콘의 실제 넓이 측정 (offsetWidth)
        // 패딩 공식: 왼쪽 기본 여백(16px) + 아이콘 넓이 + 추가 간격(12px)
        const iconWidth = iconRef.current.offsetWidth;
        setPaddingLeft(16 + iconWidth + 12);
      } else {
        setPaddingLeft(16); // 아이콘이 없으면 기본 패딩
      }
    }, [rightElement]); // 아이콘 컴포넌트가 바뀔 때마다 다시 계산

    const dynamicPaddingLeft = { paddingLeft: `${paddingLeft}px` };

    const handleValueChange = (
      e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    ) => {
      if (isTextarea && maxLine) {
        const lineCount = e.target.value.split("\n").length;
        if (lineCount > maxLine) return;
      }
      onChange?.(e);
    };

    // "태그" 포함 여부 및 특정 레이블 체크 로직을 변수로 캡슐화
    const isNavigationType =
      label === "휴대폰" || label?.includes("태그 등록(0/5)");

    // 우측 아이콘 렌더링 로직
    const renderRightIcon = () => {
      if (isNavigationType) {
        return (
          <ArrowRight className="w-3 h-3 text-font-2" aria-hidden="true" />
        );
      }

      return isOpen ? (
        <ArrowUp className="w-5 h-5 text-font-2" aria-hidden="true" />
      ) : (
        <ArrowDown className="w-5 h-5 text-font-2" aria-hidden="true" />
      );
    };

    return (
      <div className={cn("flex flex-col flex-1 gap-2 w-full", className)}>
        {label && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 font-medium text-sm">
              <span>{label}</span>
              {required && <span className="text-font-accents">*</span>}
            </div>
            {description && (
              <p className="text-xs text-font-2">{description}</p>
            )}
          </div>
        )}

        <div className="group text-sm font-medium">
          <div className="relative">
            {/* 아이콘 영역: z-index를 주어 텍스트 위로 오도록 설정 */}
            {rightElement && (
              <div
                ref={iconRef}
                className="absolute top-1/2 left-4 -translate-y-1/2 z-10 flex items-center justify-center"
              >
                {rightElement}
              </div>
            )}

            {/* 1. Textarea 타입 */}
            {type === "textarea" && (
              <div
                className={cn(
                  "flex rounded-xl bg-bg-darkest",
                  isBorder && "border border-border-main",
                  error && "border-font-accents",
                )}
              >
                <textarea
                  {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                  ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
                  style={dynamicPaddingLeft}
                  className={cn(
                    "w-full h-fit px-4 py-3 pb-7.25 bg-transparent outline-none resize-none placeholder:text-font-disabled",
                    inputClassName,
                  )}
                  rows={minLine}
                  placeholder={placeholder}
                  value={value}
                  onChange={handleValueChange}
                  maxLength={maxLength}
                />
              </div>
            )}

            {/* 2. Input 타입 */}
            {(type === "input" || !type) && (
              <input
                {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
                ref={ref as React.ForwardedRef<HTMLInputElement>}
                style={dynamicPaddingLeft}
                type="text"
                className={cn(
                  "w-full px-4 py-3 bg-bg-darkest border border-border-main rounded-xl outline-none placeholder:text-font-disabled",
                  inputClassName,
                  error && "border-font-accents",
                )}
                placeholder={placeholder}
                value={value}
                onChange={handleValueChange}
                maxLength={maxLength}
              />
            )}

            {/* 3. Modal 타입 */}
            {type === "modal" && (
              <div
                onClick={toggleIsOpen}
                style={dynamicPaddingLeft}
                className={cn(
                  "relative px-4 py-3 flex items-center justify-between rounded-xl border border-border-main bg-bg-darkest text-sm font-medium cursor-pointer",
                  error && "border-font-accents",
                )}
              >
                <span className={cn(!value && "text-font-disabled")}>
                  {value || placeholder}
                </span>
                {renderRightIcon()}

                {modalComponents}
              </div>
            )}

            {/* 글자 수 표시 */}
            {!isModal && maxLength && (
              <div
                className={cn(
                  "absolute right-4 text-xs text-font-2 pointer-events-none",
                  isTextarea ? "bottom-3" : "top-1/2 -translate-y-1/2",
                )}
              >
                {String(value || "").length}/{maxLength}
              </div>
            )}
          </div>

          {/* 에러 메시지 */}
          {error && (
            <span className="pt-2 pl-2 text-font-accents text-xs block">
              {error.message}
            </span>
          )}
        </div>
      </div>
    );
  },
);

SmartInput.displayName = "SmartInput";

export default React.memo(SmartInput);
