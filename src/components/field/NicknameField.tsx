"use client";

import React, { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useCheckNicknameQuery } from "@/api/auth/checkNickname";
import SmartInput from "@/components/smart-input";
import {
  FIELD_FEEDBACK_MESSAGES,
  FIELD_HELPER_MESSAGES,
} from "@/constants/fieldMessages";
import { useDebounce } from "@/hooks/useDebounce";
import { NICKNAME_REGEX } from "@/lib/regex";
import { useUserStore } from "@/store/useUserStore";

const NicknameField = () => {
  const user = useUserStore((state) => state.user);
  const {
    register,
    control,
    formState: { errors },
    setError,
    clearErrors,
    trigger,
  } = useFormContext();

  const nicknameValue = useWatch({ control, name: "nickname" });
  const currentNickname =
    typeof nicknameValue === "string" ? nicknameValue : "";
  const debouncedNickname = useDebounce({
    value: currentNickname,
    delay: 500,
  });

  const isCurrentNicknameValid =
    currentNickname.length > 0 &&
    currentNickname.length <= 20 &&
    NICKNAME_REGEX.test(currentNickname);
  const isDebouncedNicknameValid =
    debouncedNickname.length > 0 &&
    debouncedNickname.length <= 20 &&
    NICKNAME_REGEX.test(debouncedNickname);

  const isNicknameCheckEnabled =
    isDebouncedNicknameValid && debouncedNickname !== user?.nickname;

  const { data: nicknameData, isFetching } = useCheckNicknameQuery(
    debouncedNickname,
    {
      enabled: isNicknameCheckEnabled,
      retry: false,
    },
  );

  const error = errors["nickname"];
  const isNicknameSettled = debouncedNickname === currentNickname;
  const isUnavailableNickname =
    isCurrentNicknameValid &&
    isNicknameSettled &&
    !isFetching &&
    nicknameData?.available === false;
  const isAvailableNickname =
    !error &&
    isNicknameCheckEnabled &&
    isCurrentNicknameValid &&
    isNicknameSettled &&
    !isFetching &&
    nicknameData?.available === true;

  useEffect(() => {
    if (!currentNickname || currentNickname === user?.nickname) {
      clearErrors("nickname");
      return;
    }

    if (!isCurrentNicknameValid) {
      void trigger("nickname");
      return;
    }

    if (!isNicknameSettled || isFetching) {
      if (error?.type === "manual") {
        clearErrors("nickname");
      }
      return;
    }

    if (nicknameData?.available === false) {
      setError("nickname", {
        type: "manual",
        message: FIELD_FEEDBACK_MESSAGES.nicknameUnavailable,
      });
      return;
    }

    if (nicknameData?.available === true) {
      clearErrors("nickname");
    }
  }, [
    clearErrors,
    currentNickname,
    error?.type,
    isCurrentNicknameValid,
    isFetching,
    isNicknameSettled,
    nicknameData?.available,
    setError,
    trigger,
    user?.nickname,
  ]);

  return (
    <SmartInput
      {...register("nickname")}
      label="닉네임"
      required
      value={currentNickname}
      placeholder="1 ~ 20자 이내, 특수문자 불가"
      maxLength={20}
      error={
        (error?.message as string) ||
        (isUnavailableNickname
          ? FIELD_FEEDBACK_MESSAGES.nicknameUnavailable
          : undefined)
      }
      helperMessage={
        isAvailableNickname
          ? FIELD_FEEDBACK_MESSAGES.nicknameAvailable
          : FIELD_HELPER_MESSAGES.nicknameWithDuplication
      }
      helperMessageType={isAvailableNickname ? "success" : "default"}
      labelFontSize="title-5"
    />
  );
};

export default NicknameField;
