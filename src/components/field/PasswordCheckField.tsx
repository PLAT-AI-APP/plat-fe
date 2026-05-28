"use client";

import React, { useEffect } from "react";
import { FieldError, useFormContext, useWatch } from "react-hook-form";
import AuthInput from "@/components/auth/AuthInput";
import { PasswordToggle } from "@/components/auth/PasswordToggle";
import { useTogglePassword } from "@/hooks/useTogglePassword";

const PasswordCheckField = () => {
  const {
    register,
    control,
    formState: { errors },
    trigger,
  } = useFormContext();

  const password = useWatch({ control, name: "password" });
  const passwordCheck = useWatch({ control, name: "passwordCheck" });

  const isShowConfirm = useTogglePassword();

  useEffect(() => {
    if (passwordCheck) {
      trigger("passwordCheck");
    }
  }, [password, passwordCheck, trigger]);

  return (
    <AuthInput
      label="비밀번호 확인"
      type={isShowConfirm.inputType}
      placeholder="비밀번호를 다시 입력해주세요"
      {...register("passwordCheck")}
      error={errors.passwordCheck as FieldError}
      rightElement={
        <PasswordToggle
          isVisible={isShowConfirm.isVisible}
          onToggle={isShowConfirm.toggle}
        />
      }
    />
  );
};

export default React.memo(PasswordCheckField);
