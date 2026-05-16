import React from "react";
import { FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";

export const LabelSection = ({ 
  label, 
  required, 
  description, 
  fontSize 
}: { 
  label?: string; 
  required?: boolean; 
  description?: string; 
  fontSize: "md" | "lg" 
}) => {
  if (!label) return null;
  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          "flex items-center gap-1 font-medium",
          fontSize === "md" && "text-sm",
          fontSize === "lg" && "text-[16px]",
        )}
      >
        <span>{label}</span>
        {required && <span className="text-font-accents">*</span>}
      </div>
      {description && (
        <p
          className={cn(
            "text-xs text-font-2",
            fontSize === "md" && "text-xs",
            fontSize === "lg" && "text-sm",
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
  isTextarea 
}: { 
  currentLength: number; 
  maxLength?: number; 
  isTextarea?: boolean 
}) => {
  if (!maxLength) return null;
  return (
    <div
      className={cn(
        "absolute right-4 text-xs text-font-2 pointer-events-none",
        isTextarea ? "bottom-3" : "top-1/2 -translate-y-1/2",
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
    <span className="pt-2 pl-2 text-font-accents text-xs block">
      {message}
    </span>
  );
};
