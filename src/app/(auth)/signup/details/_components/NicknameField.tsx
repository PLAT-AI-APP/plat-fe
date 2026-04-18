"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import { UserDetailFormValues } from "@/type/auth";
import { NICKNAME_REGEX } from "@/lib/regex";
import AuthInput from "@/components/auth/AuthInput";

interface NicknameFieldProps {
  debouncedNickname: string;
  isAvailable: boolean | undefined;
}

const NicknameField = ({ debouncedNickname, isAvailable }: NicknameFieldProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<UserDetailFormValues>();

  return (
    <AuthInput
      id="input-nickname"
      label="닉네임"
      {...register("nickname", {
        required: "닉네임을 입력해주세요.",
        maxLength: { value: 15, message: "최대 15자까지 가능합니다." },
        minLength: { value: 2, message: "최소 2자 이상이어야 합니다." },
        pattern: {
          value: NICKNAME_REGEX,
          message: "특수문자는 사용할 수 없습니다.",
        },
      })}
      error={
        errors.nickname?.message ||
        (debouncedNickname && isAvailable === false
          ? "이미 사용중인 닉네임입니다."
          : undefined)
      }
      placeholder="2 ~ 15자 이내, 특수문자 불가"
    />
  );
};

export default NicknameField;
