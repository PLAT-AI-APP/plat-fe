"use client";

import React, { useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AuthFormValues } from "@/schema/auth.schema";
import { EMAIL_REGEX } from "@/lib/regex";
import { cn } from "@/lib/utils";
import ActiveButton from "@/components/ActiveButton";
import { useEmailVerifyMutation } from "@/api/auth/emailVerify";
import { useEmailVerifyConfirmMutation } from "@/api/auth/emailVerifyConfirm";
import { useCountdown } from "@/hooks/useCountdown";
import { motion, AnimatePresence } from "framer-motion";

const EmailVerifySection = () => {
  // 상태: UI 및 에러 관련
  const [isOtpSent, setIsOtpSent] = useState(false); // 인증번호 입력창 표시 여부
  const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 최종 성공 여부
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
  const code = useWatch({ control, name: "code" });

  // API 뮤테이션 및 타이머 훅
  const { mutate: emailVerify } = useEmailVerifyMutation();
  const { mutate: emailVerifyConfirm } = useEmailVerifyConfirmMutation();
  const { timeLeft, startTimer, formatTime, stopTimer } = useCountdown(300);

  // 로직: 이메일 인증번호 요청 (인증요청/재전송)
  const handleRequestOtp = async () => {
    const isEmailValid = await trigger("email");
    if (!isEmailValid || !email) return;

    setValue("code", "");
    emailVerify(email, {
      onSuccess: (data) => {
        if (data.result === "OK") {
          setIsOtpSent(true);
          setIsEmailVerified(false); // 재전송 시 인증 상태 초기화
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
      { code: code || "", email },
      {
        onSuccess: () => {
          alert("이메일 인증 성공");
          setIsEmailVerified(true); // 인증 완료 상태로 변경
          setIsOtpSent(false); // 인증번호 입력창 숨김
          setOtpError("");
          stopTimer();
        },
        onError: () => {
          setOtpError("인증번호가 일치하지 않습니다.");
        },
      },
    );
  };

  // 로직: 인증 버튼 클릭 핸들러 (인증요청 또는 변경)
  const handleEmailBtnClick = () => {
    if (isEmailVerified) {
      // 이미 인증된 상태에서 '변경'을 누를 경우
      setIsEmailVerified(false);
      setValue("email", "");
      setValue("code", "");
    } else {
      // 인증 전이거나 재전송인 경우
      handleRequestOtp();
    }
  };

  // 현재 노출할 최종 에러 메시지 결정 로직
  const displayErrorMessage = useMemo(() => {
    if (errors.email?.message) return errors.email.message;
    if (isOtpSent && !isEmailVerified) {
      if (otpError) return otpError;
      if (timeLeft <= 0) return "인증번호 유효시간 초과";
      if (errors.code?.message) return errors.code.message;
    }
    return null;
  }, [
    errors.email,
    errors.code,
    isOtpSent,
    isEmailVerified,
    otpError,
    timeLeft,
  ]);

  return (
    <section id="email-auth-container" className="flex flex-col ">
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
              isEmailVerified && "bg-card text-font-2", // 인증 완료 시 스타일 변경
            )}
            disabled={isEmailVerified} // 인증 완료 시 수정 불가
          />
          <ActiveButton
            type="button"
            isActive={!!email}
            text={isEmailVerified ? "변경" : isOtpSent ? "재전송" : "인증요청"}
            className={cn(
              "px-4 py-3 text-sm w-fit max-h-11 text-nowrap",
              isEmailVerified &&
                "border border-border-main bg-bg-darker text-font-2",
            )}
            onClick={handleEmailBtnClick}
          />
        </div>
        {/* {errors.email?.message && (
          <span role="alert" className="pl-2 pt-1.5 text-font-accents text-xs">
            {errors.email?.message}
          </span>
        )} */}
      </article>

      {/* 인증번호 입력 영역 (인증번호 발송 시에만 표시) */}
      <AnimatePresence>
        {isOtpSent && !isEmailVerified && (
          <motion.article
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 mt-5.25">
              <label className="text-sm font-medium">인증번호</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    {...register("code", {
                      required: "인증번호를 입력해주세요",
                      maxLength: 6,
                    })}
                    maxLength={6}
                    placeholder="000000"
                    className={cn(
                      "w-full h-11 border border-border-main bg-black/20 rounded-lg px-4 py-3 text-sm text-font-1",
                      "placeholder:text-font-2/50 focus:outline-none focus:border-brand transition-all",
                      (errors.code || otpError) &&
                        "border-font-accents focus:border-font-accents",
                    )}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-font-2">
                    {formatTime()}
                  </span>
                </div>
                <ActiveButton
                  type="button"
                  isActive={(code?.length ?? 0) >= 6 && timeLeft > 0}
                  text="인증확인"
                  onClick={handleVerifyOtp}
                  className="px-4 py-3 text-sm w-fit max-h-11 text-nowrap"
                />
              </div>
            </div>
          </motion.article>
        )}
      </AnimatePresence>

      {/* 3. 통합 에러 메시지 영역 (항상 섹션 최하단) */}
      {/* 메시지가 사라져도 레이아웃 흔들림 방지 */}
      {displayErrorMessage && (
        <span role="alert" className="pl-2 pt-1.5 text-font-accents text-xs">
          {displayErrorMessage}
        </span>
      )}
    </section>
  );
};

export default React.memo(EmailVerifySection);
