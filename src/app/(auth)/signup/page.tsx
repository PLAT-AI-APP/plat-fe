"use client";
import { AuthFormValues } from "@/type/auth";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import SignupForm from "./_components/SignupForm";
import EmailAuthForm from "./_components/EmailAuthForm";

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const onBack = () => {
    setStep(1);
  };
  const onNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const methods = useForm<AuthFormValues>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      nickname: "",
      email: "",
      otp: Array(6).fill(""),
      password: "",
      passwordConfirm: "",

      emailVerifyToken: "",
      signupToken: "",

      isPrivacyAgreed: false,
      isTermsAgreed: false,
    },
  });
  return (
    <FormProvider {...methods}>
      {step === 1 ? (
        <SignupForm onNextStep={onNextStep} />
      ) : (
        <EmailAuthForm onBack={onBack} />
      )}
    </FormProvider>
  );
};

export default SignupPage;
