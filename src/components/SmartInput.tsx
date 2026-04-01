import { cn } from "@/lib/utils";
import React from "react";

interface SmartInputProps {
  label?: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  maxLength: number;
  required?: boolean;
  type?: "input" | "textarea";
  inputClassName?: string;
  isBorder?: boolean;
  minLine?: number; // 기존 rows 역할 (기본 높이)
  maxLine?: number; // 입력 제한 줄 수
}

const SmartInput = ({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  required = false,
  type = "input",
  inputClassName,
  isBorder = true,
  maxLine,
  minLine,
}: SmartInputProps) => {
  if (!onChange) return null;

  const isTextarea = type === "textarea";

  // 줄 수 제한 로직
  const handleValueChange = (text: string) => {
    // const nextValue = e.target.value;

    // textarea일 때만 줄 수 체크
    if (isTextarea && maxLine) {
      const lineCount = text.split("\n").length;
      if (lineCount > maxLine) return; // 제한 줄 수 초과 시 업데이트 안 함
    }

    onChange(text);
  };
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Label 영역 */}
      {label && (
        <div className="flex items-center gap-1 font-semibold">
          <span>{label}</span>
          {required && <span className="text-font-accents">*</span>}
        </div>
      )}

      {/* Input/Textarea 영역 */}
      <div className="relative group text-sm">
        {isTextarea ? (
          <div
            className={cn(
              "flex rounded-xl bg-bg-darkest",
              isBorder && "border border-border-main",
            )}
          >
            <textarea
              className={cn(
                "w-full h-fit px-4 py-3 pb-7.25 bg-transparent outline-none resize-none placeholder:text-font-disabled",
                inputClassName,
              )}
              rows={minLine}
              placeholder={placeholder}
              value={value}
              onChange={(e) => handleValueChange(e.target.value)}
              maxLength={maxLength}
            />
          </div>
        ) : (
          <input
            type="text"
            className={cn(
              "w-full p-3 bg-bg-darkest border border-border-main rounded-xl outline-none placeholder:text-font-disabled",
              inputClassName,
            )}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            maxLength={maxLength}
          />
        )}

        {/* 글자 수 제한 표시 */}
        <div
          className={cn(
            "absolute right-4 text-xs text-font-2 pointer-events-none",
            isTextarea ? "bottom-3" : "top-1/2 -translate-y-1/2",
          )}
        >
          {value.length}/{maxLength}
        </div>
      </div>
    </div>
  );
};

export default SmartInput;
