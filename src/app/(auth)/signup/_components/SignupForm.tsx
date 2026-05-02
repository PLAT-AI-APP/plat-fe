"use client";

import React from "react";
import { Form, useFormContext, useWatch } from "react-hook-form";
import { AuthFormValues } from "@/type/auth";
import { useAuthRegisterMutation } from "@/api/auth/authRegister";
import ActiveButton from "@/components/ActiveButton";
import Agreed from "./Agreed";
import NicknameField from "./NicknameField";
import EmailVerifySection from "./EmailVerifySection";
import PasswordFields from "./PasswordFields";
import { useFormServerError } from "@/hooks/useFormServerError";

const SignupForm = () => {
  const {
    control,
    formState: { errors, isValid },
  } = useFormContext<AuthFormValues>();

  const {
    nickname = "",
    email = "",
    password = "",
    passwordCheck = "",
    isPrivacyAgreed = "",
    isTermsAgreed = "",
    emailVerifyToken = "",
    otp = "",
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
      emailVerifyToken
    ) &&
    Object.keys(errors).length === 0 &&
    password === passwordCheck;

  const { mutate: authRegister } = useAuthRegisterMutation();

  const { setFieldErrors } = useFormServerError<AuthFormValues>();
  const onSubmit = (data: AuthFormValues) => {
    authRegister(
      {
        email,
        code: String(otp),
        nickname,
        password,
        passwordCheck,
      },
      {
        onError: (error) => {
          setFieldErrors(error.fields);
        },
      },
    );
  };

  return (
    <Form
      control={control}
      id="signup-form"
      onSubmit={({ data }) => onSubmit(data)}
      className="flex flex-col gap-9 py-9 px-6 w-screen max-w-112.5 rounded-3xl border border-border-main bg-bg-darker"
    >
      <header className="flex flex-col gap-1.5 font-medium">
        <h1 className="text-[22px]">회원가입</h1>
        <p className="text-sm text-font-2">
          다양한 매력을 가진 캐릭터들이 당신을 기다리고 있어요.
        </p>
      </header>

      <fieldset className="flex flex-col gap-5.25">
        <NicknameField />
        <EmailVerifySection />
        <PasswordFields />
      </fieldset>

      <Agreed />

      <ActiveButton
        form="signup-form"
        type="submit"
        text="다음"
        isActive={isFormValid}
      />
    </Form>
  );
};

export default React.memo(SignupForm);
