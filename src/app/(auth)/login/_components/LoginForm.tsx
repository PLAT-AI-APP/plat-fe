"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEmailLoginMutation } from "@/api/auth/emailLogin";
import { useAuthStore } from "@/store/useAuthStore";
import { useTogglePassword } from "@/hooks/useTogglePassword";
import { EMAIL_REGEX } from "@/lib/regex";
import { ChatFill, Google } from "@/icons";
import AuthInput from "@/components/auth/AuthInput";
import { PasswordToggle } from "@/components/auth/PasswordToggle";
import ActiveButton from "@/components/ActiveButton";
import SocialLoginButton from "@/components/auth/SocialLoginButton";
import AuthBgDecoration from "@/components/auth/AuthBgDecoration";

const LoginForm = () => {
  const router = useRouter();
  const isShowPw = useTogglePassword();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      email: "",
      pw: "",
    },
  });

  const email = watch("email");
  const pw = watch("pw");

  const { mutate: emailLogin } = useEmailLoginMutation();
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);

  const onSubmit = () => {
    emailLogin(
      { email, password: pw },
      {
        onSuccess: () => {
          setLoggedIn(true);
          router.push("/");
        },
      },
    );
  };

  return (
    <div
      id="login-card-container"
      className="overflow-hidden relative w-full max-w-112.5 p-8 pt-10 flex flex-col rounded-3xl border border-border-main bg-[#0B0E14]/60"
    >
      <AuthBgDecoration />

      {/* 헤더: 로그인의 목적과 제목 정의 */}
      <header id="login-card-header" className="pb-9">
        <h1
          id="login-welcome-title"
          className="font-medium text-[22px] text-font-1"
        >
          지금 로그인하고 <br />
          모든 서비스를 경험해보세요.
        </h1>
      </header>

      {/* 본문: 로그인 수단들을 모아놓은 메인 섹션 */}
      <section id="login-methods-area" className="flex flex-col gap-10">
        {/* 이메일 로그인 폼 */}
        <form
          id="email-auth-form"
          className="flex flex-col gap-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset
            id="login-input-fields"
            className="flex flex-col gap-4 border-none p-0 m-0"
          >
            <legend className="sr-only">이메일 및 비밀번호 입력</legend>

            <AuthInput
              id="input-email"
              label="이메일"
              type="email"
              placeholder="example@gmail.com"
              {...register("email", {
                required: "이메일을 입력해주세요.",
                pattern: {
                  value: EMAIL_REGEX,
                  message: "올바른 이메일 형식이 아닙니다.",
                },
              })}
              error={errors.email?.message}
            />

            <div id="password-input-group" className="flex flex-col gap-2">
              <AuthInput
                id="input-password"
                label="비밀번호"
                type={isShowPw.inputType}
                placeholder="비밀번호를 입력하세요"
                className="pr-9"
                rightElement={
                  <PasswordToggle
                    isVisible={isShowPw.isVisible}
                    onToggle={isShowPw.toggle}
                  />
                }
                {...register("pw", {
                  required: "비밀번호를 입력해주세요.",
                  minLength: {
                    value: 8,
                    message: "최소 8자 이상이어야 합니다.",
                  },
                })}
                error={errors.pw?.message}
              />

              {/* 비밀번호 재설정 page 이동 link */}
              <Link
                id="btn-forgot-password"
                href={"find-password"}
                className="cursor-pointer w-fit pl-1 text-font-2 text-xs hover:text-font-1 transition-colors"
              >
                비밀번호를 잊으셨나요?
              </Link>
            </div>
          </fieldset>

          <ActiveButton
            id="btn-login-submit"
            text="로그인"
            type="submit"
            isActive={email.length > 0 && pw.length > 0}
            className="mt-2 h-12 font-semibold rounded-lg"
          />
        </form>
        {/* 소셜 로그인 섹션 */}
        <nav
          id="social-auth-nav"
          aria-label="소셜 로그인 선택"
          className="flex flex-col gap-3"
        >
          <SocialLoginButton
            id="link-google-login"
            icon={<Google />}
            label="구글로 시작하기"
          />
          <SocialLoginButton
            id="link-kakao-login"
            icon={<ChatFill />}
            label="카카오톡으로 시작하기"
          />
        </nav>
      </section>

      {/* 서비스 가입 유도 및 기타 링크 */}
      <footer
        id="login-card-footer"
        className="flex items-center justify-center gap-3 pt-7"
      >
        <p className="text-xs text-font-2">아직 회원이 아니신가요?</p>
        <Link
          id="link-to-signup"
          href="/signup"
          className="text-sm text-brand font-semibold hover:underline"
        >
          회원가입
        </Link>
      </footer>
    </div>
  );
};

export default LoginForm;
