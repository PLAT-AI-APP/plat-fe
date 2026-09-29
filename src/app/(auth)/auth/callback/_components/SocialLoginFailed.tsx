"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import StateScene from "@/components/state/StateScene";
import Button from "@/components/ui/Button";
import ButtonLink from "@/components/ui/ButtonLink";
import { SOCIAL_LOGIN_PROVIDER_KEY } from "@/constants/auth";
import {
  useSocialLogin,
  type SocialLoginProvider,
} from "@/hooks/auth/useSocialLogin";
import { useModalStore } from "@/store/useModalStore";

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
}

/**
 * 소셜 로그인 실패. 서버는 실패하면 `/auth/callback?error=<사유>` 로 보낸다(BE↔FE 계약 2번).
 * 사유를 보여 주고, 누른 수단을 알면 같은 수단으로, 모르면 로그인 창으로 다시 시도하게 한다.
 */
const SocialLoginFailed = ({ reason }: SocialLoginFailedProps) => {
  const t = useTranslations("auth.callback");
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
    <div className="flex w-full items-center self-stretch">
      <StateScene
        mood="dizzy"
        title={t("failedTitle")}
        description={reason.trim() || t("failedHint")}
        actions={
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
            <ButtonLink href="/" size="lg" fullWidth variant="secondary" replace>
              {t("goHome")}
            </ButtonLink>
          </>
        }
      />
    </div>
  );
};

export default SocialLoginFailed;
