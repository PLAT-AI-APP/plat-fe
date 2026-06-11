"use client";

import React from "react";
import { FieldError, useFormContext } from "react-hook-form";
import { PasswordToggle } from "@/components/auth/PasswordToggle";
import SmartInput from "@/components/smart-input";
import { FIELD_HELPER_MESSAGES } from "@/constants/fieldMessages";
import { useTogglePassword } from "@/hooks/useTogglePassword";

const PasswordField = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const isShowPw = useTogglePassword();

  return (
    <SmartInput
      label="비밀번호"
      inputType={isShowPw.inputType}
      labelFontSize="title-5"
      placeholder="8자 이상 입력해주세요"
      {...register("password")}
      error={errors.password as FieldError}
      helperMessage={FIELD_HELPER_MESSAGES.password}
      rightElement={
        <PasswordToggle
          isVisible={isShowPw.isVisible}
          onToggle={isShowPw.toggle}
        />
      }
    />
  );
};

export default React.memo(PasswordField);
