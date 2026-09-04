"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import { useAuthRegisterMutation } from "@/api/auth/authRegister";
import ActiveButton from "@/components/ActiveButton";
import NicknameField from "@/components/field/NicknameField";
import PasswordCheckField from "@/components/field/PasswordCheckField";
import PasswordField from "@/components/field/PasswordField";
import { useFormServerError } from "@/hooks/useFormServerError";
import { useTranslateText } from "@/hooks/useTranslateText";
import { showFirstFieldErrorToast } from "@/lib/formError";
import { AuthFormValues } from "@/schema/auth.schema";
import Agreed from "./Agreed";
import EmailVerifySection from "./EmailVerifySection";

const PENDING_SIGNUP_COMPLETE_DIALOG_KEY = "pending-signup-complete-dialog";

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
          });
          setIsEmailVerified(false);

          // 회원가입 완료 다이얼로그는 홈으로 이동한 뒤 열어 회원가입 화면 위에 레이어가 남지 않게 합니다.
          sessionStorage.setItem(
            PENDING_SIGNUP_COMPLETE_DIALOG_KEY,
            JSON.stringify({ nickname: data.nickname }),
          );
          router.replace("/");
        },
        onError: (error) => {
          // 서버에서 내려온 필드별 에러를 RHF 에러 상태로 매핑해 입력 필드 아래에 표시합니다.
          setFieldErrors(error.fields);
        },
      },
    );
  };

  return (
    <form
      id="signup-form"
      onSubmit={handleSubmit(onSubmit, (formErrors) =>
        showFirstFieldErrorToast(formErrors, setFocus, translateText),
      )}
      className="flex w-screen max-w-112.5 flex-col gap-9 rounded-3xl border border-main bg-darker px-6 py-9"
    >
      <header className="flex flex-col gap-1.5">
        <h1 className="heading-3">{t("auth.signup.title")}</h1>
        <p className="body-4 text-font-2">{t("auth.signup.subtitle")}</p>
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
        disabled={!isFormValid || isRegistering}
      />
    </form>
  );
};

export default React.memo(SignupForm);
