import React from "react";
import { cn } from "@/lib/utils";
import { Date } from "@/icons";

interface BirthDateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const BirthDateInput = React.forwardRef<
  HTMLInputElement,
  BirthDateInputProps
>(({ className, error, onChange, ...rest }, ref) => {
  // 로직 및 핸들러: 가독성을 위해 상단에 배치
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 숫자만 추출 (최대 8자리)
    const digits = e.target.value.replace(/\D/g, "").slice(0, 8);

    let formatted = "";
    // YYYY-MM-DD 마스킹 로직
    if (digits.length <= 4) {
      formatted = digits;
    } else if (digits.length <= 6) {
      formatted = `${digits.slice(0, 4)}-${digits.slice(4)}`;
    } else {
      formatted = `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
    }

    // 변경된 값을 input 엘리먼트에 직접 주입
    e.target.value = formatted;

    // react-hook-form의 onChange를 호출하여 상태 업데이트
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <section
      id="birthdate-input-container"
      className={cn("flex flex-col flex-1 gap-2 w-full", className)}
    >
      <header className="flex items-center gap-1 font-medium text-sm">
        <span>생년월일</span>
        <span className="text-font-accents" aria-hidden="true">
          *
        </span>
      </header>

      <div className="relative">
        <Date className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-font-2" />

        <input
          {...rest}
          ref={ref}
          type="text"
          onChange={handleValueChange} // 마스킹 로직이 포함된 핸들러
          maxLength={10}
          placeholder="YYYY-MM-DD"
          className={cn(
            "w-full px-4 py-3 pl-12 text-sm bg-bg-darkest border border-border-main rounded-xl outline-none placeholder:text-font-disabled text-white",
            error && "border-font-accents",
            className,
          )}
        />
      </div>
    </section>
  );
});

BirthDateInput.displayName = "BirthDateInput";
