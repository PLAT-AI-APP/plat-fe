"use client";

import React from "react";
import { FieldError, useFormContext } from "react-hook-form";
import { PasswordToggle } from "@/components/auth/PasswordToggle";
import SmartInput from "@/components/smart-input";
import { FIELD_HELPER_MESSAGES } from "@/constants/fieldMessages";
import { useTogglePassword } from "@/hooks/useTogglePassword";

interface PasswordFieldProps {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  showHelperMessage?: boolean;
  hideErrorMessage?: boolean;
}

const PasswordField = ({
  id,
  name = "password",
  label = "비밀번호",
  placeholder = "8자 이상 입력해주세요",
  showHelperMessage = true,
  hideErrorMessage = false,
}: PasswordFieldProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const isShowPw = useTogglePassword();
  const passwordError = errors[name] as FieldError | undefined;
  // 로그인처럼 에러 문구가 필요 없는 화면에서는 에러 상태만 넘겨 보더 스타일만 사용합니다.
  const displayError = hideErrorMessage
    ? passwordError
      ? ""
      : undefined
    : passwordError;

  return (
    <SmartInput
      id={id}
      label={label}
      inputType={isShowPw.inputType}
      labelFontSize="title-5"
      placeholder={placeholder}
      {...register(name)}
      error={displayError}
      helperMessage={
        showHelperMessage ? FIELD_HELPER_MESSAGES.password : undefined
      }
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
