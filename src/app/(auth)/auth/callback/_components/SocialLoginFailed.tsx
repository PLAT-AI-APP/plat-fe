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

interface SocialLoginFailedProps {
  /** 서버가 현지화해 준 실패 사유(`?error=`). 텍스트로만 그린다. */
  reason: string;
  /**
   * 이미 연결 연출을 충분히 보여 준 뒤라면 true — 곧바로 끊긴다.
   * 서버가 `?error=` 로 바로 보낸 경우엔 false 로 두어, 연결 중을 잠깐 보인 뒤 끊기게 한다.
   */
  skipIntro?: boolean;
}

/**
 * 소셜 로그인 실패. 서버는 실패하면 `/auth/callback?error=<사유>` 로 보낸다(BE↔FE 계약 2번).
 * 로그인 중 화면의 연결이 끊기는 연출로 사유를 보여 주고, 누른 수단을 알면 같은 수단으로, 모르면 로그인 창으로 다시 시도하게 한다.
 */
const SocialLoginFailed = ({
  reason,
  skipIntro = false,
}: SocialLoginFailedProps) => {
  const t = useTranslations("auth.callback");
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
                reason,
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
