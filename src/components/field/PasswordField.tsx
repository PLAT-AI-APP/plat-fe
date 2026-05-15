"use client";

import React from "react";
import { FieldError, useFormContext } from "react-hook-form";
import AuthInput from "@/components/auth/AuthInput";
import { PasswordToggle } from "@/components/auth/PasswordToggle";
import { useTogglePassword } from "@/hooks/useTogglePassword";
import { PASSWORD_REGEX } from "@/lib/regex";

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
      {...register("password", {
        required: "비밀번호를 입력해주세요.",
        minLength: { value: 8, message: "최소 8자 이상이어야 합니다." },
        pattern: {
          value: PASSWORD_REGEX,
          message: "특수문자를 포함하여 8자 이상 입력해주세요.",
        },
      })}
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
