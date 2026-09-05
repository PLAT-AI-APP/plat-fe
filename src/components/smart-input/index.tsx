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
    descFontSize = "body-6",
    onFocus,
    onBlur,
    ...rest
  } = props;

  const isTextarea = type === "textarea";
  const isModal = type === "modal";
  const isInput = type === "input" || !type;
  const translateText = useTranslateText();
  const [isFocused, setIsFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState(() => String(value ?? ""));
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

  // border-*는 전부 같은 특이도(0,1,0)의 일반 유틸리티라, 여러 개를 동시에 넣으면
  // JS의 조건(우선순위)이 아니라 Tailwind가 생성한 스타일시트 안의 등장 순서로 승패가
  // 갈린다(예: border-main이 항상 마지막에 생성돼 border-font-accents/border-brand-dark/
  // border-font-error보다 나중에 나오면, 에러/포커스 상태 색이 있어도 늘 border-main한테
  // 밀려 안 보인다). 그래서 상태별로 정확히 하나의 색 클래스만 고르도록 우선순위를 JS에서
  // 직접 계산한다.
  const borderColorClassName = isLengthExceeded
    ? "border-font-error"
    : isFocused && hasError
      ? "border-brand-dark"
      : hasError
        ? "border-font-accents"
        : isFocused
          ? "field-focus!"
          : "border-main";

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

      <div className="group body-5">
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
                "relative flex rounded-xl bg-darkest px-4 pb-7 pt-3 transition-colors",
                isBorder && "border",
                isBorder && borderColorClassName,
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
                  // 포커스 표시는 감싸는 div의 border(위)가 담당하므로, textarea 자체의 포커스 링은 겹치지 않게 끕니다.
                  "focus-ring-none custom-scrollbar w-full resize-none overflow-y-auto bg-transparent outline-none placeholder:text-font-disabled disabled:cursor-not-allowed disabled:text-font-disabled",
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
                // 포커스 시 이 border 색이 바로 포커스 표시라, 브라우저 기본 포커스 링은 겹치지 않게 끕니다.
                "focus-ring-none w-full rounded-xl border bg-darkest px-4 py-3 outline-none transition-colors placeholder:text-font-disabled disabled:cursor-not-allowed disabled:text-font-disabled",
                borderColorClassName,
                placeholderClassName,
                rightElement && "pr-11",
                inputClassName,
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
                "relative flex cursor-pointer items-center justify-between rounded-xl border bg-darkest px-4 py-3 body-5",
                hasError ? "border-font-accents" : "border-main",
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
