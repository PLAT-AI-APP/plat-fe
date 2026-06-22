"use client";

import React from "react";
import { FieldError } from "react-hook-form";
import { useTranslateText } from "@/hooks/useTranslateText";
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
  const translateText = useTranslateText();

  if (!label) return null;

  return (
    <div className="flex flex-col gap-1">
      <div className={cn("flex items-center gap-1", labelFontSize)}>
        <span>{translateText(label)}</span>
        {required && <span className="text-font-accents">*</span>}
        {showOptionalLabel && !required && (
          <span className="text-font-disabled">
            {translateText("common.optional")}
          </span>
        )}
      </div>
      {description && (
        <p className={cn("text-font-2", descFontSize)}>
          {translateText(description)}
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
  className,
}: {
  currentLength: number;
  maxLength?: number;
  isTextarea?: boolean;
  isError?: boolean;
  className?: string;
}) => {
  if (!maxLength) return null;

  return (
    <div
      className={cn(
        "absolute right-4 body-6 text-font-2 pointer-events-none",
        isTextarea ? "bottom-3" : "top-1/2 -translate-y-1/2",
        isError && "text-font-error",
        className,
      )}
    >
      {currentLength}/{maxLength}
    </div>
  );
};

export const ErrorMessage = ({ error }: { error?: FieldError | string }) => {
  const translateText = useTranslateText();

  if (!error) return null;

  const message = typeof error === "string" ? error : error?.message;
  if (!message) return null;

  return (
    <span className={cn("pt-2 body-6 block", "text-font-error")}>
      {translateText(message)}
    </span>
  );
};

export const HelperMessage = ({
  message,
}: {
  message?: string;
  type?: "success" | "default";
}) => {
  const translateText = useTranslateText();

  if (!message) return null;

  return <span className="pt-2 body-6 block text-font-2">{translateText(message)}</span>;
};
