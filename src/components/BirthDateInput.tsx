"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Date as DateIcon } from "@/icons";
import Calendar from "react-calendar";
import dayjs from "dayjs";
import { useFormContext } from "react-hook-form";
import { UserDetailFormValues } from "@/type/auth";

interface BirthDateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  handleBirthDate?: (date: string) => void;
  isEditMode?: boolean;
}

export const BirthDateInput = React.forwardRef<
  HTMLInputElement,
  BirthDateInputProps
>(({ className, error, onChange, isEditMode = false, ...rest }, ref) => {
  const { setValue, watch } = useFormContext<UserDetailFormValues>();
  const birthDate = watch("birthDate");

  const [showCalendar, setShowCalendar] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [slideClassName, setSlideClassName] = useState("");

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 8);
    let formatted = "";
    if (digits.length <= 4) formatted = digits;
    else if (digits.length <= 6)
      formatted = `${digits.slice(0, 4)}-${digits.slice(4)}`;
    else
      formatted = `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;

    // 값 업데이트
    e.target.value = formatted;
    setValue("birthDate", formatted);

    // 값이 10자리가 완료되었을 때만 캘린더 뷰 이동
    if (formatted.length === 10) {
      const parsedDate = dayjs(formatted);
      if (parsedDate.isValid()) {
        setViewDate(parsedDate.toDate());
      }
    }

    if (onChange) onChange(e);
  };

  // 날짜 선택 시 로직
  const handleDateSelect = (date: Date) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    setValue("birthDate", formattedDate);
    setShowCalendar(false);
  };

  // 이전달/다음달 클릭 시 애니메이션 클래스 제어
  const handleActiveStartDateChange = ({ activeStartDate, action }: any) => {
    // 1. 방향 설정
    const nextClass = action === "next" ? "slide-next" : "slide-prev";
    setSlideClassName(nextClass);

    // 2. 애니메이션 초기화 (0.3초 뒤 클래스 제거하여 다음 클릭 대비)
    setTimeout(() => setSlideClassName(""), 300);
    setViewDate(activeStartDate);
  };

  return (
    <section
      id="birthdate-input-container"
      className={cn("flex flex-col flex-1 gap-2 w-full", className)}
    >
      <header className="flex items-center gap-1 font-medium text-sm text-white">
        <span>생년월일</span>
        {/* <span className="text-font-accents">*</span> */}
      </header>

      <div className="relative">
        <DateIcon
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-font-2 cursor-pointer z-10 hover:text-white transition-colors"
          onClick={() => setShowCalendar(!showCalendar)}
        />

        <input
          {...rest}
          ref={ref}
          type="text"
          value={birthDate}
          onChange={handleValueChange}
          maxLength={10}
          placeholder="YYYY-MM-DD"
          className={cn(
            "w-full px-4 py-3 pl-12 text-sm bg-bg-darkest border border-border-main rounded-xl outline-none placeholder:text-font-disabled text-white",
            error && "border-font-accents",
          )}
        />

        {isEditMode && showCalendar && (
          <>
            {/* 딤드 배경 */}
            <div
              className="fixed inset-0 bg-black/50 z-[9998] backdrop-blur-[2px]"
              onClick={() => setShowCalendar(false)}
            />

            {/* 캘린더 모달 */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999]">
              <Calendar
                className={slideClassName} // 애니메이션 클래스 주입
                onActiveStartDateChange={handleActiveStartDateChange}
                activeStartDate={viewDate} // input에 의해 업데이트된 viewDate 반영                onChange={(val) => handleDateSelect(val as Date)}
                value={
                  birthDate && dayjs(birthDate as string).isValid()
                    ? dayjs(birthDate as string).toDate()
                    : new Date()
                }
                onChange={(value) => handleDateSelect(value as Date)}
                showNeighboringMonth={true}
                formatMonth={(locale, date) => dayjs(date).format("M")}
                formatYear={(locale, date) => dayjs(date).format("YYYY")}
                navigationLabel={({ date }) => dayjs(date).format("YYYY. MM")}
                locale="ko-KR"
                formatDay={(_, date) => dayjs(date).format("D")}
                calendarType="gregory"
                next2Label={null}
                prev2Label={null}
                prevLabel={<ArrowLeft className="w-4 h-4" />}
                nextLabel={<ArrowRight className="w-4 h-4" />}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
});

BirthDateInput.displayName = "BirthDateInput";
