"use client";

import React, { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AuthFormValues } from "@/type/auth";
import AuthInput from "@/components/auth/AuthInput";
import { NICKNAME_REGEX } from "@/lib/regex";
import { useDebounce } from "@/hooks/useDebounce";
import { useCheckNicknameQuery } from "@/api/auth/checkNickname";

const NicknameField = () => {
  const {
    register,
    control,
    formState: { errors },
    setError,
    clearErrors,
  } = useFormContext<AuthFormValues>();

  const nickname = useWatch({ control, name: "nickname" });
  const debouncedNickname = useDebounce({ value: nickname, delay: 500 });

  const { data: checkData } = useCheckNicknameQuery(debouncedNickname, {
    enabled: !!debouncedNickname && !errors.nickname,
  });

  useEffect(() => {
    if (checkData?.available === false) {
      setError("nickname", {
        type: "manual",
        message: "이미 사용중인 닉네임입니다.",
      });
    } else if (checkData?.available === true) {
      clearErrors("nickname");
    }
  }, [checkData, setError, clearErrors]);

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
      error={errors.nickname?.message}
      placeholder="2 ~ 15자 이내, 특수문자 불가"
    />
  );
};

export default React.memo(NicknameField);
