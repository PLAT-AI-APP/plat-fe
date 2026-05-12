"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AuthFormValues } from "@/type/auth";
import SignupForm from "./_components/SignupForm";

const SignupPage = () => {
  const methods = useForm<AuthFormValues>({
    mode: "onChange", // 인터랙티브한 반응을 위해 onChange 권장
    reValidateMode: "onChange",
    defaultValues: {
      nickname: "",
      email: "",
      code: "",
      password: "",
      passwordCheck: "",
      // emailVerifyToken: "",
      signupToken: "",
      isPrivacyAgreed: false,
      isTermsAgreed: false,
    },
  });

  return (
    <FormProvider {...methods}>
      <SignupForm />
    </FormProvider>
  );
};

export default SignupPage;
