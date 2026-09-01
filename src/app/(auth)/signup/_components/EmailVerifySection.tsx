"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import { useEmailVerifyMutation } from "@/api/auth/emailVerify";
import { useEmailVerifyConfirmMutation } from "@/api/auth/emailVerifyConfirm";
import ActiveButton from "@/components/ActiveButton";
import SmartInput from "@/components/smart-input";
import {
  FIELD_FEEDBACK_MESSAGES,
  FIELD_HELPER_MESSAGES,
} from "@/constants/fieldMessages";
import { useFieldFeedback } from "@/hooks/useFieldFeedback";
import { useTranslateText } from "@/hooks/useTranslateText";
import { useCountdown } from "@/hooks/useCountdown";
import { cn } from "@/lib/utils";
import { AuthFormValues } from "@/schema/auth.schema";

interface EmailVerifySectionProps {
  onVerifiedChange?: (isVerified: boolean) => void;
}

const EmailVerifySection = ({ onVerifiedChange }: EmailVerifySectionProps) => {
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
  const { mutate: emailVerifyConfirm } = useEmailVerifyConfirmMutation();
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

    emailVerify(email, {
      onSuccess: () => {
        setIsOtpSent(true);
        setFeedback("email", FIELD_FEEDBACK_MESSAGES.emailVerificationSent);
        setIsEmailVerified(false);
        onVerifiedChange?.(false);
        startTimer();
      },
    });
  };

  const handleVerifyOtp = () => {
    if (timeLeft <= 0) {
      setError("code", {
        type: "manual",
        message: FIELD_FEEDBACK_MESSAGES.emailVerificationExpired,
      });
      return;
    }
    if (!email) return;

    emailVerifyConfirm(
      { code: code || "", email },
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
        onError: () => {
          setError("code", {
            type: "manual",
            message: FIELD_FEEDBACK_MESSAGES.emailVerificationMismatch,
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
              isOtpSent && "border border-brand-dark bg-brand/10 text-brand-dark",
            )}
            textClassName="body-4"
            onClick={handleEmailBtnClick}
          >
            {isEmailVerifyPending && (
              <>
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-on-brand/40 border-t-on-brand"
                />
                <span className="body-4">
                  {t("auth.emailVerification.requesting")}
                </span>
              </>
            )}
          </ActiveButton>
        </div>
      </article>

      <AnimatePresence>
        {isOtpSent && !isEmailVerified && (
          <motion.article
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
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
                    "body-4 h-11 rounded-lg bg-darkest px-4 py-3 pr-16 text-font-1",
                    "placeholder:text-font-2/50 focus:border-brand transition-colors",
                    errors.code &&
                      "border-font-accents focus:border-font-accents",
                  )}
                  rightElement={
                    <span className="body-4 text-font-2">{formatTime()}</span>
                  }
                />
                <ActiveButton
                  type="button"
                  isActive={(code?.length ?? 0) >= 6 && timeLeft > 0}
                  text={t("auth.emailVerification.confirm")}
                  onClick={handleVerifyOtp}
                  className="body-4 mt-[29px] max-h-11 w-fit text-nowrap px-4 py-3"
                />
              </div>
            </div>
          </motion.article>
        )}
      </AnimatePresence>

      {displayMessage && (
        <span
          role={isDisplayMessageError ? "alert" : "status"}
          className={cn(
            "body-6 pt-2",
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
