"use client";
import { useEmailVerifyMutation } from "@/api/auth/emailVerify";
import { useEmailVerifyConfirmMutation } from "@/api/auth/emailVerifyConfirm";
import ActiveButton from "@/components/ActiveButton";
import AuthInput from "@/components/auth/AuthInput";
import OtpInput from "@/components/auth/OtpInput";
import { Email } from "@/icons";
import { EMAIL_REGEX } from "@/lib/regex";
import { PasswordResetFormValues } from "@/type/auth";
import React, { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

interface EmailAuthFormProps {
  onNextStep: () => void;
}
const EmailAuthForm = ({ onNextStep }: EmailAuthFormProps) => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");

  const { mutate: emailVerify, isPending } = useEmailVerifyMutation();
  const { mutate: emailVerifyConfirm } = useEmailVerifyConfirmMutation();

  const {
    formState: { errors },
    trigger,
    control,
    getFieldState,
    register,
  } = useFormContext<PasswordResetFormValues>();

  const email = useWatch({ control, name: "email" });

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

  /** 이메일 인증번호 발송 요청 함수 */
  const handleRequestOtp = async () => {
    const isEmailValid = await trigger("email");
    if (!isEmailValid || !email) return;

    emailVerify(email, {
      onSuccess: (data) => {
        if (data.result === "OK") {
          setIsOtpSent(true);
          setTimeLeft(300);
        }
      },
    });
  };

  /** 입력한 OTP 코드 검증 함수 */
  const handleVerifyOtp = () => {
    if (timeLeft <= 0) {
      setOtpError("인증 시간이 만료되었습니다. 다시 시도해주세요.");
      return;
    }
    if (!email) {
      alert("이메일 정보가 없습니다. 다시 시도해주세요.");
      return;
    }

    emailVerifyConfirm(
      { code: enteredOtp, email: email },
      {
        onSuccess: () => {
          // if (data.token) setValue("emailVerifyToken", data.token);
          alert("이메일 인증 성공");
          onNextStep();
          // handleSubmit(() => null)();
        },
      },
    );
  };

  /** 최종 클릭 핸들러 */
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
    <section className="py-9 px-6 w-screen max-w-97 rounded-3xl border border-border-main bg-bg-darker">
      <header className="flex flex-col gap-1.5 pb-9">
        <div className="flex gap-3">
          <h1 id="auth-step-title" className="text-[22px] font-medium">
            비밀번호 재설정
          </h1>
        </div>
        <p className="text-font-2 text-sm">
          이메일 인증을 통해 비밀번호를 재설정할 수 있습니다.
        </p>
      </header>

      <div id="auth-fields-container" className="flex flex-col gap-4 pb-8">
        {/* 이메일 입력 필드 */}
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
            onChange: () => trigger("email"),
          })}
          error={errors.email}
          disabled={isOtpSent || isPending}
          inputClassName={isOtpSent ? "bg-card text-font-2" : ""}
          leftElement={isOtpSent && <Email className="w-5 h-5 text-font-2" />}
        />

        {/* OTP 입력 필드 (발송 성공 시에만 노출) */}
        {isOtpSent && (
          <OtpInput
            timeLeft={timeLeft}
            error={otpError}
            onComplete={handleOtpComplete}
            onResend={() => {
              // 재전송 로직 필요 시 emailVerify 재호출 가능
              setTimeLeft(300);
              if (email) emailVerify(email);
              setOtpError("");
            }}
          />
        )}
      </div>

      {/* 메인 액션 버튼 */}
      <ActiveButton
        id="email-submit-button"
        text={
          isPending ? "전송 중..." : isOtpSent ? "인증 확인" : "인증번호 전송"
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

export default EmailAuthForm;
