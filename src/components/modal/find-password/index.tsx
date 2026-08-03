"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import EmailVerifySection from "@/app/(auth)/signup/_components/EmailVerifySection";
import ActiveButton from "@/components/ActiveButton";
import { ModalLayout } from "@/components/ModalLayout";
import {
  passwordResetFormSchema,
  PasswordResetFormSchemaValues,
} from "@/schema/auth.schema";
import { FindPasswordModalProps } from "@/type/modal";
import PasswordReset from "./PasswordReset";

const FindPasswordModal = ({ onClose, stackIndex }: FindPasswordModalProps) => {
  const t = useTranslations("modalUi.passwordReset");
  const [step, setStep] = useState(1);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

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
    if (!isEmailVerified) return;
    setStep((prev) => prev + 1);
  };

  return (
    <ModalLayout
      onClose={onClose}
      hasBackground
      stackIndex={stackIndex}
      className="border-none bg-transparent p-0 shadow-none"
    >
      <FormProvider {...methods}>
        {step === 1 ? (
          <section className="w-screen max-w-97 rounded-3xl border border-border-main bg-bg-darker px-6 py-9">
            <header className="flex flex-col gap-1.5 pb-9">
              <h1 className="heading-3">{t("title")}</h1>
              <p className="body-4 text-font-2">{t("description")}</p>
            </header>

            <EmailVerifySection
              onVerifiedChange={(isVerified) => {
                setIsEmailVerified(isVerified);
              }}
            />

            <ActiveButton
              type="button"
              text={t("next")}
              isActive={isEmailVerified}
              onClick={onNextStep}
              className="mt-9 h-[45px] rounded-xl"
              textClassName="title-5"
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
