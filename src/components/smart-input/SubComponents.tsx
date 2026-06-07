import React from "react";
import { FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";

export const LabelSection = ({
  label,
  required,
  showOptionalLabel,
  description,
  labelFontSize,
  descFontSize,
}: {
  label?: string;
  required?: boolean;
  showOptionalLabel?: boolean;
  description?: string;
  labelFontSize?: "title-3" | "title-5";
  descFontSize?: "body-4" | "body-5" | "body-6";
}) => {
  if (!label) return null;
  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          "flex items-center gap-1",
          labelFontSize, // 넘겨받은 클래스명을 그대로 적용 (예: "title-5" 또는 "title-3")
        )}
      >
        <span>{label}</span>
        {required && <span className="text-font-accents">*</span>}
        {showOptionalLabel && !required && (
          <span className="text-font-disabled">(선택)</span>
        )}
      </div>
      {description && (
        <p
          className={cn(
            "text-font-2",
            descFontSize, // 넘겨받은 클래스명을 그대로 적용 (예: "body-5", "body-4" 등)
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export const CharacterCounter = ({
  currentLength,
  maxLength,
  isTextarea,
  isError,
}: {
  currentLength: number;
  maxLength?: number;
  isTextarea?: boolean;
  isError?: boolean;
}) => {
  if (!maxLength) return null;
  return (
    <div
      className={cn(
        "absolute right-4 body-6 text-font-2 pointer-events-none",
        isTextarea ? "bottom-3" : "top-1/2 -translate-y-1/2",
        isError && "text-font-error",
      )}
    >
      {currentLength}/{maxLength}
    </div>
  );
};

export const ErrorMessage = ({ error }: { error?: FieldError | string }) => {
  if (!error) return null;
  const message = typeof error === "string" ? error : error?.message;
  if (!message) return null;
  return (
    <span className={cn("pt-2 body-6 block", "text-font-error")}>
      {message}
    </span>
  );
};

export const HelperMessage = ({
  message,
  type = "default",
}: {
  message?: string;
  type?: "success" | "default";
}) => {
  if (!message) return null;

  return (
    <span
      className={cn("pt-2 body-6 block", type === "success" && "text-font-2")}
    >
      {message}
    </span>
  );
};
