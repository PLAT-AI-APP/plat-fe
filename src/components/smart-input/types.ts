import React from "react";
import { FieldError } from "react-hook-form";

export interface SmartInputProps extends React.InputHTMLAttributes<
  HTMLInputElement | HTMLTextAreaElement
> {
  label?: string;
  showOptionalLabel?: boolean;
  maxLength?: number;
  required?: boolean;
  type?: "input" | "textarea" | "modal";
  inputType?: React.HTMLInputTypeAttribute;
  isOpen?: boolean;
  inputClassName?: string;
  inputBoxClassName?: string;
  placeholderClassName?: string;
  counterClassName?: string;
  isBorder?: boolean;
  minLine?: number;
  maxLine?: number;
  description?: string;
  modalComponents?: React.ReactNode;
  toggleIsOpen?: () => void;
  /**
   * type="modal"일 때 오른쪽 화살표 대신 보여줄 버튼 라벨(예: "변경").
   * 값을 이미 골라서 보여주는 필드처럼, 펼침/접힘보다 "바꾸기" 동작이
   * 더 명확한 경우에 씁니다. 주지 않으면 기존 화살표 아이콘 그대로입니다.
   */
  modalActionLabel?: string;
  error?: FieldError | string;
  helperMessage?: string;
  helperMessageType?: "success" | "default";
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  /** type="input" 에 값이 있으면 동그라미 X 지우기 버튼을 띄운다(기본 켬). */
  clearable?: boolean;
  /** type="input" 에서 Enter 를 눌렀을 때 실행할 동작(옆 버튼과 같은 동작을 건다). */
  onEnter?: () => void;
  // fontSize?: "md" | "lg";
  labelFontSize?: "title-3" | "title-5";
  descFontSize?: "body-5" | "body-6" | "body-7";
}
