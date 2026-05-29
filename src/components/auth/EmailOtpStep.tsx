"use client";

import React, { useEffect, useState } from "react";
import { SubmitHandler, useFormContext } from "react-hook-form";
import AuthInput from "./AuthInput";
import OtpInput from "./OtpInput";
import ActiveButton from "../ActiveButton";
import { AuthFormValues } from "@/schema/auth.schema";
import { EMAIL_REGEX } from "@/lib/regex";
import { useEmailVerifyMutation } from "@/api/auth/emailVerify";
import { useEmailVerifyConfirmMutation } from "@/api/auth/emailVerifyConfirm";

interface EmailOtpStepProps {
  title: string;
  onSubmit: SubmitHandler<AuthFormValues>;
}

const EmailOtpStep = ({ title, onSubmit }: EmailOtpStepProps) => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");

  const { mutate: emailVerify, isPending } = useEmailVerifyMutation();
  const { mutate: emailVerifyConfirm } = useEmailVerifyConfirmMutation();

  const {
    register,
    trigger,
    watch,
    getFieldState,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useFormContext<AuthFormValues>();

  const emailValue = watch("email");
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (isOtpSent && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isOtpSent]);

  const handleOtpComplete = (code: string) => {
    setEnteredOtp(code);
    setOtpError("");
  };

  // 이메일 인증번호 발송 요청 함수
  const handleRequestOtp = async () => {
    const isEmailValid = await trigger("email");
    if (!isEmailValid || !emailValue) return;

    emailVerify(emailValue, {
      onSuccess: (data) => {
        if (data.result === "OK") {
          setIsOtpSent(true);
          setTimeLeft(300);
        }
      },
    });
  };

  // 입력한 OTP 코드 검증 함수
  const handleVerifyOtp = () => {
    if (timeLeft <= 0) {
      setOtpError("인증 시간이 만료되었습니다. 다시 시도해주세요.");
      return;
    }
    if (!emailValue) {
      alert("이메일 정보가 없습니다. 다시 시도해주세요.");
      return;
    }

    emailVerifyConfirm(
      { code: enteredOtp, email: emailValue },
      {
        onSuccess: () => {
          // if (data.token) setValue("emailVerifyToken", data.token);
          alert("이메일 인증 성공");
          handleSubmit(onSubmit)();
        },
      },
    );
  };

  // 3. 최종 클릭 핸들러 (연결부)
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isOtpSent) {
      handleVerifyOtp();
    } else {
      handleRequestOtp();
    }
  };

  // 실시간 유효성 상태 뽑기 (에러가 없고 값이 비어있지 않아야 함)
  const { invalid, isDirty } = getFieldState("email");
  const isEmailPerfect = !invalid && isDirty;

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
            onChange: async () => {
              await trigger("email");
            },
          })}
          error={errors.email}
          disabled={isOtpSent || isPending}
        />

        {isOtpSent && (
          <div id="otp-input-group" className="flex flex-col gap-2">
            <OtpInput
              timeLeft={timeLeft}
              error={otpError}
              onComplete={handleOtpComplete}
              onResend={() => {
                // 재전송 로직 필요 시 emailVerify 재호출 가능
                setTimeLeft(300);
                if (emailValue) emailVerify(emailValue);
                setOtpError("");
              }}
            />
          </div>
        )}
      </div>

      <ActiveButton
        id="email-submit-button"
        text={
          isPending ? "전송 중..." : isOtpSent ? "인증완료" : "인증번호 전송"
        }
        isActive={
          isOtpSent
            ? enteredOtp.length === 6 && timeLeft > 0
            : isEmailPerfect && !isPending
        }
        onClick={handleButtonClick}
      />
    </section>
  );
};

export default React.memo(EmailOtpStep);
