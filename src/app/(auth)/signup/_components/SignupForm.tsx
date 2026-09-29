"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import { notifyApiError } from "@/api";
import { useAuthRegisterMutation } from "@/api/auth/authRegister";
import ActiveButton from "@/components/ActiveButton";
import NicknameField from "@/components/field/NicknameField";
import PasswordCheckField from "@/components/field/PasswordCheckField";
import PasswordField from "@/components/field/PasswordField";
import { useFormServerError } from "@/hooks/form/useFormServerError";
import { useTranslateText } from "@/hooks/i18n/useTranslateText";
import { focusFirstFieldError } from "@/lib/formError";
import { showAppToast } from "@/lib/toast";
import { AuthFormValues } from "@/schema/auth.schema";
import Agreed from "./Agreed";
import EmailVerifySection from "./EmailVerifySection";

const PENDING_SIGNUP_COMPLETE_DIALOG_KEY = "pending-signup-complete-dialog";

/**
 * 서버 검증 오류(fields)의 키 중 이 폼에서 사용자가 고칠 수 있는 칸.
 * 여기 없는 키(인증번호·동의 항목·폼 전체 규칙 등)에 오류를 달면 보이지도, 고쳐서 지울 수도 없어
 * 가입 버튼이 계속 잠긴다. 그런 오류는 토스트로 알린다.
 */
const SERVER_FIELD_KEYS = ["email", "nickname", "password", "passwordCheck"] as const;
type ServerFieldKey = (typeof SERVER_FIELD_KEYS)[number];

const isServerFieldKey = (key: string): key is ServerFieldKey =>
  (SERVER_FIELD_KEYS as readonly string[]).includes(key);

const SignupForm = () => {
  const t = useTranslations();
  const translateText = useTranslateText();
  const router = useRouter();
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setFocus,
  } = useFormContext<AuthFormValues>();

  const {
    nickname = "",
    email = "",
    password = "",
    passwordCheck = "",
    isPrivacyAgreed = "",
    isTermsAgreed = "",
    isAgeAgreed = "",
  } = useWatch({ control });

  // 이메일 인증은 RHF 스키마 바깥의 서버 검증이므로 최종 버튼 활성 조건에서 별도로 함께 확인합니다.
  const isFormValid =
    !!(
      nickname &&
      email &&
      password &&
      passwordCheck &&
      isPrivacyAgreed &&
      isTermsAgreed &&
      isAgeAgreed &&
      isEmailVerified
    ) && Object.keys(errors).length === 0;

  const { mutate: authRegister, isPending: isRegistering } =
    useAuthRegisterMutation();
  const { setFieldErrors } = useFormServerError<AuthFormValues>();

  const onSubmit = (data: AuthFormValues) => {
    authRegister(
      {
        email: data.email,
        code: data.code,
        nickname: data.nickname,
        password: data.password,
        passwordCheck: data.passwordCheck,
        agreements: {
          termsOfService: data.isTermsAgreed,
          privacyPolicy: data.isPrivacyAgreed,
          ageOver14: data.isAgeAgreed,
          marketing: data.isMarketingAgreed,
        },
      },
      {
        onSuccess: () => {
          // 회원가입이 완료되면 이전 입력값과 인증 상태를 비워 다음 회원가입 진입 시 빈 폼으로 시작합니다.
          reset({
            nickname: "",
            email: "",
            code: "",
            password: "",
            passwordCheck: "",
            isPrivacyAgreed: false,
            isTermsAgreed: false,
            isAgeAgreed: false,
            isMarketingAgreed: false,
          });
          setIsEmailVerified(false);

          // 회원가입 완료 다이얼로그는 홈으로 이동한 뒤 열어 회원가입 화면 위에 레이어가 남지 않게 합니다.
          sessionStorage.setItem(
            PENDING_SIGNUP_COMPLETE_DIALOG_KEY,
            JSON.stringify({
              nickname: data.nickname,
              agreement: {
                processedAt: new Date().toISOString(),
                items: [
                  { type: "termsOfService", agreed: data.isTermsAgreed },
                  { type: "privacyPolicy", agreed: data.isPrivacyAgreed },
                  { type: "ageOver14", agreed: data.isAgeAgreed },
                  { type: "marketing", agreed: data.isMarketingAgreed },
                ],
              },
            }),
          );
          router.replace("/");
        },
        onError: (error) => {
          // 고칠 수 있는 칸의 오류는 그 칸 아래에, 나머지는 토스트로 알린다.
          const fieldErrors: Partial<Record<ServerFieldKey, string>> = {};
          const otherMessages: string[] = [];
          Object.entries(error.fields ?? {}).forEach(([key, message]) => {
            if (!message) return;
            if (isServerFieldKey(key)) fieldErrors[key] = message;
            else otherMessages.push(message);
          });

          const hasFieldErrors = setFieldErrors(fieldErrors);
          if (otherMessages.length > 0) {
            showAppToast("error", otherMessages[0]);
          } else if (!hasFieldErrors) {
            notifyApiError(error);
          }
        },
      },
    );
  };

  return (
    <form
      id="signup-form"
      onSubmit={handleSubmit(onSubmit, (formErrors) =>
        focusFirstFieldError(formErrors, setFocus, translateText),
      )}
      className="flex w-screen max-w-112.5 flex-col gap-9 rounded-3xl border border-main bg-darker px-6 py-9"
    >
      <header className="flex flex-col gap-1.5">
        <h1 className="heading-3">{t("auth.signup.title")}</h1>
        <p className="body-5 text-font-2">{t("auth.signup.subtitle")}</p>
      </header>

      <fieldset className="flex flex-col gap-5">
        <NicknameField />
        <EmailVerifySection onVerifiedChange={setIsEmailVerified} />
        <PasswordField />
        <PasswordCheckField />
      </fieldset>

      <Agreed />

      {/* 응답이 오기 전 연타하면 회원가입 요청이 중복으로 나간다. 전송 중에는 잠근다. */}
      <ActiveButton
        text={t("auth.signup.submit")}
        type="submit"
        isActive={isFormValid}
        // 요청 중을 비활성(회색)으로만 나타내면 입력이 모자란 것과 구분되지 않는다.
        isPending={isRegistering}
      />
    </form>
  );
};

export default React.memo(SignupForm);
