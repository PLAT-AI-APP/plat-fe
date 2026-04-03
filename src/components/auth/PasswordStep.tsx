import React, { useState } from "react";
import { Form, useFormContext } from "react-hook-form";
import AuthInput from "./AuthInput";
import ActiveButton from "../ActiveButton";
import { AuthFormValues } from "@/type/auth";
import { PasswordToggle } from "./PasswordToggle";
import { useTogglePassword } from "@/hooks/useTogglePassword";

interface PasswordStepProps {
  title: string;
  buttonText: string;
}

const PasswordStep = ({ title, buttonText }: PasswordStepProps) => {
  const {
    trigger,
    register,
    watch,
    formState: { errors },
  } = useFormContext<AuthFormValues>();

  // 에러 메시지 노출 여부를 제어하는 상태
  const [showErrors, setShowErrors] = useState(false);

  const passwordValue = watch("password");
  const passwordConfirmValue = watch("passwordConfirm");

  const isShowPw = useTogglePassword();
  const isShowConfirm = useTogglePassword();

  // 버튼 활성화 조건: 두 칸 모두 값이 존재할 때
  const isBothFilled = !!passwordValue && !!passwordConfirmValue;

  const handleButtonClick = async (e: React.MouseEvent) => {
    // 버튼을 클릭했을 때 비로소 에러를 보여주도록 설정
    setShowErrors(true);

    const isStepValid = await trigger(["password", "passwordConfirm"]);

    if (!isStepValid) {
      e.preventDefault();
    }
  };

  return (
    <section className="w-full">
      <h1
        id="auth-step-title"
        className="text-center text-font-1 text-[22px] font-medium pb-9"
      >
        {title}
      </h1>
      <div id="password-fields-container" className="flex flex-col gap-4">
        <AuthInput
          id="input-password"
          label="비밀번호"
          type={isShowPw.inputType}
          placeholder="8자 이상 입력해주세요"
          {...register("password", {
            required: "비밀번호를 입력해주세요.",
            minLength: { value: 8, message: "최소 8자 이상이어야 합니다." },
            // 입력할 때 에러가 즉시 사라지게 하고 싶다면 onChange에서 setShowErrors(false) 가능
          })}
          rightElement={
            <PasswordToggle
              isVisible={isShowPw.isVisible}
              onToggle={isShowPw.toggle}
            />
          }
        />

        <AuthInput
          id="input-password-confirm"
          label="비밀번호 확인"
          type={isShowConfirm.inputType}
          placeholder="비밀번호를 다시 입력해주세요"
          {...register("passwordConfirm", {
            required: "비밀번호 확인이 필요합니다.",
            validate: (value) =>
              value === passwordValue || "비밀번호가 일치하지 않습니다.",
          })}
          rightElement={
            <PasswordToggle
              isVisible={isShowConfirm.isVisible}
              onToggle={isShowConfirm.toggle}
            />
          }
        />
      </div>
      {/* 에러 메시지 섹션: showErrors가 true일 때만 렌더링 */}
      <div className="min-h-[24px] pt-3">
        {showErrors && (
          <>
            {errors.password ? (
              <p className="text-font-accents text-[12px] text-center animate-in fade-in duration-200">
                {errors.password.message}
              </p>
            ) : errors.passwordConfirm ? (
              <p className="text-font-accents text-[12px] text-center animate-in fade-in duration-200">
                {errors.passwordConfirm.message}
              </p>
            ) : null}
          </>
        )}
      </div>
      <ActiveButton
        id="password-submit-button"
        text={buttonText}
        type="submit"
        isActive={isBothFilled}
        onClick={handleButtonClick}
        className="mt-8"
      />
    </section>
  );
};

export default PasswordStep;
