"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AuthFormValues } from "@/type/auth";
import AuthInput from "@/components/auth/AuthInput";
import { PasswordToggle } from "@/components/auth/PasswordToggle";
import { useTogglePassword } from "@/hooks/useTogglePassword";
import { PASSWORD_REGEX } from "@/lib/regex";

const PasswordFields = () => {
  const {
    register,
    control,
    formState: { errors },
    trigger,
  } = useFormContext<AuthFormValues>();

  const password = useWatch({ control, name: "password" });

  const isShowPw = useTogglePassword();
  const isShowConfirm = useTogglePassword();

  return (
    <div className="flex flex-col gap-5.25">
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
        error={errors.password?.message}
        rightElement={
          <PasswordToggle
            isVisible={isShowPw.isVisible}
            onToggle={isShowPw.toggle}
          />
        }
      />

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
        error={errors.passwordCheck?.message}
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
