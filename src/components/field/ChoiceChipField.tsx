"use client";

import React, { useId } from "react";
import { FieldError } from "react-hook-form";
import { ChipButton } from "@/components/ui/Button";
import { ErrorMessage, LabelSection } from "@/components/smart-input/SubComponents";

export interface ChoiceChipOption<T extends string> {
  value: T;
  label: string;
}

interface ChoiceChipFieldProps<T extends string> {
  label: string;
  options: ReadonlyArray<ChoiceChipOption<T>>;
  /** 아무것도 고르지 않았으면 빈 문자열 */
  value: T | "";
  onChange: (value: T) => void;
  required?: boolean;
  error?: FieldError | string;
  /**
   * 첫 칩에 연결할 ref. react-hook-form Controller 의 field.ref 를 넘기면
   * 검증 실패 시 setFocus 가 이 필드로 포커스를 옮길 수 있다.
   */
  firstOptionRef?: React.Ref<HTMLButtonElement>;
}

/**
 * 여러 칩 중 하나를 고르는 필드. SmartInput 과 같은 라벨·에러 표기를 쓴다.
 *
 * GenderField 처럼 값이 두 개로 고정된 곳은 가로로 꽉 채운 버튼이 낫지만, 선택지가 늘면
 * 한 줄에 다 들어가지 않는다. 그래서 줄바꿈되는 칩으로 둔다.
 */
const ChoiceChipField = <T extends string>({
  label,
  options,
  value,
  onChange,
  required,
  error,
  firstOptionRef,
}: ChoiceChipFieldProps<T>) => {
  const labelId = useId();

  return (
    <div className="flex flex-col gap-2">
      <div id={labelId}>
        <LabelSection label={label} required={required} labelFontSize="title-3" />
      </div>
      <div role="group" aria-labelledby={labelId} className="flex flex-wrap gap-2">
        {options.map((option, index) => (
          <ChipButton
            key={option.value}
            ref={index === 0 ? firstOptionRef : undefined}
            selected={value === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </ChipButton>
        ))}
      </div>
      <ErrorMessage error={error} />
    </div>
  );
};

export default ChoiceChipField;
