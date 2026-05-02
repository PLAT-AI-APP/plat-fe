"use client";
import { PasswordResetFormValues } from "@/type/auth";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import EmailAuthForm from "./_components/EmailAuthForm";
import PasswordReset from "./_components/PasswordReset";

const FindPasswordPage = () => {
  const [step, setStep] = useState(2);

  const onNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const methods = useForm<PasswordResetFormValues>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      email: "",
      otp: Array(6).fill(""),
      password: "",
      passwordCheck: "",
      emailVerifyToken: "",
    },
  });
  return (
    <FormProvider {...methods}>
      {step === 1 ? (
        <EmailAuthForm onNextStep={onNextStep} />
      ) : (
        <PasswordReset />
      )}
    </FormProvider>
  );
};

export default FindPasswordPage;
