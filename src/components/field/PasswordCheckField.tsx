"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
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
  const isShowConfirm = useTogglePassword();

  return (
    <AuthInput
      label="비밀번호 확인"
      type={isShowConfirm.inputType}
      placeholder="비밀번호를 다시 입력해주세요"
      {...register("passwordCheck", {
        required: "비밀번호 확인이 필요합니다.",
        validate: (value) =>
          value === password || "비밀번호가 일치하지 않습니다.",
        onChange: async () => {
          await trigger("passwordCheck");
        },
      })}
      error={errors.passwordCheck?.message as string}
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
