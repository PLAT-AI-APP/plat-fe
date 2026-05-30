"use client";

import { ArrowDown, ArrowRight, ArrowUp } from "@/icons";
import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";
import { SmartInputProps } from "./types";
import { useAutoResize, useLeftPadding } from "./hooks";
import {
  LabelSection,
  CharacterCounter,
  ErrorMessage,
  HelperMessage,
} from "./SubComponents";

const SmartInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  SmartInputProps
>((props, ref) => {
  const {
    label,
    placeholder,
    maxLength,
    required = false,
    type = "input",
    inputType = "text",
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
    helperMessage,
    helperMessageType,
    leftElement,
    rightElement,
    labelFontSize = "title-3",
    descFontSize = "body-5",
    ...rest
  } = props;

  const isTextarea = type === "textarea";
  const isModal = type === "modal";
  const isInput = type === "input" || !type;

  const { textareaRef, adjustHeight } = useAutoResize(value, isTextarea);
  const { iconRef, paddingLeft } = useLeftPadding(leftElement);

  // Merge external ref with internal textareaRef
  const handleTextareaRef = (node: HTMLTextAreaElement) => {
    textareaRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref)
      (ref as React.MutableRefObject<HTMLTextAreaElement>).current = node;
  };

  const handleValueChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    // maxLength 속성이 존재할 때, 브라우저 버그로 한 글자 더 들어온 경우 강제로 잘라냅니다.
    if (maxLength && e.target.value.length > maxLength) {
      e.target.value = e.target.value.slice(0, maxLength);
    }

    onChange?.(e);
    if (isTextarea) adjustHeight();
  };

  const isNavigationType =
    label === "휴대폰" || label?.includes("태그 등록(0/5)");

  const renderRightIcon = () => {
    if (isNavigationType) {
      return <ArrowRight className="w-3 h-3 text-font-2" aria-hidden="true" />;
    }
    return isOpen ? (
      <ArrowUp className="w-5 h-5 text-font-2" aria-hidden="true" />
    ) : (
      <ArrowDown className="w-5 h-5 text-font-2" aria-hidden="true" />
    );
  };

  const LINE_HEIGHT = 20;
  const currentLength = String(value || "").length;

  return (
    <div className={cn("flex flex-col flex-1 gap-2 w-full", className)}>
      <LabelSection
        label={label}
        required={required}
        description={description}
        labelFontSize={labelFontSize}
        descFontSize={descFontSize}
      />

      <div className="group body-4">
        <div className="relative">
          {leftElement && (
            <div
              ref={iconRef}
              className="absolute top-1/2 left-4 -translate-y-1/2 z-10 flex items-center justify-center"
            >
              {leftElement}
            </div>
          )}

          {/* 1. Textarea 타입 */}
          {isTextarea && (
            <div
              className={cn(
                "relative flex rounded-xl bg-bg-darkest px-4 py-3 pb-7.25",
                isBorder && "border border-border-main",
                error && "border-font-accents",
                inputBoxClassName,
              )}
            >
              <textarea
                {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                ref={handleTextareaRef}
                style={{
                  minHeight: `${minLine * LINE_HEIGHT}px`,
                  maxHeight: maxLine ? `${maxLine * LINE_HEIGHT}px` : undefined,
                }}
                className={cn(
                  "w-full bg-bg-darkest outline-none resize-none placeholder:text-font-disabled overflow-y-auto custom-scrollbar",
                  inputClassName,
                )}
                placeholder={placeholder}
                value={value}
                onChange={handleValueChange}
                maxLength={maxLength}
              />
              <CharacterCounter
                currentLength={currentLength}
                maxLength={maxLength}
                isTextarea
              />
            </div>
          )}

          {/* 2. Input 타입 */}
          {isInput && (
            <input
              {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
              ref={ref as React.ForwardedRef<HTMLInputElement>}
              style={{ paddingLeft: `${paddingLeft}px` }}
              type={inputType}
              className={cn(
                "w-full px-4 py-3 bg-bg-darkest border border-border-main rounded-xl outline-none placeholder:text-font-disabled",
                rightElement && "pr-11",
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
          {isModal && (
            <div
              ref={ref as React.Ref<HTMLDivElement>}
              onClick={toggleIsOpen}
              style={{ paddingLeft: `${paddingLeft}px` }}
              className={cn(
                "relative body-4 px-4 py-3 flex items-center justify-between rounded-xl border border-border-main bg-bg-darkest cursor-pointer",
                error && "border-font-accents",
                inputBoxClassName,
              )}
            >
              <span className={cn(!value && "text-font-disabled")}>
                {value || placeholder}
              </span>
              {renderRightIcon()}
              {isOpen && modalComponents}
            </div>
          )}

          {!isModal && !isTextarea && maxLength && (
            <CharacterCounter
              currentLength={currentLength}
              maxLength={maxLength}
            />
          )}

          {rightElement && (
            <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10 flex items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>

        {error ? (
          <ErrorMessage error={error} />
        ) : (
          <HelperMessage message={helperMessage} type={helperMessageType} />
        )}
      </div>
    </div>
  );
});

SmartInput.displayName = "SmartInput";

export default React.memo(SmartInput);
