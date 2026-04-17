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
  inputBoxClassName?: string;
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
      inputBoxClassName,
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

    // 내부에서 textarea 엘리먼트에 직접 접근하기 위한 ref
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // 외부 ref와 내부 ref를 합쳐주는 함수
    const handleRef = (node: HTMLTextAreaElement) => {
      textareaRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref)
        (ref as React.MutableRefObject<HTMLTextAreaElement>).current = node;
    };

    const LINE_HEIGHT = 20;
    const VERTICAL_PADDING = 24;
    const BOTTOM_SPACING = 0;

    // 높이를 계산하고 적용하는 핵심 함수
    const adjustHeight = () => {
      const textarea = textareaRef.current;
      if (!textarea || !isTextarea) return;

      // 높이를 초기화해서 정확한 scrollHeight를 측정할 수 있게 함
      textarea.style.height = "auto";

      // 내용의 전체 높이(scrollHeight)를 실제 height에 대입
      // 이때 CSS의 minHeight와 maxHeight가 범위를 제한해줍니다.
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    // 4. value가 바뀌거나 처음 렌더링될 때 높이 조절
    useEffect(() => {
      if (isTextarea) {
        adjustHeight();
      }
    }, [value, isTextarea]);

    const textareaStyle: React.CSSProperties = {
      // paddingLeft: `${paddingLeft}px`,
      minHeight: isTextarea ? `${minLine * LINE_HEIGHT}px` : undefined,
      maxHeight:
        isTextarea && maxLine ? `${maxLine * LINE_HEIGHT}px` : undefined,
    };

    const handleValueChange = (
      e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    ) => {
      onChange?.(e);
      // 5. 입력할 때마다 즉시 높이 조절
      if (isTextarea) adjustHeight();
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
                  "relative flex rounded-xl bg-bg-darker px-4 py-3 pb-7.25",
                  isBorder && "border border-border-main",
                  error && "border-font-accents",
                  inputBoxClassName,
                )}
              >
                <textarea
                  {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                  ref={handleRef} // 합성된 ref 사용
                  style={textareaStyle}
                  className={cn(
                    "w-full outline-none resize-none placeholder:text-font-disabled overflow-y-auto custom-scrollbar",
                    inputClassName,
                  )}
                  placeholder={placeholder}
                  value={value}
                  onChange={handleValueChange}
                  maxLength={maxLength}
                />

                <div
                  className={cn(
                    "absolute right-4 text-xs text-font-2 pointer-events-none",
                    isTextarea ? "bottom-3" : "top-1/2 -translate-y-1/2",
                  )}
                >
                  {String(value || "").length}/{maxLength}
                </div>
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
                  inputBoxClassName,
                )}
              >
                <span className={cn(!value && "text-font-disabled")}>
                  {value || placeholder}
                </span>
                {renderRightIcon()}

                {modalComponents}
              </div>
            )}

            {!isModal && maxLength && type !== "textarea" && (
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
