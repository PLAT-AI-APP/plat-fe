import React from "react";
import { useFormContext } from "react-hook-form";
import AuthInput from "./AuthInput";
import ActiveButton from "../ActiveButton";
import { cn } from "@/lib/utils";
import { AuthFormValues } from "@/type/auth";
import { NICKNAME_REGEX } from "@/lib/regex";
import { useDebounce } from "@/hooks/useDebounce";
import { useCheckNicknameQuery } from "@/api/auth/checkNickname";
import { BirthDateInput } from "../BirthDateInput";

interface InfoStepProps {
  title: string;
  buttonText: string;
  isValid: boolean;
}

const InfoStep = ({ title, buttonText, isValid }: InfoStepProps) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<AuthFormValues>();

  // 실시간 UI 반영을 위해 값들을 감시합니다.
  const nickname = watch("nickname");
  const gender = watch("gender");
  const birthDate = watch("birthDate");

  // 사용자가 입력하는 nickname을 1000ms(1초) 동안 지켜봅니다.
  const debouncedNickname = useDebounce({ value: nickname, delay: 500 });

  // 디바운스된 값이 있을 때만 쿼리를 활성화
  const { data } = useCheckNicknameQuery(debouncedNickname, {
    enabled: debouncedNickname.length > 0, // 값이 있을 때만 실행
    retry: false, // 실패 시 재시도 방지 (선택)
  });

  return (
    <section id="signup-info-step" className="w-full">
      <h1
        id="info-step-title"
        className="text-center text-font-1 text-[22px] font-medium pb-9"
      >
        {title}
      </h1>

      <div id="info-step-fields-container" className="flex flex-col gap-6 pb-6">
        {/* 닉네임 입력 */}
        <AuthInput
          id="input-nickname"
          label="닉네임"
          {...register("nickname", {
            required: "닉네임을 입력해주세요.",
            maxLength: {
              value: 15,
              message: "닉네임은 최대 15자까지 입력 가능합니다.",
            },
            minLength: {
              value: 2,
              message: "닉네임은 최소 2자 이상이어야 합니다.",
            },
            pattern: {
              value: NICKNAME_REGEX,
              message: "특수문자는 사용할 수 없습니다.",
            },
          })}
          // 정립 포인트: 0자일 때는 에러 메시지를 숨김
          error={
            errors.nickname?.message ||
            (nickname && data?.available === false
              ? "이미 사용중인 닉네임입니다."
              : undefined)
          }
          placeholder="2 ~ 15자 이내, 특수문자 불가"
          InputClassName="text-font-2"
        />

        {/* 성별 선택 */}
        <fieldset
          id="gender-selection-group"
          className="flex flex-col gap-2 border-none p-0 m-0"
        >
          <legend id="gender-label" className="text-sm text-font-1 mb-2">
            성별
          </legend>
          <div id="gender-button-wrapper" className="flex gap-2">
            {(["MALE", "FEMALE"] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() =>
                  setValue("gender", g, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                aria-pressed={gender === g}
                className={cn(
                  "flex-1 h-11.5 rounded-lg border border-white/10 transition-all cursor-pointer",
                  gender === g
                    ? "bg-brand-opacity text-brand border-brand/20"
                    : "bg-black/20 text-font-2 hover:bg-black/30",
                )}
              >
                {g === "MALE" ? "남자" : "여자"}
              </button>
            ))}
          </div>
        </fieldset>

        {/* 생년월일 input */}
        <BirthDateInput
          // {...register("birthDate")}
          value={birthDate}
          isEditMode={true}
          // handleBirthDate={handleBirthDate}
        />
      </div>

      {/* 완료 버튼 */}
      <ActiveButton
        id="signup-submit-button"
        text={buttonText}
        isActive={isValid}
      />
    </section>
  );
};

export default InfoStep;
