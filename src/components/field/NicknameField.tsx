"use client";

import React, { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import SmartInput from "@/components/smart-input";
import { useDebounce } from "@/hooks/useDebounce";
import { useCheckNicknameQuery } from "@/api/auth/checkNickname";
import { useUserStore } from "@/store/useUserStore";

const NICKNAME_UNAVAILABLE_MESSAGE =
  "이미 사용 중인 닉네임이에요";
const MAX_NICKNAME_LENGTH = 20;
const NICKNAME_MAX_LENGTH_MESSAGE =
  "20자 이내의 닉네임을 사용해요";

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
    debouncedNickname.length <= MAX_NICKNAME_LENGTH &&
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
    nicknameValue.length <= MAX_NICKNAME_LENGTH &&
    nicknameData?.available === true;

  useEffect(() => {
    if (!nicknameValue || debouncedNickname === user?.nickname) {
      clearErrors("nickname");
      return;
    }

    if (nicknameValue.length > MAX_NICKNAME_LENGTH) {
      setError("nickname", {
        type: "manual",
        message: NICKNAME_MAX_LENGTH_MESSAGE,
      });
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
        message: NICKNAME_UNAVAILABLE_MESSAGE,
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
      maxLength={MAX_NICKNAME_LENGTH}
      error={
        (error?.message as string) ||
        (!isFetching && nicknameData?.available === false
          ? NICKNAME_UNAVAILABLE_MESSAGE
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
