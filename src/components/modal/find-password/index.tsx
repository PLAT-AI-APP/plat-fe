"use client";

import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import EmailAuthForm from "./EmailAuthForm";
import PasswordReset from "./PasswordReset";
import { PasswordResetFormValues } from "@/type/auth";
import { FindPasswordModalProps } from "@/type/modal";
import { ModalLayout } from "@/components/ModalLayout";

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
