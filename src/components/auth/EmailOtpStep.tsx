"use client";

import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import AuthInput from "./AuthInput";
import OtpInput from "./OtpInput";
import ActiveButton from "../ActiveButton";
import { AuthFormValues } from "@/type/auth";
import { EMAIL_REGEX } from "@/lib/regex";

interface EmailOtpStepProps {
  title: string;
}

const EmailOtpStep = ({ title }: EmailOtpStepProps) => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [enteredOtp, setEnteredOtp] = useState(""); // 최종 입력된 6자리 저장

  const {
    register,
    trigger,
    formState: { errors },
  } = useFormContext<AuthFormValues>();

  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (isOtpSent && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isOtpSent]);

  // OTP 6자리가 모두 채워졌을 때 호출될 함수
  const handleOtpComplete = (code: string) => {
    setEnteredOtp(code);
    setOtpError(""); // 번호가 완성되면 일단 에러 초기화
  };

  const handleButtonClick = async (e: React.MouseEvent) => {
    if (!isOtpSent) {
      e.preventDefault();
      const isEmailValid = await trigger("email");
      if (isEmailValid) {
        setIsOtpSent(true);
        setTimeLeft(300); // 전송 시 타이머 리셋
      }
    } else {
      // 인증 완료 로직
      const targetCode = "123456"; // 예시 코드
      if (enteredOtp !== targetCode) {
        e.preventDefault();
        setOtpError("코드가 일치하지 않습니다.");
      } else {
        setOtpError("");
        console.log("이메일 인증 성공!");
      }
    }
  };

  console.log(enteredOtp);
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
          })}
          error={errors.email?.message}
          disabled={isOtpSent} // 번호 전송 후에는 이메일 수정 방지
        />

        {isOtpSent && (
          <div id="otp-input-group" className="flex flex-col gap-2">
            <OtpInput
              timeLeft={timeLeft}
              error={otpError}
              onComplete={handleOtpComplete}
              onResend={() => setTimeLeft(300)}
            />
          </div>
        )}
      </div>

      <ActiveButton
        id="email-submit-button"
        text={isOtpSent ? "인증완료" : "인증번호 전송"}
        // OTP가 6자리 다 찼고 시간이 남았을 때만 인증완료 버튼 활성화
        isActive={enteredOtp.length === 6 && timeLeft > 0}
        onClick={handleButtonClick}
      />
    </section>
  );
};

export default React.memo(EmailOtpStep);
