"use client";
import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";

interface SmartInputProps extends React.InputHTMLAttributes<
  HTMLInputElement | HTMLTextAreaElement
> {
  label?: string;
  maxLength: number;
  required?: boolean;
  type?: "input" | "textarea";
  inputClassName?: string;
  isBorder?: boolean;
  minLine?: number;
  maxLine?: number;
  description?: string;
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
      onChange,
      ...rest
    },
    ref,
  ) => {
    const isTextarea = type === "textarea";

    // 줄 수 제한 및 값 변경 핸들러
    const handleValueChange = (
      e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    ) => {
      if (isTextarea && maxLine) {
        const lineCount = e.target.value.split("\n").length;
        if (lineCount > maxLine) return; // 제한 줄 수 초과 시 업데이트 방지
      }
      // react-hook-form의 onChange를 호출합니다.
      onChange?.(e);
    };

    return (
      <div className={cn("flex flex-col flex-1 gap-3 w-full", className)}>
        {label && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 font-semibold text-sm">
              <span>{label}</span>
              {required && <span className="text-font-accents">*</span>}
            </div>
            {description && (
              <p className="text-xs text-font-2">{description}</p>
            )}
          </div>
        )}

        <div className="relative group text-sm">
          {isTextarea ? (
            <div
              className={cn(
                "flex rounded-xl bg-bg-darkest",
                isBorder && "border border-border-main",
              )}
            >
              <textarea
                {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
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
          ) : (
            <input
              {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
              ref={ref as React.ForwardedRef<HTMLInputElement>}
              type="text"
              className={cn(
                "w-full p-3 bg-bg-darkest border border-border-main rounded-xl outline-none placeholder:text-font-disabled",
                inputClassName,
              )}
              placeholder={placeholder}
              value={value}
              onChange={handleValueChange}
              maxLength={maxLength}
            />
          )}

          {/* 글자 수 표시: value가 있을 때만 렌더링하거나 기본값 0 처리 */}
          <div
            className={cn(
              "absolute right-4 text-xs text-font-2 pointer-events-none",
              isTextarea ? "bottom-3" : "top-1/2 -translate-y-1/2",
            )}
          >
            {String(value || "").length}/{maxLength}
          </div>
        </div>
      </div>
    );
  },
);

SmartInput.displayName = "SmartInput";

export default React.memo(SmartInput);
