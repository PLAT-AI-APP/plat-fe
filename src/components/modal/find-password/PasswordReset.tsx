import { useTranslations } from "next-intl";
import React from "react";
import { Form, useFormContext, useWatch } from "react-hook-form";
import { usePasswordResetMutation } from "@/api/auth/postPasswordReset";
import ActiveButton from "@/components/ActiveButton";
import PasswordCheckField from "@/components/field/PasswordCheckField";
import PasswordField from "@/components/field/PasswordField";
import { PasswordResetFormSchemaValues } from "@/schema/auth.schema";
import { useModalStore } from "@/store/useModalStore";

const PasswordReset = () => {
  const t = useTranslations("modalUi.passwordReset");
  const { mutate: passwrodReset, isPending: isResetting } =
    usePasswordResetMutation();
  const {
    control,
    formState: { errors },
  } = useFormContext<PasswordResetFormSchemaValues>();

  const password = useWatch({
    control,
    name: "password",
  });

  const passwordCheck = useWatch({
    control,
    name: "passwordCheck",
  });

  const isPasswordResetActive =
    !!password &&
    !!passwordCheck &&
    !errors.password &&
    !errors.passwordCheck &&
    password === passwordCheck;

  const closeModal = useModalStore((state) => state.closeModal);
  const onSubmit = (data: PasswordResetFormSchemaValues) => {
    passwrodReset(data);
    closeModal();
  };

  return (
    <Form
      id="password-reset-form"
      control={control}
      onSubmit={({ data }) => onSubmit(data)}
      className="w-screen max-w-112.5 rounded-3xl border border-main bg-darker px-6 py-9"
    >
      <header className="flex flex-col gap-1.5 pb-9">
        <h2 className="heading-3">{t("title")}</h2>
        <p className="body-5 text-font-2">{t("description")}</p>
      </header>

      <fieldset className="flex flex-col gap-6">
        <PasswordField />
        <PasswordCheckField />
      </fieldset>

      <ActiveButton
        isActive={isPasswordResetActive}
        disabled={!isPasswordResetActive || isResetting}
        text={t("submit")}
        className="mt-6"
        type="submit"
        form="password-reset-form"
      />
    </Form>
  );
};

export default PasswordReset;
