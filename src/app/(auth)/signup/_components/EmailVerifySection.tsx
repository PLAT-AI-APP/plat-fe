"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { TRANSITION_COLLAPSE } from "@/constants/motion";
import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import { notifyApiError } from "@/api";
import {
  EMAIL_UNAVAILABLE_CODE,
  type EmailVerifyPurpose,
  useEmailVerifyMutation,
} from "@/api/auth/emailVerify";
import {
  VERIFY_CODE_ATTEMPT_EXCEEDED_CODE,
  VERIFY_CODE_EXPIRED_CODE,
  VERIFY_CODE_INVALID_CODE,
  useEmailVerifyConfirmMutation,
} from "@/api/auth/emailVerifyConfirm";
import ActiveButton from "@/components/ActiveButton";
import SmartInput from "@/components/smart-input";
import {
  FIELD_FEEDBACK_MESSAGES,
  FIELD_HELPER_MESSAGES,
} from "@/constants/fieldMessages";
import { useFieldFeedback } from "@/hooks/form/useFieldFeedback";
import { useTranslateText } from "@/hooks/i18n/useTranslateText";
import { useCountdown } from "@/hooks/common/useCountdown";
import { cn } from "@/lib/utils";
import { AuthFormValues } from "@/schema/auth.schema";

interface EmailVerifySectionProps {
  onVerifiedChange?: (isVerified: boolean) => void;
  /**
   * 인증번호 용도. 가입(기본)은 이미 가입된 이메일을 거절하고, 비밀번호 재설정은 가입 여부를 드러내지 않는다
   * — 서버가 가입된 이메일에만 보내고 응답은 늘 같으므로, 보냈다고 단정하지 않는 안내를 쓴다.
   */
  purpose?: EmailVerifyPurpose;
}

/** 확인 실패 사유별 안내. 틀림·만료·횟수 초과를 모두 "불일치"로 말하면 다시 받아야 하는지 알 수 없다. */
const confirmErrorMessage = (code: string | undefined) => {
  switch (code) {
    case VERIFY_CODE_INVALID_CODE:
      return FIELD_FEEDBACK_MESSAGES.emailVerificationMismatch;
    case VERIFY_CODE_EXPIRED_CODE:
      return FIELD_FEEDBACK_MESSAGES.emailVerificationExpired;
    case VERIFY_CODE_ATTEMPT_EXCEEDED_CODE:
      return FIELD_FEEDBACK_MESSAGES.emailVerificationAttemptExceeded;
    default:
      return null;
  }
};

const EmailVerifySection = ({
  onVerifiedChange,
  purpose = "SIGNUP",
}: EmailVerifySectionProps) => {
  const t = useTranslations();
  const translateText = useTranslateText();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

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

  const email = useWatch({ control, name: "email" });
  const code = useWatch({ control, name: "code" });

  const { mutate: emailVerify, isPending: isEmailVerifyPending } =
    useEmailVerifyMutation();
  const { mutate: emailVerifyConfirm, isPending: isEmailVerifyConfirmPending } =
    useEmailVerifyConfirmMutation();
  const { timeLeft, startTimer, formatTime, stopTimer } = useCountdown(300);

  useEffect(() => {
    if (isOtpSent && !isEmailVerified && timeLeft <= 0) {
      setError("code", {
        type: "manual",
        message: FIELD_FEEDBACK_MESSAGES.emailVerificationExpired,
      });
    }
  }, [isOtpSent, isEmailVerified, timeLeft, setError]);

  const handleRequestOtp = async () => {
    const isEmailValid = await trigger("email");
    if (!isEmailValid || !email) return;

    onVerifiedChange?.(false);
    clearFeedback("email");
    setValue("code", "");
    clearErrors("code");

    emailVerify({ email, purpose }, {
      onSuccess: () => {
        setIsOtpSent(true);
        setFeedback(
          "email",
          purpose === "PASSWORD_RESET"
            ? FIELD_FEEDBACK_MESSAGES.passwordResetCodeSent
            : FIELD_FEEDBACK_MESSAGES.emailVerificationSent,
        );
        setIsEmailVerified(false);
        onVerifiedChange?.(false);
        startTimer();
      },
      onError: (error) => {
        // 이메일·구글·카카오 어느 방법으로든 이미 가입된 이메일. 인증까지 마친 뒤가 아니라 지금 알린다.
        // 재설정 용도에서는 서버가 이 코드를 주지 않는다(가입 여부를 숨긴다).
        if (purpose === "SIGNUP" && error.code === EMAIL_UNAVAILABLE_CODE) {
          setError("email", {
            type: "manual",
            message: FIELD_FEEDBACK_MESSAGES.emailAlreadyRegistered,
          });
          return;
        }
        notifyApiError(error);
      },
    });
  };

  const handleVerifyOtp = () => {
    // 응답 전까지 버튼이 그대로라 다시 누르면 confirm 이 중복으로 나갔다.
    if (isEmailVerifyConfirmPending) return;
    if (timeLeft <= 0) {
      setError("code", {
        type: "manual",
        message: FIELD_FEEDBACK_MESSAGES.emailVerificationExpired,
      });
      return;
    }
    if (!email) return;

    emailVerifyConfirm(
      { code: code || "", email, purpose },
      {
        onSuccess: () => {
          setIsEmailVerified(true);
          setIsOtpSent(false);
          onVerifiedChange?.(true);
          setFeedback(
            "email",
            FIELD_FEEDBACK_MESSAGES.emailVerificationComplete,
          );
          clearErrors("code");
          stopTimer();
        },
        onError: (error) => {
          // 인증번호 문제는 칸 아래에, 그 밖(네트워크·속도 제한 등)은 서버 문구를 그대로 칸 아래에 둔다.
          setError("code", {
            type: "manual",
            message: confirmErrorMessage(error.code) ?? error.message,
          });
        },
      },
    );
  };

  const handleEmailBtnClick = () => {
    if (isEmailVerifyPending) return;

    if (isEmailVerified) {
      setIsEmailVerified(false);
      onVerifiedChange?.(false);
      clearFeedback("email");
      setValue("email", "");
      setValue("code", "");
      clearErrors("code");
    } else {
      handleRequestOtp();
    }
  };

  const displayErrorMessage = useMemo(() => {
    if (errors.email?.message) return errors.email.message;
    if (isOtpSent && !isEmailVerified) {
      if (errors.code?.message) return errors.code.message;
      if (timeLeft <= 0) {
        return FIELD_FEEDBACK_MESSAGES.emailVerificationExpired;
      }
    }
    return null;
  }, [errors.email, errors.code, isOtpSent, isEmailVerified, timeLeft]);

  const displayFeedback = getFeedback("email");
  const displayMessage = displayErrorMessage || displayFeedback?.message;
  const isDisplayMessageError = Boolean(displayErrorMessage);
  const emailHelperMessage =
    displayMessage || isOtpSent || isEmailVerified
      ? undefined
      : FIELD_HELPER_MESSAGES.emailDomain;
  const isEmailButtonActive =
    Boolean(email) && !errors.email && !isEmailVerifyPending;

  return (
    <section id="email-auth-container" className="flex flex-col">
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
            label="auth.login.emailLabel"
            labelFontSize="title-5"
            value={email}
            placeholder="auth.login.emailPlaceholder"
            inputClassName={cn(
              "bg-darkest px-4 py-3 text-font-1",
              "focus:border-brand transition-colors",
              errors.email && "border-font-accents focus:border-font-accents",
              isEmailVerified && "bg-card text-font-2",
            )}
            disabled={isEmailVerified}
            helperMessage={emailHelperMessage}
          />
          <ActiveButton
            type="button"
            isActive={isEmailButtonActive}
            disabled={!isEmailButtonActive}
            text={
              isEmailVerifyPending
                ? ""
                : isEmailVerified
                  ? t("auth.emailVerification.change")
                  : isOtpSent
                    ? t("auth.emailVerification.resend")
                    : t("auth.emailVerification.request")
            }
            className={cn(
              "mt-[29px] flex max-h-11.75 w-fit items-center justify-center gap-2 rounded-xl px-4 py-3 text-nowrap",
              isEmailButtonActive
                ? "bg-brand text-on-brand"
                : "bg-font-disabled text-font-1",
              isEmailVerified && "bg-brand text-on-brand",
              isOtpSent &&
                "border border-brand-dark bg-brand/10 text-brand-dark",
            )}
            textClassName="body-5"
            onClick={handleEmailBtnClick}
          >
            {isEmailVerifyPending && (
              <>
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-on-brand/40 border-t-on-brand"
                />
                <span className="body-5">
                  {t("auth.emailVerification.requesting")}
                </span>
              </>
            )}
          </ActiveButton>
        </div>
      </article>

      <AnimatePresence>
        {isOtpSent && !isEmailVerified && (
          <m.article
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={TRANSITION_COLLAPSE}
            className="overflow-hidden"
          >
            <div className="mt-5 flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <SmartInput
                  {...register("code", {
                    onChange: () => {
                      clearFeedback("email");
                      clearErrors("code");
                    },
                  })}
                  label="auth.emailVerification.codeLabel"
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
                    "body-5 h-11 rounded-lg bg-darkest px-4 py-3 pr-16 text-font-1",
                    "placeholder:text-font-2/50 focus:border-brand transition-colors",
                    errors.code &&
                      "border-font-accents focus:border-font-accents",
                  )}
                  rightElement={
                    <span className="body-5 text-font-2">{formatTime()}</span>
                  }
                />
                <ActiveButton
                  type="button"
                  isActive={(code?.length ?? 0) >= 6 && timeLeft > 0}
                  isPending={isEmailVerifyConfirmPending}
                  text={t("auth.emailVerification.confirm")}
                  onClick={handleVerifyOtp}
                  className="body-5 mt-[29px] max-h-11 w-fit text-nowrap px-4 py-3"
                />
              </div>
            </div>
          </m.article>
        )}
      </AnimatePresence>

      {displayMessage && (
        <span
          role={isDisplayMessageError ? "alert" : "status"}
          className={cn(
            "body-7 pt-2",
            isDisplayMessageError ? "text-font-accents" : "text-font-2",
          )}
        >
          {translateText(displayMessage)}
        </span>
      )}
    </section>
  );
};

export default EmailVerifySection;
