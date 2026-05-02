"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import SmartInput from "../SmartInput";
import { NICKNAME_REGEX } from "@/lib/regex";
import { useDebounce } from "@/hooks/useDebounce";
import { useCheckNicknameQuery } from "@/api/auth/checkNickname";
import { useUserStore } from "@/store/useUserStore";

const NicknameField = () => {
  const user = useUserStore((state) => state.user);
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const nicknameValue = useWatch({ control, name: "nickname" });
  const debouncedNickname = useDebounce({ value: nicknameValue, delay: 500 });

  const isNicknameCheckEnabled =
    !!debouncedNickname &&
    debouncedNickname.trim().length > 0 &&
    debouncedNickname !== user?.nickname;

  const { data: nicknameData, isFetching } = useCheckNicknameQuery(
    debouncedNickname,
    {
      enabled: isNicknameCheckEnabled,
      retry: false,
    },
  );

  const error = errors["nickname"];

  return (
    <SmartInput
      {...register("nickname", {
        required: "닉네임을 입력해주세요.",
        maxLength: { value: 20, message: "최대 20자까지 가능합니다." },
        pattern: {
          value: NICKNAME_REGEX,
          message: "특수문자는 사용할 수 없습니다.",
        },
      })}
      label="닉네임"
      required
      value={nicknameValue}
      placeholder="1 ~ 20자 이내, 특수문자 불가"
      maxLength={20}
      error={
        (error?.message as string) ||
        (!isFetching && nicknameData?.available === false
          ? "이미 사용중인 닉네임입니다."
          : undefined)
      }
    />
  );
};

export default NicknameField;
