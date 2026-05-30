import React from "react";
import { FieldError } from "react-hook-form";

export interface SmartInputProps extends React.InputHTMLAttributes<
  HTMLInputElement | HTMLTextAreaElement
> {
  label?: string;
  maxLength?: number;
  required?: boolean;
  type?: "input" | "textarea" | "modal";
  inputType?: React.HTMLInputTypeAttribute;
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
  helperMessage?: string;
  helperMessageType?: "success" | "default";
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  // fontSize?: "md" | "lg";
  labelFontSize?: "title-3" | "title-5";
  descFontSize?: "body-4" | "body-5" | "body-6";
}
