"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import { useAuthRegisterMutation } from "@/api/auth/authRegister";
import ActiveButton from "@/components/ActiveButton";
import NicknameField from "@/components/field/NicknameField";
import PasswordCheckField from "@/components/field/PasswordCheckField";
import PasswordField from "@/components/field/PasswordField";
import { useFormServerError } from "@/hooks/useFormServerError";
import { AuthFormValues } from "@/schema/auth.schema";
import { useDialogStore } from "@/store/useDialogStore";
import { useModalStore } from "@/store/useModalStore";
import Agreed from "./Agreed";
import EmailVerifySection from "./EmailVerifySection";

const SignupForm = () => {
  const t = useTranslations();
  const openModal = useModalStore((state) => state.openModal);
  const openDialog = useDialogStore((state) => state.openDialog);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
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

  const { mutate: authRegister } = useAuthRegisterMutation();
  const { setFieldErrors } = useFormServerError<AuthFormValues>();

  const handleLoginAfterSignup = () => {
    // 회원가입 직후에는 같은 화면 위에서 바로 로그인 모달을 열어 다음 행동을 자연스럽게 이어갑니다.
    openModal("LOGIN", { triggerRef: undefined });
  };

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

          openDialog("SIGNUP_COMPLETE", {
            nickname: data.nickname,
            onLogin: handleLoginAfterSignup,
          });
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
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-screen max-w-112.5 flex-col gap-9 rounded-3xl border border-border-main bg-bg-darker px-6 py-9"
    >
      <header className="flex flex-col gap-1.5 font-medium">
        <h1 className="heading-3">{t("auth.signup.title")}</h1>
        <p className="body-4 text-font-2">{t("auth.signup.subtitle")}</p>
      </header>

      <fieldset className="flex flex-col gap-5.25">
        <NicknameField />
        <EmailVerifySection onVerifiedChange={setIsEmailVerified} />
        <PasswordField />
        <PasswordCheckField />
      </fieldset>

      <Agreed />

      <ActiveButton text={t("auth.signup.submit")} type="submit" isActive={isFormValid} />
    </form>
  );
};

export default React.memo(SignupForm);
