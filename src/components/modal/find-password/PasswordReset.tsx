import { usePasswordResetMutation } from "@/api/auth/postPasswordReset";
import ActiveButton from "@/components/ActiveButton";
import { PasswordToggle } from "@/components/auth/PasswordToggle";
import SmartInput from "@/components/smart-input";
import {
  FIELD_FEEDBACK_MESSAGES,
  FIELD_HELPER_MESSAGES,
} from "@/constants/fieldMessages";
import { useTogglePassword } from "@/hooks/useTogglePassword";
import { PasswordResetFormSchemaValues } from "@/schema/auth.schema";
import { useModalStore } from "@/store/useModalStore";
import React from "react";
import { Form, useFormContext, useWatch } from "react-hook-form";

const PasswordReset = () => {
  const { mutate: passwrodReset } = usePasswordResetMutation();
  const {
    register,
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

  const isShowPw = useTogglePassword();
  const isShowConfirm = useTogglePassword();

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
        <SmartInput
          label="비밀번호"
          inputType={isShowPw.inputType}
          labelFontSize="title-5"
          placeholder="8자 이상 입력해주세요"
          {...register("password")}
          error={errors.password}
          helperMessage={FIELD_HELPER_MESSAGES.password}
          rightElement={
            <PasswordToggle
              isVisible={isShowPw.isVisible}
              onToggle={isShowPw.toggle}
            />
          }
        />

        <SmartInput
          label="비밀번호 확인"
          inputType={isShowConfirm.inputType}
          labelFontSize="title-5"
          placeholder="비밀번호를 다시 입력해주세요"
          {...register("passwordCheck")}
          error={errors.passwordCheck}
          helperMessage={
            isPasswordResetActive
              ? FIELD_FEEDBACK_MESSAGES.passwordCheckValid
              : FIELD_HELPER_MESSAGES.passwordCheck
          }
          helperMessageType={isPasswordResetActive ? "success" : "default"}
          rightElement={
            <PasswordToggle
              isVisible={isShowConfirm.isVisible}
              onToggle={isShowConfirm.toggle}
            />
          }
        />
      </fieldset>

      <ActiveButton
        isActive={isPasswordResetActive}
        text="비밀번호 재설정"
        className="mt-6"
        form="password-reset-form"
      />
    </Form>
  );
};

export default PasswordReset;
