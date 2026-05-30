"use client";

import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ModalLayout } from "../ModalLayout";
import EmailAuthForm from "@/app/(auth)/find-password/_components/EmailAuthForm";
import PasswordReset from "@/app/(auth)/find-password/_components/PasswordReset";
import { PasswordResetFormValues } from "@/type/auth";
import { FindPasswordModalProps } from "@/type/modal";

const FindPasswordModal = ({ onClose, stackIndex }: FindPasswordModalProps) => {
  const [step, setStep] = useState(1);

  const methods = useForm<PasswordResetFormValues>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      email: "",
      otp: Array(6).fill(""),
      password: "",
      passwordCheck: "",
    },
  });

  const onNextStep = () => {
    setStep((prev) => prev + 1);
  };

  return (
    <ModalLayout
      onClose={onClose}
      hasBackground
      stackIndex={stackIndex}
      className="p-0 border-none bg-transparent shadow-none"
    >
      <FormProvider {...methods}>
        {step === 1 ? (
          <EmailAuthForm onNextStep={onNextStep} />
        ) : (
          <PasswordReset />
        )}
      </FormProvider>
    </ModalLayout>
  );
};

export default FindPasswordModal;
