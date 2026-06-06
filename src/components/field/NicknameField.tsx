"use client";

import React, { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import SmartInput from "@/components/smart-input";
import { useDebounce } from "@/hooks/useDebounce";
import { useCheckNicknameQuery } from "@/api/auth/checkNickname";
import { useUserStore } from "@/store/useUserStore";

const NicknameField = () => {
  const user = useUserStore((state) => state.user);
  const {
    register,
    control,
    formState: { errors },
    setError,
    clearErrors,
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
  const isAvailableNickname =
    !error &&
    !isFetching &&
    isNicknameCheckEnabled &&
    debouncedNickname === nicknameValue &&
    nicknameData?.available === true;

  useEffect(() => {
    if (!nicknameValue || debouncedNickname === user?.nickname) {
      clearErrors("nickname");
      return;
    }

    if (!isNicknameCheckEnabled || debouncedNickname !== nicknameValue) {
      setError("nickname", {
        type: "manual",
        message: "",
      });
      return;
    }

    if (isFetching) {
      setError("nickname", {
        type: "manual",
        message: "",
      });
      return;
    }

    if (nicknameData?.available === false) {
      setError("nickname", {
        type: "manual",
        message: "이미 사용중인 닉네임입니다.",
      });
      return;
    }

    if (nicknameData?.available === true) {
      clearErrors("nickname");
    }
  }, [
    clearErrors,
    debouncedNickname,
    isFetching,
    isNicknameCheckEnabled,
    nicknameData?.available,
    nicknameValue,
    setError,
    user?.nickname,
  ]);

  return (
    <SmartInput
      {...register("nickname", {
        onChange: () => {
          setError("nickname", {
            type: "manual",
            message: "",
          });
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
      helperMessage={
        isAvailableNickname ? "멋진 닉네임이에요" : undefined
      }
      helperMessageType="success"
    />
  );
};

export default NicknameField;
