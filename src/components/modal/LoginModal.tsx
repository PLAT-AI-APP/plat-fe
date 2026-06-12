"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { useEmailLoginMutation } from "@/api/auth/emailLogin";
import ActiveButton from "@/components/ActiveButton";
import SocialLoginButton from "@/components/auth/SocialLoginButton";
import PasswordField from "@/components/field/PasswordField";
import { ModalLayout } from "@/components/ModalLayout";
import SmartInput from "@/components/smart-input";
import { ChatFill, Google } from "@/icons";
import useRouteEffect from "@/hooks/useRouteEffect";
import { loginFormSchema, LoginFormValues } from "@/schema/auth.schema";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";
import { LoginModalProps } from "@/type/modal";

const LoginModal = ({ onClose, triggerRef }: LoginModalProps) => {
  const openModal = useModalStore((state) => state.openModal);
  const allowNextNavigation = useModalStore(
    (state) => state.allowNextNavigation,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    control,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      email: "",
      pw: "",
    },
  });

  const email = useWatch({ control, name: "email" }) ?? "";
  const pw = useWatch({ control, name: "pw" }) ?? "";

  const { mutate: emailLogin } = useEmailLoginMutation();
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);

  const onSubmit = () => {
    emailLogin(
      { username: email, password: pw },
      {
        onSuccess: () => {
          setLoggedIn(true);
        },
        onError: () => {
          setError("email", { type: "server", message: "" });
          setError("pw", { type: "server", message: "" });
        },
      },
    );
  };

  useRouteEffect(onClose);

  const handleFindPasswordClick = () => {
    openModal("FIND_PASSWORD");
  };

  const handleSocialLoginClick = (provider: "kakao" | "google") => {
    allowNextNavigation();
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_URI}/oauth2/authorization/${provider}`;
  };

  const handleSignupNavigationIntent = () => {
    allowNextNavigation();
  };

  return (
    <ModalLayout
      onClose={onClose}
      hasBackground
      triggerRef={triggerRef}
      className="w-112.5 p-6 pt-9 h-fit top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <header id="login-card-header" className="pb-9">
        <h1 id="login-welcome-title" className="heading-3 text-font-1">
          지금 로그인하고
          <br />
          모든 서비스를 경험해보세요.
        </h1>
      </header>

      <section id="login-methods-area" className="flex flex-col gap-10">
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

            <SmartInput
              id="input-email"
              label="이메일"
              inputType="email"
              labelFontSize="title-5"
              placeholder="example@gmail.com"
              {...register("email")}
              error={errors.email}
            />

            <div id="password-input-group" className="flex flex-col gap-2">
              <PasswordField
                id="input-password"
                name="pw"
                placeholder="비밀번호를 입력하세요"
                showHelperMessage={false}
              />

              <button
                id="btn-forgot-password"
                type="button"
                onClick={handleFindPasswordClick}
                className="cursor-pointer w-fit pl-1 text-font-2 body-6 hover:text-font-1 transition-colors"
              >
                비밀번호를 잊으셨나요?
              </button>
            </div>
          </fieldset>

          <ActiveButton
            id="btn-login-submit"
            text="로그인"
            type="submit"
            isActive={email.length > 0 && pw.length > 0}
            className="mt-2 h-12 rounded-lg"
          />
        </form>

        <nav
          id="social-auth-nav"
          aria-label="소셜 로그인 선택"
          className="flex flex-col gap-3"
        >
          <SocialLoginButton
            id="link-kakao-login"
            icon={<ChatFill />}
            label="카카오톡으로 시작하기"
            onClick={() => handleSocialLoginClick("kakao")}
          />
          <SocialLoginButton
            id="link-google-login"
            icon={<Google />}
            label="구글로 시작하기"
            onClick={() => handleSocialLoginClick("google")}
          />
        </nav>
      </section>

      <footer
        id="login-card-footer"
        className="flex items-center justify-center gap-3 pt-7"
      >
        <p className="body-6 text-font-2">아직 회원이 아니신가요?</p>
        <Link
          id="link-to-signup"
          href="/signup"
          onPointerDown={handleSignupNavigationIntent}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              handleSignupNavigationIntent();
            }
          }}
          onClick={onClose}
          className="title-5 text-brand hover:underline"
        >
          회원가입
        </Link>
      </footer>
    </ModalLayout>
  );
};

export default LoginModal;
