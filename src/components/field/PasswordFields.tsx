"use client";

import { useTogglePassword } from "@/hooks/useTogglePassword";
import React, { useEffect } from "react";
import { FieldError, useFormContext, useWatch } from "react-hook-form";
import SmartInput from "../smart-input";
import { PasswordToggle } from "../auth/PasswordToggle";

const PasswordFields = () => {
  const {
    register,
    control,
    formState: { errors },
    trigger,
  } = useFormContext();

  const password = useWatch({ control, name: "password" });

  const isShowPw = useTogglePassword();
  const isShowConfirm = useTogglePassword();

  const passwordCheck = useWatch({ control, name: "passwordCheck" });

  useEffect(() => {
    if (passwordCheck) {
      trigger("passwordCheck");
    }
  }, [password, passwordCheck, trigger]);

  return (
    <div className="flex flex-col gap-5.25">
      <SmartInput
        label="비밀번호"
        inputType={isShowPw.inputType}
        labelFontSize="title-5"
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

      <SmartInput
        label="비밀번호 확인"
        inputType={isShowConfirm.inputType}
        labelFontSize="title-5"
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
    </div>
  );
};

export default React.memo(PasswordFields);
