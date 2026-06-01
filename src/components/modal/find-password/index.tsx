"use client";

import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import PasswordReset from "./PasswordReset";
import { FindPasswordModalProps } from "@/type/modal";
import { ModalLayout } from "@/components/ModalLayout";
import EmailVerifySection from "@/app/(auth)/signup/_components/EmailVerifySection";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  passwordResetFormSchema,
  PasswordResetFormSchemaValues,
} from "@/schema/auth.schema";

const FindPasswordModal = ({ onClose, stackIndex }: FindPasswordModalProps) => {
  const [step, setStep] = useState(1);

  const methods = useForm<PasswordResetFormSchemaValues>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(passwordResetFormSchema),
    defaultValues: {
      email: "",
      code: "",
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
          <section className="py-9 px-6 w-screen max-w-97 rounded-3xl border border-border-main bg-bg-darker">
            <header className="flex flex-col gap-1.5 pb-9">
              <h1 className="heading-3">비밀번호 재설정</h1>
              <p className="text-font-2 body-4">
                이메일 인증을 통해 비밀번호를 재설정할 수 있습니다.
              </p>
            </header>
            <EmailVerifySection
              onVerifiedChange={(isVerified) => {
                if (isVerified) onNextStep();
              }}
            />
          </section>
        ) : (
          <PasswordReset />
        )}
      </FormProvider>
    </ModalLayout>
  );
};

export default FindPasswordModal;
