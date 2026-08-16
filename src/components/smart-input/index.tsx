"use client";

import { ArrowDown, ArrowRight, ArrowUp } from "@/icons";
import { useTranslateText } from "@/hooks/useTranslateText";
import { cn } from "@/lib/utils";
import React, { forwardRef, useState } from "react";
import {
  CharacterCounter,
  ErrorMessage,
  HelperMessage,
  LabelSection,
} from "./SubComponents";
import { useAutoResizeTextarea } from "@/hooks/useAutoResizeTextarea";
import { useLeftPadding } from "./hooks";
import { SmartInputProps } from "./types";

const SmartInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  SmartInputProps
>((props, ref) => {
  const {
    label,
    showOptionalLabel = false,
    placeholder,
    maxLength,
    required = false,
    type = "input",
    inputType = "text",
    inputClassName,
    inputBoxClassName,
    placeholderClassName,
    counterClassName,
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
    onFocus,
    onBlur,
    ...rest
  } = props;

  const isTextarea = type === "textarea";
  const isModal = type === "modal";
  const isInput = type === "input" || !type;
  const translateText = useTranslateText();
  const [isFocused, setIsFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState(() =>
    String(value ?? ""),
  );
  // controlled 입력은 props.value를 기준으로, uncontrolled 입력은 내부 상태를 기준으로 글자 수를 계산합니다.
  const currentDisplayValue =
    value !== undefined ? String(value ?? "") : displayValue;

  const { textareaRef, resizeTextarea } = useAutoResizeTextarea({
    enabled: isTextarea,
    value,
  });
  const { iconRef, paddingLeft } = useLeftPadding(leftElement);

  const handleTextareaRef = (node: HTMLTextAreaElement | null) => {
    textareaRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref)
      (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current =
        node;
  };

  const handleValueChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    // 붙여넣기나 IME 조합 확정 시 maxLength를 넘어설 수 있어 네이티브 속성과 별개로 한 번 더 잘라냅니다.
    if (typeof maxLength === "number" && e.target.value.length > maxLength) {
      e.target.value = e.target.value.slice(0, maxLength);
    }
    if (value === undefined) {
      setDisplayValue(e.target.value);
    }
    onChange?.(e);
    if (isTextarea) resizeTextarea();
  };

  const isNavigationType =
    label === "메인어" || label?.includes("태그 등록(0/5)");

  const renderRightIcon = () => {
    if (isNavigationType) {
      return <ArrowRight className="h-3 w-3 text-font-2" aria-hidden="true" />;
    }

    return isOpen ? (
      <ArrowUp className="h-5 w-5 text-font-2" aria-hidden="true" />
    ) : (
      <ArrowDown className="h-5 w-5 text-font-2" aria-hidden="true" />
    );
  };

  const LINE_HEIGHT = 20;
  const currentLength = currentDisplayValue.length;
  const isLengthExceeded =
    typeof maxLength === "number" && currentLength > maxLength;
  const hasError = error !== undefined && error !== null;
  const errorMessage = typeof error === "string" ? error : error?.message;
  const hasErrorMessage = Boolean(errorMessage);
  // textarea에는 카운터만 사용하고, 공통 하단 메시지는 노출하지 않습니다.
  const shouldRenderBottomMessage = !isTextarea;

  const handleFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <div className={cn("flex w-full flex-1 flex-col gap-2", className)}>
      <LabelSection
        label={label}
        required={required}
        showOptionalLabel={showOptionalLabel}
        description={description}
        labelFontSize={labelFontSize}
        descFontSize={descFontSize}
      />

      <div className="group body-4">
        <div className="relative">
          {leftElement && (
            <div
              ref={iconRef}
              className="absolute left-4 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center"
            >
              {leftElement}
            </div>
          )}

          {isTextarea && (
            <div
              className={cn(
                "relative flex rounded-xl bg-darkest px-4 pb-7.25 pt-3",
                isBorder && "border border-main",
                isFocused && "border-brand-dark bg-brand-opacity-3",
                hasError && "border-font-accents",
                isFocused && hasError && "border-brand-dark",
                isLengthExceeded && "border-font-error",
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
                  "w-full resize-none overflow-y-auto bg-transparent outline-none placeholder:text-font-disabled custom-scrollbar",
                  placeholderClassName,
                  inputClassName,
                )}
                placeholder={translateText(placeholder)}
                maxLength={maxLength}
                value={value}
                onChange={handleValueChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <CharacterCounter
                currentLength={currentLength}
                maxLength={maxLength}
                isTextarea
                className={counterClassName}
              />
            </div>
          )}

          {isInput && (
            <input
              {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
              ref={ref as React.ForwardedRef<HTMLInputElement>}
              style={{ paddingLeft: `${paddingLeft}px` }}
              type={inputType}
              className={cn(
                "w-full rounded-xl border border-main bg-darkest px-4 py-3 outline-none placeholder:text-font-disabled",
                placeholderClassName,
                rightElement && "pr-11",
                inputClassName,
                isFocused && "border-brand-dark bg-brand-opacity-3",
                hasError && "border-font-accents",
                isFocused && hasError && "border-brand-dark",
                isLengthExceeded && "border-font-error",
              )}
              placeholder={translateText(placeholder)}
              maxLength={maxLength}
              value={value}
              onChange={handleValueChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          )}

          {isModal && (
            <div
              ref={ref as React.Ref<HTMLDivElement>}
              onClick={toggleIsOpen}
              style={{ paddingLeft: `${paddingLeft}px` }}
              className={cn(
                "relative flex cursor-pointer items-center justify-between rounded-xl border border-main bg-darkest px-4 py-3 body-4",
                hasError && "border-font-accents",
                inputBoxClassName,
              )}
            >
              <span className={cn(!value && "text-font-disabled")}>
                {value || translateText(placeholder)}
              </span>
              {renderRightIcon()}
              {isOpen && modalComponents}
            </div>
          )}

          {!isModal && !isTextarea && maxLength && (
            <CharacterCounter
              currentLength={currentLength}
              maxLength={maxLength}
              className={counterClassName}
            />
          )}

          {rightElement && (
            <div className="absolute right-4 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>

        {shouldRenderBottomMessage && hasErrorMessage ? (
          <ErrorMessage error={error} />
        ) : shouldRenderBottomMessage && !hasError && !isLengthExceeded ? (
          <HelperMessage message={helperMessage} type={helperMessageType} />
        ) : null}
      </div>
    </div>
  );
});

SmartInput.displayName = "SmartInput";

export default React.memo(SmartInput);
