"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import ButtonLink from "@/components/ui/ButtonLink";
import { SOCIAL_LOGIN_PROVIDER_KEY } from "@/constants/auth";
import {
  useSocialLogin,
  type SocialLoginProvider,
} from "@/hooks/auth/useSocialLogin";
import { useMinimumDisplay } from "@/hooks/common/useMinimumDisplay";
import { useModalStore } from "@/store/useModalStore";
import AuthProcessing, { MIN_PROCESSING_MS } from "./AuthProcessing";

const PROVIDERS: SocialLoginProvider[] = ["kakao", "google"];

const readProvider = (): SocialLoginProvider | null => {
  try {
    const saved = sessionStorage.getItem(SOCIAL_LOGIN_PROVIDER_KEY);
    return PROVIDERS.find((provider) => provider === saved) ?? null;
  } catch {
    return null;
  }
};

const subscribeNothing = () => () => {};

/**
 * 서버가 `?error=` 로 보내는 메시지 키 → 번역 키. 주소에 실린 값은 누구나 바꿀 수 있어 문구로 그대로 보이지 않는다 —
 * 아는 키만 번역하고 나머지는 일반 실패 문구로 보인다.
 */
const ERROR_REASONS = {
  "auth.social.error.accessDenied": "accessDenied",
  "auth.social.error.codeExpired": "codeExpired",
  "auth.social.error.failed": "failed",
  "auth.error.accountLocked": "accountLocked",
  "auth.error.accountSuspended": "accountSuspended",
  "auth.error.accountBanned": "accountBanned",
  "auth.error.accountWithdrawn": "accountWithdrawn",
  "agreement.error.required": "agreementRequired",
  "email.error.rejoinRestricted": "rejoinRestricted",
  // 관리자가 신규 가입을 잠시 막았다. 기존 회원 로그인은 그대로다.
  "auth.signup.error.paused": "signupPaused",
  // 처음 소셜 가입인데 같은 이메일이 다른 방법(이메일·다른 소셜)으로 이미 가입돼 있거나, 제공사가 이메일을 주지 않았다.
  "email.error.unavailable": "emailUnavailable",
  "email.error.required": "emailRequired",
  "error.internal": "internal",
} as const;

type ErrorReason = (typeof ERROR_REASONS)[keyof typeof ERROR_REASONS];

const reasonOf = (errorKey: string): ErrorReason =>
  Object.hasOwn(ERROR_REASONS, errorKey)
    ? ERROR_REASONS[errorKey as keyof typeof ERROR_REASONS]
    : "failed";

type SocialLoginFailedProps = {
  /**
   * 이미 연결 연출을 충분히 보여 준 뒤라면 true — 곧바로 끊긴다.
   * 서버가 `?error=` 로 바로 보낸 경우엔 false 로 두어, 연결 중을 잠깐 보인 뒤 끊기게 한다.
   */
  skipIntro?: boolean;
} & (
  | {
      /** API 응답이 준 실패 문구. 텍스트로만 그린다. */
      reason: string;
      errorKey?: never;
    }
  | {
      /** 서버 리다이렉트의 `?error=` 메시지 키. 아는 키만 번역한다. */
      errorKey: string;
      reason?: never;
    }
);

/**
 * 소셜 로그인 실패. 서버는 실패하면 `/auth/callback?error=<메시지 키>` 로 보낸다(BE↔FE 계약 2번).
 * 로그인 중 화면의 연결이 끊기는 연출로 사유를 보여 주고, 누른 수단을 알면 같은 수단으로, 모르면 로그인 창으로 다시 시도하게 한다.
 */
const SocialLoginFailed = ({
  reason,
  errorKey,
  skipIntro = false,
}: SocialLoginFailedProps) => {
  const t = useTranslations("auth.callback");
  const reasonText = reason ?? t(`reasons.${reasonOf(errorKey ?? "")}`);
  // 연결 중을 최소 시간만큼 보인 뒤에 끊는다.
  const isBroken = useMinimumDisplay(!skipIntro, MIN_PROCESSING_MS);
  const provider = useSyncExternalStore(
    subscribeNothing,
    readProvider,
    () => null,
  );
  const openModal = useModalStore((state) => state.openModal);
  const { redirectingProvider, startSocialLogin } = useSocialLogin();

  const handleRetry = () => {
    if (provider) {
      // 처음 로그인을 시작한 화면으로 돌아가도록 남겨 둔 복귀 경로는 그대로 둔다.
      startSocialLogin(provider, { keepReturnPath: true });
      return;
    }
    openModal("LOGIN", { triggerRef: undefined });
  };

  return (
    // AuthLayout 이 가운데 정렬이라 폭을 직접 채우지 않으면 내용 폭으로 줄어든다.
    <div className="flex w-full self-stretch">
      <AuthProcessing
        provider={provider}
        failure={
          isBroken
            ? {
                reason: reasonText,
                actions: (
                  <>
                    <Button
                      size="lg"
                      fullWidth
                      onClick={handleRetry}
                      disabled={redirectingProvider !== null}
                      isPending={redirectingProvider !== null}
                    >
                      {provider ? t("retry") : t("login")}
                    </Button>
                    <ButtonLink
                      href="/"
                      size="lg"
                      fullWidth
                      variant="secondary"
                      replace
                    >
                      {t("goHome")}
                    </ButtonLink>
                  </>
                ),
              }
            : undefined
        }
      />
    </div>
  );
};

export default SocialLoginFailed;
