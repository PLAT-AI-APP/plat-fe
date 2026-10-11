"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  type AgreementType,
  useAgreeMutation,
  useAgreementStatusQuery,
} from "@/api/agreement/agreements";
import { useLogoutMutation } from "@/api/auth/logout";
import { isDocsPathname } from "@/components/docs/docsPath";
import { showAppToast } from "@/lib/toast";
import { useDialogStore } from "@/store/useDialogStore";
import AgreementConsentDialog, {
  AGREEMENT_RESULT_TYPE,
} from "./AgreementConsentDialog";

type RequiredType = Exclude<AgreementType, "MARKETING">;

/**
 * 이미 있는 계정의 밀린 필수 동의를 받는다 — 약관 개정 뒤, 그리고 예전에 동의 없이 먼저 만들어진 소셜 계정.
 * 새 소셜 가입은 여기를 거치지 않는다: 로그인 콜백 화면에서 동의해야 계정이 생긴다(SocialSignupConsent).
 */
const AgreementGate = () => {
  const t = useTranslations("auth");
  const { data: status } = useAgreementStatusQuery();
  const { mutate: agree, isPending: isAgreeing } = useAgreeMutation();
  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();
  const openDialog = useDialogStore((state) => state.openDialog);
  const pathname = usePathname();

  const pending = status?.pending ?? [];
  // 약관 페이지는 동의하기 전에 읽어야 하는 화면이라 가리지 않는다. 동의 창의 링크가 새 탭으로 여기를 연다.
  // 문서 사이트(/docs)도 로그인과 무관한 공개 안내라 가리지 않는다.
  const isOpen =
    pending.length > 0 &&
    !pathname.startsWith("/legal/") &&
    !isDocsPathname(pathname);

  if (!status || !isOpen) return null;

  return (
    <AgreementConsentDialog
      firstConsent={status.firstConsent}
      required={pending.map((item) => item.type as RequiredType)}
      isSubmitting={isAgreeing}
      onSubmit={(checked, types) =>
        agree(
          {
            termsOfService: !!checked.TERMS_OF_SERVICE,
            privacyPolicy: !!checked.PRIVACY_POLICY,
            ageOver14: !!checked.AGE_OVER_14,
            ...(status.firstConsent && { marketing: !!checked.MARKETING }),
          },
          {
            // 무엇에 언제 동의했는지 바로 알린다. 창이 닫히기 전에 목록을 만들어 둔다.
            onSuccess: () =>
              openDialog("AGREEMENT_RESULT", {
                processedAt: new Date().toISOString(),
                items: types.map((type) => ({
                  type: AGREEMENT_RESULT_TYPE[type],
                  agreed: !!checked[type],
                })),
              }),
            onError: () => showAppToast("error", t("agreementGate.failed")),
          },
        )
      }
      secondaryLabel={t("agreementGate.logout")}
      isSecondaryPending={isLoggingOut}
      onSecondary={() => logout()}
    />
  );
};

export default AgreementGate;
