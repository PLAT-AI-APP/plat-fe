"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  SOCIAL_CODE_EXPIRED,
  useSocialSignupMutation,
} from "@/api/auth/postSocialSignup";
import AgreementConsentDialog, {
  AGREEMENT_RESULT_TYPE,
} from "@/components/auth/AgreementConsentDialog";
import { PENDING_WELCOME_CREDIT_DIALOG_KEY } from "@/constants/auth";
import { resolveErrorMessage } from "@/lib/apiError";
import { showAppToast } from "@/lib/toast";
import { useDialogStore } from "@/store/useDialogStore";
import AuthProcessing from "./AuthProcessing";
import { readProvider, subscribeNothing, takeReturnPath } from "./callbackSession";
import SocialLoginFailed from "./SocialLoginFailed";

const REQUIRED = ["TERMS_OF_SERVICE", "PRIVACY_POLICY", "AGE_OVER_14"] as const;

interface SocialSignupClientProps {
  signupToken: string;
}

/**
 * 처음 온 소셜 사용자의 가입 마무리. 서버는 소셜 인증만으로 계정을 만들지 않고 가입 토큰과 함께 여기로 보낸다.
 *
 * 동의하기 전에는 로그인된 상태가 아니다 — 토큰도 계정도 없다. 그래서 뒤 화면은 메인이 아니라 연결 중 화면에 머문다.
 * 동의하면 그때 계정이 생기고 로그인되어 원래 화면으로 간다. 가입 취소로 나가면 아무것도 남지 않는다(가입 토큰은 10분 뒤 사라진다).
 */
const SocialSignupClient = ({ signupToken }: SocialSignupClientProps) => {
  const t = useTranslations("auth");
  const router = useRouter();
  const provider = useSyncExternalStore(subscribeNothing, readProvider, () => null);
  const openDialog = useDialogStore((state) => state.openDialog);
  const { mutate: signup, isPending } = useSocialSignupMutation();
  const [failureReason, setFailureReason] = useState<string | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);

  if (failureReason !== null) {
    return <SocialLoginFailed reason={failureReason} skipIntro />;
  }

  return (
    <div className="flex w-full self-stretch">
      <AuthProcessing provider={provider} />
      {!isLeaving && (
        <AgreementConsentDialog
          firstConsent
          required={[...REQUIRED]}
          isSubmitting={isPending}
          onSubmit={(checked, types) =>
            signup(
              {
                signupToken,
                termsOfService: !!checked.TERMS_OF_SERVICE,
                privacyPolicy: !!checked.PRIVACY_POLICY,
                ageOver14: !!checked.AGE_OVER_14,
                marketing: !!checked.MARKETING,
              },
              {
                onSuccess: (data) => {
                  setIsLeaving(true);
                  // 무엇에 언제 동의했는지 바로 알린다. 웰컴 안내는 이 창을 닫은 뒤 홈에서 이어 뜬다.
                  openDialog("AGREEMENT_RESULT", {
                    processedAt: new Date().toISOString(),
                    items: types.map((type) => ({
                      type: AGREEMENT_RESULT_TYPE[type],
                      agreed: !!checked[type],
                    })),
                  });
                  const returnPath = takeReturnPath();
                  if (data.welcomeCredit != null) {
                    sessionStorage.setItem(PENDING_WELCOME_CREDIT_DIALOG_KEY, "true");
                    router.replace("/");
                    return;
                  }
                  router.replace(returnPath);
                },
                onError: (error) => {
                  // 가입 토큰이 만료됐거나, 그 사이 같은 이메일이 가입됐거나 재가입이 막힌 경우 — 동의를 다시 해도 안 된다.
                  if (error.code === SOCIAL_CODE_EXPIRED || error.status === 409) {
                    setFailureReason(resolveErrorMessage(error));
                    return;
                  }
                  showAppToast("error", t("agreementGate.failed"));
                },
              },
            )
          }
          secondaryLabel={t("agreementGate.cancelSignup")}
          onSecondary={() => {
            setIsLeaving(true);
            showAppToast("info", t("agreementGate.signupCancelled"));
            router.replace(takeReturnPath());
          }}
        />
      )}
    </div>
  );
};

export default SocialSignupClient;
