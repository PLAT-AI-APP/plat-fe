"use client";

import { ArrowDown, ArrowRight, ArrowUp } from "@/icons";
import { cn } from "@/lib/utils";
import React, { forwardRef, Ref, useEffect, useRef, useState } from "react";
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
  error?: FieldError | string;
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
      minLine = 1,
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

    const iconRef = useRef<HTMLDivElement>(null);
    const [paddingLeft, setPaddingLeft] = useState<number>(16);

    useEffect(() => {
      if (rightElement && iconRef.current) {
        const iconWidth = iconRef.current.offsetWidth;
        setPaddingLeft(16 + iconWidth + 12);
      } else {
        setPaddingLeft(16);
      }
    }, [rightElement]);

    // 1.5rem(24px) 기준으로 계산 시 오차를 줄이기 위해
    // 실제 텍스트가 차지하는 높이(Line Height)를 20px~22px 정도로 정밀하게 계산하거나
    // 여유 공간을 살짝 줄여서 스크롤이 더 빨리 반응하게 만듭니다.
    const LINE_HEIGHT = 16; // 텍스트 한 줄의 대략적인 높이 (px)
    const VERTICAL_PADDING = 24; // py-3 (12px * 2)
    const BOTTOM_SPACING = 29; // pb-7.25 영역 (글자수 표시용)

    const textareaStyle: React.CSSProperties = {
      paddingLeft: `${paddingLeft}px`,
      // 줄바꿈이 생기자마자 스크롤이 생기도록 max-height를 조금 더 타이트하게 잡습니다 (-4px)
      minHeight: isTextarea
        ? `${minLine * LINE_HEIGHT + VERTICAL_PADDING + BOTTOM_SPACING}px`
        : undefined,
      maxHeight:
        isTextarea && maxLine
          ? `${maxLine * LINE_HEIGHT + VERTICAL_PADDING + BOTTOM_SPACING - 4}px`
          : undefined,
    };

    const handleValueChange = (
      e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    ) => {
      onChange?.(e);
    };

    const isNavigationType =
      label === "휴대폰" || label?.includes("태그 등록(0/5)");

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
          <div className={cn("relative")}>
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
                  style={textareaStyle}
                  className={cn(
                    "w-full px-4 py-3 pb-7.25 bg-transparent outline-none resize-none placeholder:text-font-disabled overflow-y-auto custom-scrollbar",
                    inputClassName,
                  )}
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
                style={{ paddingLeft: `${paddingLeft}px` }}
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
                ref={ref as Ref<HTMLDivElement> | undefined}
                onClick={toggleIsOpen}
                style={{ paddingLeft: `${paddingLeft}px` }}
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

          {error && (
            <span className="pt-2 pl-2 text-font-accents text-xs block">
              {typeof error === "string" ? error : error?.message}
            </span>
          )}
        </div>
      </div>
    );
  },
);

SmartInput.displayName = "SmartInput";

export default React.memo(SmartInput);
