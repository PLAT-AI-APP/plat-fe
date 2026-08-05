"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import React from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import {
  LoginToastSize,
  LoginToastType,
  useEmailLoginMutation,
} from "@/api/auth/emailLogin";
import ActiveButton from "@/components/ActiveButton";
import SocialLoginButton from "@/components/auth/SocialLoginButton";
import PasswordField from "@/components/field/PasswordField";
import { ModalLayout } from "@/components/ModalLayout";
import SmartInput from "@/components/smart-input";
import { ChatFill, Google } from "@/icons";
import useRouteEffect from "@/hooks/useRouteEffect";
import { showAppToast } from "@/lib/toast";
import { loginFormSchema, LoginFormValues } from "@/schema/auth.schema";
import { useModalStore } from "@/store/useModalStore";
import { LoginModalProps } from "@/type/modal";
import { PENDING_WELCOME_CREDIT_DIALOG_KEY } from "@/constants/auth";

const showLoginToast = (
  toastType: LoginToastType | undefined,
  toastSize: LoginToastSize | undefined,
  message: string,
  description?: string,
) => {
  // MSW 로그인 toast 테스트 계정처럼 서버가 타입을 내려준 경우에만 디자인 확인용 toast를 띄웁니다.
  if (!toastType || !message) return;

  showAppToast(toastType, message, { description, size: toastSize });
};

const LoginModal = ({ onClose, triggerRef }: LoginModalProps) => {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const openModal = useModalStore((state) => state.openModal);
  const allowNextNavigation = useModalStore(
    (state) => state.allowNextNavigation,
  );

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      email: "",
      pw: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    control,
  } = methods;

  const email = useWatch({ control, name: "email" }) ?? "";
  const pw = useWatch({ control, name: "pw" }) ?? "";

  const { mutate: emailLogin, isPending: isEmailLoginPending } =
    useEmailLoginMutation();

  const handleLoginSuccess = () => {
    // 회원가입 화면에서만 홈으로 보내고, 그 외에는 현재 경로 위에서 인증 상태만 갱신합니다.
    if (pathname === "/signup") {
      // 로그인 성공 후의 의도된 이동은 모달 네비게이션 가드가 막지 않도록 한 번 허용합니다.
      allowNextNavigation();
      onClose();
      router.replace("/");
      return;
    }

    onClose();
  };

  const handleFirstLoginSuccess = () => {
    if (typeof window !== "undefined") {
      // 홈에 도착한 뒤 웰컴 다이얼로그를 한 번만 열 수 있도록 대기 상태를 저장합니다.
      sessionStorage.setItem(PENDING_WELCOME_CREDIT_DIALOG_KEY, "true");
    }

    // 첫 로그인 보상 플로우의 홈 이동도 모달 가드 예외로 통과시킵니다.
    allowNextNavigation();
    onClose();
    router.replace("/");
  };

  const onSubmit = () => {
    // 로그인 요청이 진행 중일 때는 추가 submit을 막아 이전 요청이 취소된 것처럼 보이는 중복 호출을 방지합니다.
    if (isEmailLoginPending) return;

    // 이전 로그인 실패에서 남은 서버 에러 border를 새 요청 전에 초기화
    clearErrors(["email", "pw"]);

    emailLogin(
      { username: email, password: pw },
      {
        onSuccess: (data) => {
          clearErrors(["email", "pw"]);
          showLoginToast(
            data.toastType,
            data.toastSize,
            data.toastMessage ?? "",
            data.toastDescription,
          );

          if (data.isFirstLogin) {
            handleFirstLoginSuccess();
            return;
          }

          handleLoginSuccess();
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
    <FormProvider {...methods}>
      {/* PasswordField는 useFormContext를 사용하므로 로그인 폼도 RHF 컨텍스트 안에서 렌더링합니다. */}
      <ModalLayout
        onClose={onClose}
        hasBackground
        triggerRef={triggerRef}
        className="left-1/2 top-1/2 h-fit w-112.5 -translate-x-1/2 -translate-y-1/2 p-6 pt-9"
      >
        <header id="login-card-header" className="pb-9">
          <h1
            id="login-welcome-title"
            className="heading-3 whitespace-pre-line text-font-1"
          >
            {t("auth.login.title")}
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
              className="m-0 flex flex-col gap-4 border-none p-0"
            >
              <legend className="sr-only">{t("auth.login.submit")}</legend>

              <SmartInput
                id="input-email"
                label="auth.login.emailLabel"
                inputType="email"
                labelFontSize="title-5"
                placeholder="auth.login.emailPlaceholder"
                {...register("email")}
                // 로그인 모달은 에러 문구 없이 보더로만 실패 상태를 표현합니다.
                error={errors.email ? "" : undefined}
              />

              <div id="password-input-group" className="flex flex-col gap-2">
                <PasswordField
                  id="input-password"
                  name="pw"
                  label="auth.login.passwordLabel"
                  placeholder="auth.login.passwordPlaceholder"
                  showHelperMessage={false}
                  hideErrorMessage
                />

                <button
                  id="btn-forgot-password"
                  type="button"
                  onClick={handleFindPasswordClick}
                  className="body-6 w-fit cursor-pointer pl-1 text-font-2 transition-colors hover:text-font-1"
                >
                  {t("auth.login.forgotPassword")}
                </button>
              </div>
            </fieldset>

            <ActiveButton
              id="btn-login-submit"
              text={t("auth.login.submit")}
              type="submit"
              isActive={email.length > 0 && pw.length > 0 && !isEmailLoginPending}
              className="mt-2 h-12 rounded-lg"
            />
          </form>

          <nav
            id="social-auth-nav"
            aria-label={t("auth.login.submit")}
            className="flex flex-col gap-3"
          >
            <SocialLoginButton
              id="link-kakao-login"
              icon={<ChatFill />}
              label={t("auth.login.socialKakao")}
              onClick={() => handleSocialLoginClick("kakao")}
            />
            <SocialLoginButton
              id="link-google-login"
              icon={<Google />}
              label={t("auth.login.socialGoogle")}
              onClick={() => handleSocialLoginClick("google")}
            />
          </nav>
        </section>

        <footer
          id="login-card-footer"
          className="flex items-center justify-center gap-3 pt-7"
        >
          <p className="body-6 text-font-2">{t("auth.login.signupPrompt")}</p>
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
            {t("auth.login.signupAction")}
          </Link>
        </footer>
      </ModalLayout>
    </FormProvider>
  );
};

export default LoginModal;
