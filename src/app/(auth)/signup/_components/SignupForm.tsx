import { useAuthRegisterMutation } from "@/api/auth/authRegister";
import { useCheckNicknameQuery } from "@/api/auth/checkNickname";
import ActiveButton from "@/components/ActiveButton";
import AuthInput from "@/components/auth/AuthInput";
import { PasswordToggle } from "@/components/auth/PasswordToggle";
import { useDebounce } from "@/hooks/useDebounce";
import { useTogglePassword } from "@/hooks/useTogglePassword";
import { NICKNAME_REGEX } from "@/lib/regex";
import { AuthFormValues } from "@/type/auth";
import React, { useEffect } from "react";
import { Form, useFormContext, useWatch } from "react-hook-form";
import Agreed from "./Agreed";

interface SignupFormProps {
  onNextStep: () => void;
}
const SignupForm = ({ onNextStep }: SignupFormProps) => {
  const {
    register,
    control,
    formState: { errors },
    setError,
    clearErrors,
    trigger,
  } = useFormContext<AuthFormValues>();

  const {
    email = "",
    nickname = "",
    password = "",
    passwordConfirm = "",
    isPrivacyAgreed = "",
    isTermsAgreed = "",
  } = useWatch({ control });
  console.log(password);

  // 모든 조건이 충족되었는지 확인하는 변수
  const isFormValid =
    // 모든 필수 값이 존재함
    !!(
      email &&
      nickname &&
      password &&
      passwordConfirm &&
      isPrivacyAgreed &&
      isTermsAgreed
    ) &&
    // 현재 화면에 표시된 에러가 없음
    Object.keys(errors).length === 0 &&
    password === passwordConfirm;

  const isShowPw = useTogglePassword();
  const isShowConfirm = useTogglePassword();

  const debouncedNickname = useDebounce({ value: nickname, delay: 500 });
  const { data: checkData } = useCheckNicknameQuery(debouncedNickname, {
    enabled: !!debouncedNickname,
  });

  useEffect(() => {
    // 중복된 경우 에러 설정
    if (checkData?.available === false) {
      setError("nickname", {
        type: "manual",
        message: "이미 사용중인 닉네임입니다.",
      });
    }
    // 사용 가능한 경우 에러 제거
    else if (checkData?.available === true) {
      clearErrors("nickname");
    }
  }, [checkData, setError, clearErrors]);

  const { mutate: authRegister } = useAuthRegisterMutation();

  const onSubmit = (data: AuthFormValues) => {
    onNextStep();
  };
  return (
    <Form
      control={control}
      id="signup-form"
      onSubmit={({ data }) => onSubmit(data)}
      className="flex flex-col gap-9 py-9 px-6 w-screen max-w-112.5 rounded-3xl border border-border-main bg-bg-darker"
    >
      <header className="flex flex-col gap-1.5 font-medium">
        <h1 className="text-[22px]">회원가입</h1>
        <p className="text-sm text-font-2">
          다양한 매력을 가진 캐릭터들이 당신을 기다리고 있어요.
        </p>
      </header>

      {/* 정보입력 input 영역 */}
      <fieldset className="flex flex-col gap-5.25">
        {/* 닉네임 input */}
        <AuthInput
          id="input-nickname"
          label="닉네임"
          {...register("nickname", {
            required: "닉네임을 입력해주세요.",
            maxLength: { value: 15, message: "최대 15자까지 가능합니다." },
            minLength: { value: 2, message: "최소 2자 이상이어야 합니다." },
            pattern: {
              value: NICKNAME_REGEX,
              message: "특수문자는 사용할 수 없습니다.",
            },
          })}
          error={errors.nickname?.message}
          placeholder="2 ~ 15자 이내, 특수문자 불가"
        />

        {/* 이메일 input */}
        <AuthInput
          label="이메일"
          placeholder="example@gmail.com"
          {...register("email", {
            required: "이메일을 입력해주세요.",
          })}
        />

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

      <Agreed />

      <ActiveButton
        form="signup-form"
        type="submit"
        text="다음"
        isActive={isFormValid}
      />
    </Form>
  );
};

export default SignupForm;
