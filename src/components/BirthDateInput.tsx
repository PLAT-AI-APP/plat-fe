"use client";

import React, { useState } from "react";
import Calendar, { OnArgs } from "react-calendar";
import { ArrowLeft, ArrowRight, Date as DateIcon } from "@/icons";
import {
  FIELD_ERROR_MESSAGES,
  FIELD_FEEDBACK_MESSAGES,
  FIELD_HELPER_MESSAGES,
} from "@/constants/fieldMessages";
import { useTranslateText } from "@/hooks/useTranslateText";
import dayjs from "@/lib/dayjs";
import { cn } from "@/lib/utils";
import { ProfileEditFormType } from "@/schema/profile.schema";
import { useFormContext } from "react-hook-form";

interface BirthDateInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  handleBirthDate?: (date: string) => void;
  isEditMode?: boolean;
}

const isValidPastOrTodayDate = (value?: string) => {
  if (!value) return false;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const isValidDate =
    date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day);

  if (!isValidDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  return date.getTime() <= today.getTime();
};

export const BirthDateInput = React.forwardRef<
  HTMLInputElement,
  BirthDateInputProps
>(({ className, error, onChange, isEditMode = false, ...rest }, ref) => {
  const translateText = useTranslateText();
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ProfileEditFormType>();
  const birth = watch("birth");
  const birthError = errors.birth;
  const birthErrorMessage = birthError?.message;
  const shouldHideBirthErrorMessage =
    birthErrorMessage === FIELD_ERROR_MESSAGES.birthInvalid ||
    birthErrorMessage === "Invalid input";
  const hasError = error || Boolean(birthError);
  const isValidBirth = isValidPastOrTodayDate(birth);
  const isBirthTyping = Boolean(birth) && !isValidBirth;

  const [showCalendar, setShowCalendar] = useState(false);
  const [viewDate, setViewDate] = useState<Date | null>(new Date());
  const [slideClassName, setSlideClassName] = useState("");

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 8);
    let formatted = "";
    if (digits.length <= 4) formatted = digits;
    else if (digits.length <= 6)
      formatted = `${digits.slice(0, 4)}-${digits.slice(4)}`;
    else
      formatted = `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;

    e.target.value = formatted;
    setValue("birth", formatted, { shouldDirty: true, shouldValidate: true });

    if (formatted.length === 10) {
      const parsedDate = dayjs(formatted);
      if (parsedDate.isValid()) {
        setViewDate(parsedDate.toDate());
      }
    }

    onChange?.(e);
  };

  const handleDateSelect = (date: Date) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    setValue("birth", formattedDate, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setShowCalendar(false);
  };

  const handleActiveStartDateChange = ({ activeStartDate, action }: OnArgs) => {
    const nextClass = action === "next" ? "slide-next" : "slide-prev";
    setSlideClassName(nextClass);

    setTimeout(() => setSlideClassName(""), 300);
    setViewDate(activeStartDate);
  };

  return (
    <section
      id="birthdate-input-container"
      className={cn("flex w-full flex-1 flex-col", className)}
    >
      <header className="title-5 mb-2 flex items-center gap-1 text-white">
        <span>{translateText("auth.fields.birthLabel")}</span>
      </header>

      <div className="relative">
        <DateIcon
          className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 cursor-pointer text-font-2 transition-colors hover:text-white"
          onClick={() => setShowCalendar(!showCalendar)}
        />

        <input
          {...rest}
          ref={ref}
          type="text"
          value={birth}
          onChange={handleValueChange}
          maxLength={10}
          placeholder="YYYY-MM-DD"
          className={cn(
            "w-full rounded-xl border border-border-main bg-bg-darkest px-4 py-3 pl-12 text-sm text-white outline-none placeholder:text-font-disabled",
            hasError && "border-font-accents",
          )}
        />

        {isEditMode && showCalendar && (
          <>
            <div
              className="fixed inset-0 z-9998 bg-black/50 backdrop-blur-[2px]"
              onClick={() => setShowCalendar(false)}
            />

            <div className="fixed left-1/2 top-1/2 z-9999 -translate-x-1/2 -translate-y-1/2">
              <Calendar
                className={slideClassName}
                onActiveStartDateChange={handleActiveStartDateChange}
                activeStartDate={viewDate || new Date()}
                value={
                  birth && dayjs(birth as string).isValid()
                    ? dayjs(birth as string).toDate()
                    : new Date()
                }
                onChange={(value) => handleDateSelect(value as Date)}
                showNeighboringMonth
                formatMonth={(_, date) => dayjs(date).format("M")}
                formatYear={(_, date) => dayjs(date).format("YYYY")}
                navigationLabel={({ date }) => dayjs(date).format("YYYY. MM")}
                locale="ko-KR"
                formatDay={(_, date) => dayjs(date).format("D")}
                calendarType="gregory"
                next2Label={null}
                prev2Label={null}
                prevLabel={<ArrowLeft className="h-4 w-4" />}
                nextLabel={<ArrowRight className="h-4 w-4" />}
              />
            </div>
          </>
        )}
      </div>

      {birthErrorMessage && !shouldHideBirthErrorMessage ? (
        <span className="body-6 block pt-2 text-font-error">
          {translateText(birthErrorMessage)}
        </span>
      ) : birthError ? null : isValidBirth || isBirthTyping ? (
        <span className="body-6 block pt-2 text-font-2">
          {translateText(
            isValidBirth
              ? FIELD_FEEDBACK_MESSAGES.birthValid
              : FIELD_HELPER_MESSAGES.birth,
          )}
        </span>
      ) : null}
    </section>
  );
});

BirthDateInput.displayName = "BirthDateInput";
