import React, { useEffect, useState } from "react";
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
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
}

const EmailOtpStep = ({
  title,
  otpValues,
  isValid,
  inputRefs,
  ...otpHandlers
}: EmailOtpStepProps) => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");

  const {
    register,
    trigger,
    watch,
    formState: { errors },
  } = useFormContext<AuthFormValues>();

  // 타이머 상태 관리 (초 단위: 300초 = 5분)
  const [timeLeft, setTimeLeft] = useState(300);
  // 타이머 구동 로직
  useEffect(() => {
    if (isOtpSent) {
      if (timeLeft <= 0) return; // 0초면 중지

      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, isOtpSent]);

  const emailValue = watch("email");
  const isEmailInputValid = EMAIL_REGEX.test(emailValue || "") && !errors.email;

  const handleButtonClick = async (e: React.MouseEvent) => {
    if (!isOtpSent) {
      e.preventDefault();
      const isEmailValid = await trigger("email");
      if (isEmailValid) {
        setIsOtpSent(true);
      }
    } else {
      // 실제로는 서버에서 전달된 코드로 검증하거나, API 호출을 수행해야 합니다.
      const enteredCode = otpValues.join("");
      const targetCode = "123456"; // 기존 입력해야 할 예시 코드

      if (enteredCode !== targetCode) {
        e.preventDefault();
        setOtpError("코드가 일치하지 않습니다.");
      } else {
        setOtpError("");
      }
    }
  };

  return (
    <section id="email-otp-auth-step" className="w-full">
      <h1
        id="auth-step-title"
        className="text-center text-font-1 text-[22px] font-medium pb-9"
      >
        {title}
      </h1>

      <div id="auth-fields-container" className="flex flex-col gap-4 pb-8">
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
            onChange: () => {
              trigger("email");
            },
          })}
          error={errors.email?.message}
        />

        {isOtpSent && (
          <div id="otp-input-group" className="flex flex-col gap-2">
            <OtpInput
              code={otpValues}
              inputRefs={inputRefs}
              timeLeft={timeLeft}
              error={otpError}
              {...otpHandlers}
            />
          </div>
        )}
      </div>

      <ActiveButton
        id="email-submit-button"
        text={isOtpSent ? "인증완료" : "인증번호 전송"}
        isActive={isOtpSent ? isValid && timeLeft > 0 : isEmailInputValid}
        onClick={handleButtonClick}
      />
    </section>
  );
};

export default React.memo(EmailOtpStep);
