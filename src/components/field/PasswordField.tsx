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
}

const PasswordField = ({
  id,
  name = "password",
  label = "비밀번호",
  placeholder = "8자 이상 입력해주세요",
  showHelperMessage = true,
}: PasswordFieldProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const isShowPw = useTogglePassword();

  return (
    <SmartInput
      id={id}
      label={label}
      inputType={isShowPw.inputType}
      labelFontSize="title-5"
      placeholder={placeholder}
      {...register(name)}
      error={errors[name] as FieldError}
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
