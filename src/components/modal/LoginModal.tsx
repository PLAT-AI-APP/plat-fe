"use client";
import React from "react";
import SocialLoginButton from "../auth/SocialLoginButton";
import { ChatFill, Google } from "@/icons";
import Link from "next/link";
import ActiveButton from "../ActiveButton";
import { PasswordToggle } from "../auth/PasswordToggle";
import SmartInput from "../smart-input";
import { useTogglePassword } from "@/hooks/useTogglePassword";
import { useForm } from "react-hook-form";
import { useEmailLoginMutation } from "@/api/auth/emailLogin";
import { useAuthStore } from "@/store/useAuthStore";
import { ModalLayout } from "../ModalLayout";
import useRouteEffect from "@/hooks/useRouteEffect";
import { useModalStore } from "@/store/useModalStore";

import { LoginModalProps } from "@/type/modal";
import { loginFormSchema, LoginFormValues } from "@/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";

const LoginModal = ({ onClose, triggerRef }: LoginModalProps) => {
  const isShowPw = useTogglePassword();
  const openModal = useModalStore((state) => state.openModal);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
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
      { username: email, password: pw },
      {
        onSuccess: () => {
          setLoggedIn(true);
          // router.push("/");
        },
        onError: (err) => {
          console.log(err);

          // 2. 서버 에러 메시지를 'pw' 또는 'email' 필드의 에러로 전달합니다.
          // 일반적으로 로그인 실패는 보안상 이메일/비밀번호 중 무엇이 틀렸는지 모호하게 표현하므로
          // 아래 비밀번호 인풋 하단에 에러를 노출시키는 것이 UI 안정성에 좋습니다.
          setError("pw", {
            type: "server",
            message: err.message || "이메일 또는 비밀번호를 다시 확인해주세요.",
          });

          // 만약 이메일 인풋 쪽에 에러를 띄우고 싶다면 아래 주석을 해제하세요.
          setError("email", { type: "server", message: "" });
        },
      },
    );
  };

  useRouteEffect(onClose);

  const handleFindPasswordClick = () => {
    openModal("FIND_PASSWORD");
  };

  return (
    <ModalLayout
      onClose={onClose}
      hasBackground
      triggerRef={triggerRef}
      className="w-112.5 p-6 pt-9 h-fit top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      {/* 헤더: 로그인의 목적과 제목 정의 */}
      <header id="login-card-header" className="pb-9">
        <h1 id="login-welcome-title" className="heading-3 text-font-1">
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
              <SmartInput
                id="input-password"
                label="비밀번호"
                inputType={isShowPw.inputType}
                labelFontSize="title-5"
                placeholder="비밀번호를 입력하세요"
                rightElement={
                  <PasswordToggle
                    isVisible={isShowPw.isVisible}
                    onToggle={isShowPw.toggle}
                  />
                }
                {...register("pw")}
                error={errors.pw}
              />

              {/* 비밀번호 재설정 page 이동 link */}
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
        {/* 소셜 로그인 섹션 */}
        <nav
          id="social-auth-nav"
          aria-label="소셜 로그인 선택"
          className="flex flex-col gap-3"
        >
          <SocialLoginButton
            id="link-kakao-login"
            icon={<ChatFill />}
            label="카카오톡으로 시작하기"
            onClick={() =>
              (window.location.href = `${process.env.NEXT_PUBLIC_BASE_URI}/oauth2/authorization/kakao`)
            }
          />
          <SocialLoginButton
            id="link-google-login"
            icon={<Google />}
            label="구글로 시작하기"
            onClick={() =>
              (window.location.href = `${process.env.NEXT_PUBLIC_BASE_URI}/oauth2/authorization/google`)
            }
          />
        </nav>
      </section>

      {/* 서비스 가입 유도 및 기타 링크 */}
      <footer
        id="login-card-footer"
        className="flex items-center justify-center gap-3 pt-7"
      >
        <p className="body-6 text-font-2">아직 회원이 아니신가요?</p>
        <Link
          id="link-to-signup"
          href="/signup"
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
