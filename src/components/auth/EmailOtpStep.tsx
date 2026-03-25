import React from "react";
import { useFormContext } from "react-hook-form";
import AuthInput from "./AuthInput";
import OtpInput from "./OtpInput";
import ActiveButton from "../ActiveButton";
import { AuthFormValues } from "@/type/auth";
import { EMAIL_REGEX } from "@/lib/regex";

interface EmailOtpStepProps {
  title: string;
  otpValues: string[];
  isValid: boolean;
  handleChange: (index: number, value: string) => void;
  handleKeyDown: (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => void;
  handlePaste: (e: React.ClipboardEvent) => void;
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
}

const EmailOtpStep = ({
  title,
  otpValues,
  isValid,
  inputRefs,
  ...otpHandlers
}: EmailOtpStepProps) => {
  // 부모 Provider로부터 필요한 함수와 상태를 직접 꺼냅니다.
  const {
    register,
    formState: { errors },
  } = useFormContext<AuthFormValues>();

  return (
    <section id="email-otp-auth-step" className="w-full">
      <h1
        id="auth-step-title"
        className="text-center text-font-1 text-[22px] font-medium pb-9"
      >
        {title}
      </h1>

      <div id="auth-fields-container" className="flex flex-col gap-4 pb-8">
        {/* 이메일 입력 영역 */}
        <AuthInput
          id="input-email"
          label="이메일"
          type="email"
          placeholder="example@email.com"
          {...register("email", {
            required: "이메일을 입력해주세요.",
            pattern: {
              value: EMAIL_REGEX,
              message: "올바른 이메일 형식이 아닙니다.",
            },
          })}
          error={errors.email?.message}
        />

        {/* OTP 입력 영역 */}
        <div id="otp-input-group" className="flex flex-col gap-2">
          <OtpInput code={otpValues} inputRefs={inputRefs} {...otpHandlers} />
        </div>
      </div>

      <ActiveButton id="email-submit-button" text="다음" isActive={isValid} />
    </section>
  );
};

export default EmailOtpStep;
