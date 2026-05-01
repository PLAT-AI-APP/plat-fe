import { useAuthRegisterMutation } from "@/api/auth/authRegister";
import { useCheckNicknameQuery } from "@/api/auth/checkNickname";
import ActiveButton from "@/components/ActiveButton";
import AuthInput from "@/components/auth/AuthInput";
import { PasswordToggle } from "@/components/auth/PasswordToggle";
import { useDebounce } from "@/hooks/useDebounce";
import { useTogglePassword } from "@/hooks/useTogglePassword";
import { EMAIL_REGEX, NICKNAME_REGEX } from "@/lib/regex";
import { AuthFormValues } from "@/type/auth";
import React, { useEffect, useState } from "react";
import { Form, useFormContext, useWatch } from "react-hook-form";
import Agreed from "./Agreed";
import { cn } from "@/lib/utils";
import { useEmailVerifyMutation } from "@/api/auth/emailVerify";
import { useEmailVerifyConfirmMutation } from "@/api/auth/emailVerifyConfirm";
import { useCountdown } from "@/hooks/useCountdown";
import { motion, AnimatePresence } from "framer-motion";

const SignupForm = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");

  const { mutate: emailVerify } = useEmailVerifyMutation();
  const { mutate: emailVerifyConfirm } = useEmailVerifyConfirmMutation();

  // 카운트다운 훅 초기화 (5분 = 300초)
  const {
    timeLeft,
    startTimer,
    formatTime,
    isActive: isTimerActive,
  } = useCountdown(300);

  const {
    register,
    control,
    formState: { errors },
    setError,
    clearErrors,
    trigger,
    setValue,
  } = useFormContext<AuthFormValues>();

  const {
    email = "",
    nickname = "",
    password = "",
    passwordConfirm = "",
    isPrivacyAgreed = "",
    isTermsAgreed = "",
    otp = "",
    emailVerifyToken = "",
  } = useWatch({ control });

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
    // authRegister();
  };

  /** 이메일 인증번호 발송 요청 함수 */
  const handleRequestOtp = async () => {
    const isEmailValid = await trigger("email");
    if (!isEmailValid || !email) return;

    setValue("otp", "");
    setValue("emailVerifyToken", "");
    emailVerify(email, {
      onSuccess: (data) => {
        if (data.result === "OK") {
          setIsOtpSent(true);
          startTimer(); // 2. 인증번호 발송 성공 시 타이머 시작/재시작
        }
      },
    });
  };

  /** 입력한 OTP 코드 검증 함수 */
  const handleVerifyOtp = () => {
    // timeLeft가 0이면 인증 불가 처리
    if (timeLeft <= 0) {
      setOtpError("인증 시간이 만료되었습니다. 다시 시도해주세요.");
      return;
    }
    if (!email) {
      alert("이메일 정보가 없습니다. 다시 시도해주세요.");
      return;
    }

    emailVerifyConfirm(
      { code: String(otp) || "", email: email },
      {
        onSuccess: (data) => {
          if (data.token) setValue("emailVerifyToken", data.token);
          alert("이메일 인증 성공");
          setIsOtpSent(false);
        },
        onError: () => {
          setOtpError("인증번호가 일치하지 않습니다.");
        },
      },
    );
  };

  // const emailConfirmBtnOnClick = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   if (isOtpSent) {
  //     handleVerifyOtp();
  //   } else {
  //     handleRequestOtp();
  //   }
  // };
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
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">이메일</label>

          <div>
            <div className="flex gap-2">
              <input
                {...register("email", {
                  required: "이메일을 입력해주세요.",
                  pattern: {
                    value: EMAIL_REGEX,
                    message: "올바른 이메일 형식이 아닙니다.",
                  },
                  onChange: async () => {
                    await trigger("email");
                  },
                })}
                placeholder="example@gmail.com"
                className={cn(
                  // 기본 스타일
                  "w-full h-11 border border-border-main bg-black/20 rounded-lg px-4 py-3 text-sm text-font-1",
                  "placeholder:text-font-2/50 focus:outline-none focus:border-brand transition-all",
                  // 에러 발생 시 스타일
                  false && "border-font-accents focus:border-font-accents",
                  emailVerifyToken && "bg-card",
                )}
                disabled={Boolean(emailVerifyToken)}
              />

              <ActiveButton
                type="button"
                isActive={!!email && !errors.email}
                text={
                  isOtpSent ? "재전송" : emailVerifyToken ? "변경" : "인증요청"
                }
                className={cn(
                  "px-4 py-3 text-sm w-fit max-h-11 text-nowrap",
                  emailVerifyToken && "border border-border-main bg-bg-darker",
                )}
                onClick={(e) => (!emailVerifyToken ? handleRequestOtp() : null)}
              />
            </div>
            {errors.email?.message && (
              <span
                role="alert"
                className="pl-2 pt-1.5 text-font-accents text-xs"
              >
                {errors.email?.message}
              </span>
            )}
          </div>
        </div>

        {/* 인증번호 입력 input */}
        <AnimatePresence>
          {isOtpSent && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto" }} // gap-5.25 대신 간격 조정
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden" // 스르륵 효과를 위해 필수
            >
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">인증번호</label>
                <div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        {...register("otp", {
                          required: "인증번호를 입력해주세요",
                          maxLength: 6,
                        })}
                        maxLength={6}
                        placeholder="000000"
                        className={cn(
                          "w-full h-11 border border-border-main bg-black/20 rounded-lg px-4 py-3 text-sm text-font-1",
                          "placeholder:text-font-2/50 focus:outline-none focus:border-brand transition-all",
                          (errors.otp || otpError) &&
                            "border-font-accents focus:border-font-accents",
                        )}
                      />
                      {/* 카운트다운 표시 (input 내부 우측 정렬 예시) */}
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm">
                        {formatTime()}
                      </span>
                    </div>

                    <ActiveButton
                      type="button"
                      isActive={otp.length >= 6 && timeLeft > 0}
                      text="인증확인"
                      onClick={handleVerifyOtp}
                      className="px-4 py-3 text-sm w-fit max-h-11 text-nowrap"
                    />
                  </div>
                  {!isTimerActive && (
                    <span className="pl-2 pt-1.5 text-font-accents text-xs">
                      인증번호 유효시간 초과
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
