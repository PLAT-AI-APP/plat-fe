"use client";

import React, { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AuthFormValues } from "@/type/auth";
import { EMAIL_REGEX } from "@/lib/regex";
import { cn } from "@/lib/utils";
import ActiveButton from "@/components/ActiveButton";
import { useEmailVerifyMutation } from "@/api/auth/emailVerify";
import { useEmailVerifyConfirmMutation } from "@/api/auth/emailVerifyConfirm";
import { useCountdown } from "@/hooks/useCountdown";
import { motion, AnimatePresence } from "framer-motion";

const EmailVerifySection = () => {
  // 상태: UI 및 에러 관련
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");

  const {
    register,
    control,
    formState: { errors },
    trigger,
    setValue,
  } = useFormContext<AuthFormValues>();

  // 데이터: 폼 값 감시
  const email = useWatch({ control, name: "email" });
  const otp = useWatch({ control, name: "otp" });
  const emailVerifyToken = useWatch({ control, name: "emailVerifyToken" });

  // 데이터: API 뮤테이션 및 타이머 훅
  const { mutate: emailVerify } = useEmailVerifyMutation();
  const { mutate: emailVerifyConfirm } = useEmailVerifyConfirmMutation();
  const {
    timeLeft,
    startTimer,
    formatTime,
    isActive: isTimerActive,
    stopTimer,
  } = useCountdown(300);

  // 로직: 이메일 인증번호 요청
  const handleRequestOtp = async () => {
    const isEmailValid = await trigger("email");
    if (!isEmailValid || !email) return;

    setValue("otp", "");
    setValue("emailVerifyToken", "");
    emailVerify(email, {
      onSuccess: (data) => {
        if (data.result === "OK") {
          setIsOtpSent(true);
          startTimer();
          setOtpError("");
        }
      },
    });
  };

  // 로직: 인증번호 확인(검증)
  const handleVerifyOtp = () => {
    if (timeLeft <= 0) {
      setOtpError("인증 시간이 만료되었습니다. 다시 시도해주세요.");
      return;
    }
    if (!email) return;

    emailVerifyConfirm(
      { code: String(otp) || "", email },
      {
        onSuccess: (data) => {
          if (data.token) setValue("emailVerifyToken", data.token);
          alert("이메일 인증 성공");
          setIsOtpSent(false);
          setOtpError("");
          stopTimer();
        },
        onError: () => {
          setOtpError("인증번호가 일치하지 않습니다.");
        },
      },
    );
  };

  return (
    <section id="email-auth-container" className="flex flex-col gap-5.25">
      {/* 이메일 입력 영역 */}
      <article className="flex flex-col gap-2">
        <label className="text-sm font-medium">이메일</label>
        <div className="flex gap-2">
          <input
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
            placeholder="example@gmail.com"
            className={cn(
              "w-full h-11 border border-border-main bg-black/20 rounded-lg px-4 py-3 text-sm text-font-1",
              "placeholder:text-font-2/50 focus:outline-none focus:border-brand transition-all",
              errors.email && "border-font-accents focus:border-font-accents",
              emailVerifyToken && "bg-card",
            )}
            disabled={Boolean(emailVerifyToken)}
          />
          <ActiveButton
            type="button"
            isActive={!!email && !errors.email}
            text={isOtpSent ? "재전송" : emailVerifyToken ? "변경" : "인증요청"}
            className={cn(
              "px-4 py-3 text-sm w-fit max-h-11 text-nowrap",
              emailVerifyToken && "border border-border-main bg-bg-darker",
            )}
            onClick={() =>
              !emailVerifyToken
                ? handleRequestOtp()
                : setValue("emailVerifyToken", "")
            }
          />
        </div>
        {errors.email?.message && (
          <span role="alert" className="pl-2 pt-1.5 text-font-accents text-xs">
            {errors.email?.message}
          </span>
        )}
      </article>

      {/* 인증번호 입력 영역 */}
      <AnimatePresence>
        {isOtpSent && (
          <motion.article
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">인증번호</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    {...register("otp", {
                      required: "인증번호를 입력해주세요",
                      maxLength: 6,
                    })}
                    maxLength={6}
                    placeholder="000000"
                    className={cn(
                      "w-full h-11 border border-border-main bg-black/20 rounded-lg px-4 py-3 text-sm text-font-1",
                      "placeholder:text-font-2/50 focus:outline-none focus:border-brand transition-all",
                      (errors.otp || otpError) &&
                        "border-font-accents focus:border-font-accents",
                    )}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-font-2">
                    {formatTime()}
                  </span>
                </div>
                <ActiveButton
                  type="button"
                  isActive={(otp?.length ?? 0) >= 6 && timeLeft > 0}
                  text="인증확인"
                  onClick={handleVerifyOtp}
                  className="px-4 py-3 text-sm w-fit max-h-11 text-nowrap"
                />
              </div>
              {(!isTimerActive || otpError) && (
                <span
                  role="alert"
                  className="pl-2 pt-1.5 text-font-accents text-xs"
                >
                  {otpError || "인증번호 유효시간 초과"}
                </span>
              )}
            </div>
          </motion.article>
        )}
      </AnimatePresence>
    </section>
  );
};

export default React.memo(EmailVerifySection);
