"use client";
import { useState } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import AuthLayout from "./AuthLayout";
import { AuthFormValues } from "@/type/auth";
import EmailOtpStep from "./EmailOtpStep";
import PasswordStep from "./PasswordStep";
import InfoStep from "./InfoStep";
import AuthBgDecoration from "./AuthBgDecoration";

interface AuthFlowProps {
  type: "SIGNUP" | "RESET_PASSWORD";
}

// 설정값 정립 (버튼 텍스트 등을 더 명확하게 분리)
const FLOW_CONFIG = {
  SIGNUP: {
    titles: ["회원가입", "비밀번호 설정", "회원가입"],
    buttons: ["다음으로", "다음으로", "회원가입 완료"],
  },
  RESET_PASSWORD: {
    titles: ["이메일 인증", "비밀번호 재설정"],
    buttons: ["다음으로", "비밀번호 변경"],
  },
};

export const AuthFlow = ({ type }: AuthFlowProps) => {
  const [step, setStep] = useState(1); // 1단계부터 시작
  const config = FLOW_CONFIG[type];

  // Form Methods 초기화
  const methods = useForm<AuthFormValues>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      email: "",
      otp: Array(6).fill(""),
      password: "",
      passwordConfirm: "",
      nickname: "",
      gender: "",
      birthdate: "",
    },
  });

  const { handleSubmit, control } = methods;

  // 데이터 통합 감시 (한 번의 useWatch로 정리)
  const formValues = useWatch({ control });
  const { nickname, gender, birthdate } = formValues;

  const isStep3Valid = !!nickname && !!gender && !!birthdate;

  const onSubmit = async (data: AuthFormValues) => {
    if (step === 1) setStep(2);
    else if (step === 2) {
      if (type === "SIGNUP") setStep(3);
      else console.log("비밀번호 재설정 완료:", data);
    } else if (step === 3) {
      console.log("회원가입 최종 완료:", data);
    }
  };

  return (
    <AuthLayout>
      {/* FormProvider로 하위 컴포넌트에 Context 제공 */}
      <FormProvider {...methods}>
        <form
          id="auth-flow-form"
          onSubmit={handleSubmit(onSubmit)}
          className="relative overflow-hidden w-88 px-6 pt-6 pb-9 rounded-3xl border border-border-main bg-[#0B0E14]/60"
        >
          <AuthBgDecoration />

          {step === 1 && <EmailOtpStep title={config.titles[0]} />}

          {step === 2 && (
            <PasswordStep
              title={config.titles[1]}
              buttonText={config.buttons[1]}
            />
          )}

          {step === 3 && type === "SIGNUP" && (
            <InfoStep
              title={config.titles[2]}
              buttonText={config.buttons[2]}
              isValid={isStep3Valid || false}
            />
          )}
        </form>
      </FormProvider>
    </AuthLayout>
  );
};
