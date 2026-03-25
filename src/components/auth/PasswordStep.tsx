import React from "react";
import { useFormContext } from "react-hook-form";
import AuthInput from "./AuthInput";
import ActiveButton from "../ActiveButton";
import { AuthFormValues } from "@/type/auth";
import { PasswordToggle } from "./PasswordToggle";
import { useTogglePassword } from "@/hooks/useTogglePassword";

interface PasswordStepProps {
  title: string;
  buttonText: string;
  isValid: boolean; // 부모가 계산한 isStep2Valid를 받음
}

const PasswordStep = ({ title, buttonText, isValid }: PasswordStepProps) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<AuthFormValues>();

  // 비밀번호 확인 로직을 위해 'password' 필드 값을 실시간 감시합니다.
  const passwordValue = watch("password");

  // 비밀번호 가시성 토글 훅
  const isShowPw = useTogglePassword();
  const isShowConfirm = useTogglePassword();

  return (
    <section id="password-setup-step" className="w-full">
      <h1
        id="auth-step-title"
        className="text-center text-font-1 text-[22px] font-medium pb-9"
      >
        {title}
      </h1>

      <div id="password-fields-container" className="flex flex-col gap-4">
        {/* 비밀번호 입력 */}
        <AuthInput
          id="input-password"
          label="비밀번호"
          type={isShowPw.inputType}
          placeholder="8자 이상 입력해주세요"
          {...register("password", {
            required: "비밀번호를 입력해주세요.",
            minLength: { value: 8, message: "최소 8자 이상이어야 합니다." },
          })}
          error={errors.password?.message} // 에러 메시지 전달
          rightElement={
            <PasswordToggle
              isVisible={isShowPw.isVisible}
              onToggle={isShowPw.toggle}
            />
          }
        />

        {/* 비밀번호 확인 입력 */}
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

      {!isValid && errors.passwordConfirm && (
        <p className="pt-3 text-font-accents text-[12px] text-center animate-in fade-in duration-200">
          {errors.passwordConfirm.message}
        </p>
      )}

      <ActiveButton
        id="password-submit-button"
        text={buttonText}
        type="submit"
        isActive={isValid}
        className="mt-8"
      />
    </section>
  );
};

export default PasswordStep;
