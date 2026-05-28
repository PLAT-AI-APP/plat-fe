"use client";

import React from "react";
import { FieldError, useFormContext } from "react-hook-form";
import AuthInput from "@/components/auth/AuthInput";
import { PasswordToggle } from "@/components/auth/PasswordToggle";
import { useTogglePassword } from "@/hooks/useTogglePassword";

const PasswordField = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const isShowPw = useTogglePassword();

  return (
    <AuthInput
      label="비밀번호"
      type={isShowPw.inputType}
      placeholder="8자 이상 입력해주세요"
      {...register("password")}
      error={errors.password as FieldError}
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
