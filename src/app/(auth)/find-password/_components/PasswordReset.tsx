import ActiveButton from "@/components/ActiveButton";
import AuthInput from "@/components/auth/AuthInput";
import { PasswordToggle } from "@/components/auth/PasswordToggle";
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

  const onsubmit = (data: PasswordResetFormValues) => {
    console.log(data);
  };
  return (
    <Form
      id="password-reset-form"
      control={control}
      onSubmit={({ data }) => onsubmit(data)}
      className="py-9 px-6 w-screen max-w-112.5 rounded-3xl border border-border-main bg-bg-darker"
    >
      <header className="flex flex-col gap-1.5 font-medium pb-9">
        <h1 className="text-[22px]">비밀번호 재설정</h1>
      </header>

      <fieldset className="flex flex-col gap-6">
        {/* 비밀번호 input */}
        <AuthInput
          label="비밀번호"
          type={isShowPw.inputType}
          placeholder="8자 이상 입력해주세요"
          {...register("password", {
            required: "비밀번호를 입력해주세요.",
            minLength: { value: 8, message: "최소 8자 이상이어야 합니다." },
          })}
          rightElement={
            <PasswordToggle
              isVisible={isShowPw.isVisible}
              onToggle={isShowPw.toggle}
            />
          }
        />
        {/* 비밀번호 확인 input */}
        <AuthInput
          label="비밀번호 확인"
          type={isShowConfirm.inputType}
          placeholder="비밀번호를 다시 입력해주세요"
          {...register("passwordConfirm", {
            required: "비밀번호 확인이 필요합니다.",
            validate: (value) =>
              value === password || "비밀번호가 일치하지 않습니다.",
            onChange: async () => {
              await trigger("passwordConfirm");
            },
          })}
          error={errors.passwordConfirm?.message}
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
        form={"password-reset-form"}
      />
    </Form>
  );
};

export default PasswordReset;
