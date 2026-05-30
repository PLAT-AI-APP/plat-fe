import ActiveButton from "@/components/ActiveButton";
import { PasswordToggle } from "@/components/auth/PasswordToggle";
import SmartInput from "@/components/smart-input";
import { useTogglePassword } from "@/hooks/useTogglePassword";
import { PasswordResetFormValues } from "@/type/auth";
import React from "react";
import { Form, useFormContext, useWatch } from "react-hook-form";

const PasswordReset = () => {
  const {
    register,
    control,
    trigger,
    formState: { errors },
  } = useFormContext<PasswordResetFormValues>();

  const password = useWatch({ control, name: "password" });

  const isShowPw = useTogglePassword();
  const isShowConfirm = useTogglePassword();

  const onSubmit = (data: PasswordResetFormValues) => {
    console.log(data);
  };

  return (
    <Form
      id="password-reset-form"
      control={control}
      onSubmit={({ data }) => onSubmit(data)}
      className="py-9 px-6 w-screen max-w-112.5 rounded-3xl border border-border-main bg-bg-darker"
    >
      <header className="flex flex-col gap-1.5 font-medium pb-9">
        <h1 className="text-[22px]">비밀번호 재설정</h1>
      </header>

      <fieldset className="flex flex-col gap-6">
        <SmartInput
          label="비밀번호"
          inputType={isShowPw.inputType}
          labelFontSize="title-5"
          placeholder="8자 이상 입력해주세요"
          {...register("password", {
            required: "비밀번호를 입력해주세요.",
            minLength: { value: 8, message: "최소 8자 이상이어야 합니다." },
          })}
          error={errors.password}
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
          {...register("passwordCheck", {
            required: "비밀번호 확인이 필요합니다.",
            validate: (value) =>
              value === password || "비밀번호가 일치하지 않습니다.",
            onChange: async () => {
              await trigger("passwordCheck");
            },
          })}
          error={errors.passwordCheck}
          rightElement={
            <PasswordToggle
              isVisible={isShowConfirm.isVisible}
              onToggle={isShowConfirm.toggle}
            />
          }
        />
      </fieldset>

      <ActiveButton
        isActive
        text="비밀번호 재설정"
        className="mt-6"
        form="password-reset-form"
      />
    </Form>
  );
};

export default PasswordReset;
