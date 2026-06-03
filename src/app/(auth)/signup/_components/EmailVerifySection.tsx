"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AuthFormValues } from "@/schema/auth.schema";
import { cn } from "@/lib/utils";
import ActiveButton from "@/components/ActiveButton";
import SmartInput from "@/components/smart-input";
import { useEmailVerifyMutation } from "@/api/auth/emailVerify";
import { useEmailVerifyConfirmMutation } from "@/api/auth/emailVerifyConfirm";
import { useCountdown } from "@/hooks/useCountdown";
import { useFieldFeedback } from "@/hooks/useFieldFeedback";
import { motion, AnimatePresence } from "framer-motion";

interface EmailVerifySectionProps {
  onVerifiedChange?: (isVerified: boolean) => void;
}

const EmailVerifySection = ({ onVerifiedChange }: EmailVerifySectionProps) => {
  // 상태: UI 및 에러 관련
  const [isOtpSent, setIsOtpSent] = useState(false); // 인증번호 입력창 표시 여부
  const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 최종 성공 여부

  const { getFeedback, setFeedback, clearFeedback } =
    useFieldFeedback<AuthFormValues>();

  const {
    register,
    control,
    formState: { errors },
    trigger,
    setValue,
    setError,
    clearErrors,
  } = useFormContext<AuthFormValues>();

  // 데이터: 폼 값 감시
  const email = useWatch({ control, name: "email" });
  const code = useWatch({ control, name: "code" });

  // API 뮤테이션 및 타이머 훅
  const { mutate: emailVerify, isPending: isEmailVerifyPending } =
    useEmailVerifyMutation();
  const { mutate: emailVerifyConfirm } = useEmailVerifyConfirmMutation();
  const { timeLeft, startTimer, formatTime, stopTimer } = useCountdown(300);

  useEffect(() => {
    if (isOtpSent && !isEmailVerified && timeLeft <= 0) {
      setError("code", {
        type: "manual",
        message: "시간이 초과되었습니다.",
      });
    }
  }, [isOtpSent, isEmailVerified, timeLeft, setError]);

  // 로직: 이메일 인증번호 요청 (인증요청/재전송)
  const handleRequestOtp = async () => {
    const isEmailValid = await trigger("email");
    if (!isEmailValid || !email) return;

    onVerifiedChange?.(false);
    clearFeedback("email");
    setValue("code", "");
    clearErrors("code");
    emailVerify(email, {
      onSuccess: (data) => {
        if (data.result === "OK") {
          setIsOtpSent(true);
          setFeedback("email", "메일함에서 인증번호를 확인해 주세요");
          setIsEmailVerified(false); // 재전송 시 인증 상태 초기화
          onVerifiedChange?.(false);
          startTimer();
        }
      },
    });
  };

  // 로직: 인증번호 확인(검증)
  const handleVerifyOtp = () => {
    if (timeLeft <= 0) {
      setError("code", {
        type: "manual",
        message: "시간이 초과되었습니다.",
      });
      return;
    }
    if (!email) return;

    emailVerifyConfirm(
      { code: code || "", email },
      {
        onSuccess: (data) => {
          // alert("이메일 인증 성공");
          setIsEmailVerified(true); // 인증 완료 상태로 변경
          setIsOtpSent(false); // 인증번호 입력창 숨김
          onVerifiedChange?.(true);
          setFeedback(
            "email",
            data.serverMessage || "이메일 인증이 완료되었습니다.",
          );
          clearErrors("code");
          stopTimer();
        },
        onError: () => {
          setError("code", {
            type: "manual",
            message: "인증번호가 일치하지 않습니다.",
          });
        },
      },
    );
  };

  // 로직: 인증 버튼 클릭 핸들러 (인증요청 또는 변경)
  const handleEmailBtnClick = () => {
    if (isEmailVerifyPending) return;

    if (isEmailVerified) {
      // 이미 인증된 상태에서 '변경'을 누를 경우
      setIsEmailVerified(false);
      onVerifiedChange?.(false);
      clearFeedback("email");
      setValue("email", "");
      setValue("code", "");
      clearErrors("code");
    } else {
      // 인증 전이거나 재전송인 경우
      handleRequestOtp();
    }
  };

  // 현재 노출할 최종 에러 메시지 결정 로직
  const displayErrorMessage = useMemo(() => {
    if (errors.email?.message) return errors.email.message;
    if (isOtpSent && !isEmailVerified) {
      if (errors.code?.message) return errors.code.message;
      if (timeLeft <= 0) return "시간이 초과되었습니다.";
    }
    return null;
  }, [errors.email, errors.code, isOtpSent, isEmailVerified, timeLeft]);

  const displayFeedback = getFeedback("email");
  const displayMessage = displayErrorMessage || displayFeedback?.message;
  const isDisplayMessageError = !!displayErrorMessage;

  return (
    <section id="email-auth-container" className="flex flex-col ">
      {/* 이메일 입력 영역 */}
      <article className="flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <SmartInput
            {...register("email", {
              onChange: async () => {
                setIsEmailVerified(false);
                onVerifiedChange?.(false);
                clearFeedback("email");
                clearErrors("code");
                await trigger("email");
              },
            })}
            label="이메일"
            labelFontSize="title-5"
            value={email}
            placeholder="example@gmail.com"
            inputClassName={cn(
              "h-11 bg-black/20 rounded-lg px-4 py-3 text-sm text-font-1",
              "placeholder:text-font-2/50 focus:border-brand transition-all",
              errors.email && "border-font-accents focus:border-font-accents",
              isEmailVerified && "bg-card text-font-2",
            )}
            disabled={isEmailVerified}
          />
          <ActiveButton
            type="button"
            isActive={!!email}
            disabled={!email || isEmailVerifyPending}
            text={
              isEmailVerifyPending
                ? ""
                : isEmailVerified
                  ? "변경"
                  : isOtpSent
                    ? "재전송"
                    : "인증요청"
            }
            className={cn(
              "mt-[29px] px-4 py-3 body-4 w-fit max-h-11 text-nowrap flex items-center justify-center gap-2",
              isEmailVerified &&
                "border border-border-main bg-bg-darker text-font-2",
              isOtpSent && "border border-brand-dark bg-brand-opacity-3",
            )}
            onClick={handleEmailBtnClick}
          >
            {isEmailVerifyPending && (
              <>
                <span
                  aria-hidden="true"
                  className="w-4 h-4 rounded-full border-2 border-font-4/40 border-t-font-4 animate-spin"
                />
                <span>요청 중</span>
              </>
            )}
          </ActiveButton>
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
              <div className="flex items-start gap-2">
                <SmartInput
                  {...register("code", {
                    onChange: () => {
                      clearFeedback("email");
                      clearErrors("code");
                    },
                  })}
                  label="인증번호"
                  labelFontSize="title-5"
                  value={code}
                  placeholder="000000"
                  inputMode="numeric"
                  onInput={(event) => {
                    event.currentTarget.value = event.currentTarget.value.slice(
                      0,
                      6,
                    );
                  }}
                  inputClassName={cn(
                    "h-11 bg-black/20 rounded-lg px-4 py-3 pr-16 text-sm text-font-1",
                    "placeholder:text-font-2/50 focus:border-brand transition-all",
                    errors.code &&
                      "border-font-accents focus:border-font-accents",
                  )}
                  rightElement={
                    <span className="text-sm text-font-2">{formatTime()}</span>
                  }
                />
                <ActiveButton
                  type="button"
                  isActive={(code?.length ?? 0) >= 6 && timeLeft > 0}
                  text="인증확인"
                  onClick={handleVerifyOtp}
                  className="mt-[29px] px-4 py-3 text-sm w-fit max-h-11 text-nowrap"
                />
              </div>
            </div>
          </motion.article>
        )}
      </AnimatePresence>

      {/* 3. 통합 에러 메시지 영역 (항상 섹션 최하단) */}
      {/* 메시지가 사라져도 레이아웃 흔들림 방지 */}
      {displayMessage && (
        <span
          role={isDisplayMessageError ? "alert" : "status"}
          className={cn(
            "pl-2 pt-1.5 text-xs",
            isDisplayMessageError ? "text-font-accents" : "text-font-2",
          )}
        >
          {displayMessage}
        </span>
      )}
    </section>
  );
};

export default EmailVerifySection;
