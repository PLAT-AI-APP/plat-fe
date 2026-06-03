"use client";

import React, { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AuthFormValues } from "@/schema/auth.schema";
import { useAuthRegisterMutation } from "@/api/auth/authRegister";
import ActiveButton from "@/components/ActiveButton";
import Agreed from "./Agreed";
import EmailVerifySection from "./EmailVerifySection";
import { useFormServerError } from "@/hooks/useFormServerError";
import NicknameField from "@/components/field/NicknameField";
import PasswordField from "@/components/field/PasswordField";
import PasswordCheckField from "@/components/field/PasswordCheckField";

const SignupForm = () => {
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const {
    control,
    formState: { errors },
    handleSubmit,
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

  // 폼 유효성 검사 로직 (추가적인 커스텀 검증이 필요한 경우)
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
        onError: (error) => {
          // 서버에서 온 필드 에러들을 폼에 매핑
          setFieldErrors(error.fields);
        },
      },
    );
  };

  return (
    <form
      id="signup-form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-9 py-9 px-6 w-screen max-w-112.5 rounded-3xl border border-border-main bg-bg-darker"
    >
      <header className="flex flex-col gap-1.5 font-medium">
        <h1 className="heading-3">회원가입</h1>
        <p className="body-4 text-font-2">
          다양한 매력을 가진 캐릭터들이 당신을 기다리고 있어요.
        </p>
      </header>

      <fieldset className="flex flex-col gap-5.25">
        <NicknameField />
        <EmailVerifySection onVerifiedChange={setIsEmailVerified} />
        <PasswordField />
        <PasswordCheckField />
      </fieldset>

      <Agreed />

      <ActiveButton text="다음" type="submit" isActive={isFormValid} />
    </form>
  );
};

export default React.memo(SignupForm);
