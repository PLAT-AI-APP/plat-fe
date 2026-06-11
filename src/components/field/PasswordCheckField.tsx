"use client";

import React, { useEffect } from "react";
import { FieldError, useFormContext, useWatch } from "react-hook-form";
import { PasswordToggle } from "@/components/auth/PasswordToggle";
import SmartInput from "@/components/smart-input";
import { FIELD_HELPER_MESSAGES } from "@/constants/fieldMessages";
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
    <SmartInput
      label="비밀번호 확인"
      inputType={isShowConfirm.inputType}
      labelFontSize="title-5"
      placeholder="비밀번호를 다시 입력해주세요"
      {...register("passwordCheck")}
      error={errors.passwordCheck as FieldError}
      helperMessage={FIELD_HELPER_MESSAGES.passwordCheck}
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
