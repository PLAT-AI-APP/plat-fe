import { usePasswordResetMutation } from "@/api/auth/postPasswordReset";
import ActiveButton from "@/components/ActiveButton";
import PasswordCheckField from "@/components/field/PasswordCheckField";
import PasswordField from "@/components/field/PasswordField";
import { PasswordResetFormSchemaValues } from "@/schema/auth.schema";
import { useModalStore } from "@/store/useModalStore";
import React from "react";
import { Form, useFormContext, useWatch } from "react-hook-form";

const PasswordReset = () => {
  const { mutate: passwrodReset } = usePasswordResetMutation();
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

  const { closeModal } = useModalStore();
  const onSubmit = (data: PasswordResetFormSchemaValues) => {
    passwrodReset(data);
    closeModal();
  };

  return (
    <Form
      id="password-reset-form"
      control={control}
      onSubmit={({ data }) => onSubmit(data)}
      className="py-9 px-6 w-screen max-w-112.5 rounded-3xl border border-border-main bg-bg-darker"
    >
      <header className="flex flex-col gap-1.5 font-medium pb-9">
        <h1 className="heading-3">비밀번호 재설정</h1>
        <p className="body-4 text-font-2">
          이메일 인증을 통해 비밀번호를 재설정할 수 있습니다.
        </p>
      </header>

      <fieldset className="flex flex-col gap-6">
        <PasswordField />
        <PasswordCheckField />
      </fieldset>

      <ActiveButton
        isActive={isPasswordResetActive}
        text="비밀번호 변경"
        className="mt-6"
        form="password-reset-form"
      />
    </Form>
  );
};

export default PasswordReset;
