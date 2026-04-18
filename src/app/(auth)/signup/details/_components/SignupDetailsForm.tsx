"use client";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { UserDetailFormValues } from "@/type/auth";
import { useDebounce } from "@/hooks/useDebounce";
import { useCheckNicknameQuery } from "@/api/auth/checkNickname";
import { useAuthRegisterMutation } from "@/api/auth/authRegister";
import { BirthDateInput } from "@/components/BirthDateInput";
import ActiveButton from "@/components/ActiveButton";
import AuthBgDecoration from "@/components/auth/AuthBgDecoration";
import NicknameField from "./NicknameField";
import GenderField from "./GenderField";

interface SignupDetailsFormProps {
  signupToekn: string;
}
const SignupDetailsForm = ({ signupToekn }: SignupDetailsFormProps) => {
  const methods = useForm<UserDetailFormValues>({
    mode: "onChange",
    defaultValues: {
      nickname: "",
      gender: "",
      birthDate: "",
      signupToken: signupToekn,
    },
  });

  const {
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = methods;

  const gender = watch("gender");
  const nickname = watch("nickname");
  const birthDate = watch("birthDate");

  const debouncedNickname = useDebounce({ value: nickname, delay: 500 });
  const { data: checkData } = useCheckNicknameQuery(debouncedNickname, {
    enabled: !!debouncedNickname && !errors.nickname,
  });

  const { mutate: authRegister } = useAuthRegisterMutation();

  const onSubmit = (data: UserDetailFormValues) => {
    if (checkData?.available === false) return;
    authRegister(data);
  };

  return (
    <FormProvider {...methods}>
      <form
        id="auth-flow-form"
        onSubmit={handleSubmit(onSubmit)}
        className="relative overflow-hidden w-88 px-6 pt-6 pb-9 rounded-3xl border border-border-main bg-[#0B0E14]/60"
      >
        <AuthBgDecoration />
        <h1 className="text-center text-font-1 text-[22px] font-medium pb-9">
          정보 입력
        </h1>

        <div className="flex flex-col gap-6 pb-6">
          <NicknameField
            debouncedNickname={debouncedNickname}
            isAvailable={checkData?.available}
          />

          <GenderField />

          <BirthDateInput value={birthDate} isEditMode={true} />
        </div>

        <ActiveButton
          type="submit"
          text="가입 완료"
          isActive={Boolean(gender && nickname && birthDate)}
        />
      </form>
    </FormProvider>
  );
};

export default SignupDetailsForm;
