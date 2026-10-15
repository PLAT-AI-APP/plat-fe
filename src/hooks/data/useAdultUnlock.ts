"use client";

import { useTranslations } from "next-intl";
import { useAdultContentMutation } from "@/api/verification/patchAdultContent";
import { useAdultVerified } from "@/hooks/data/useAdultAccess";
import { ADULT_VERIFICATION_REQUIRED } from "@/lib/adultAccess";
import { showAppToast } from "@/lib/toast";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";

/**
 * 성인 콘텐츠가 막혔을 때 풀어 주는 다음 한 걸음. 막힌 이유에 맞춰 고른다.
 *
 * - 비로그인: 로그인 창
 * - 성인인증 무효(미인증·만료): 성인인증 창
 * - 성인인증은 유효한데 19 토글이 꺼짐: 19 토글을 켠다(토글을 끄면 미인증과 똑같이 막히기 때문)
 */
export const useAdultUnlock = () => {
  const t = useTranslations("adultVerification.toggle");
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn) && isAuthReady;
  const isVerified = useAdultVerified();
  const openModal = useModalStore((state) => state.openModal);
  const { mutate: changeAdultContent, isPending } = useAdultContentMutation();

  const unlock = () => {
    if (!isLoggedIn) {
      openModal("LOGIN", { triggerRef: undefined });
      return;
    }
    if (!isVerified) {
      openModal("IDENTITY_VERIFICATION", { purpose: "adult" });
      return;
    }
    changeAdultContent(true, {
      onSuccess: () => showAppToast("success", t("enabled")),
      onError: (error) => {
        if (error.code === ADULT_VERIFICATION_REQUIRED) {
          openModal("IDENTITY_VERIFICATION", { purpose: "adult" });
          return;
        }
        showAppToast("error", t("failed"));
      },
    });
  };

  return { unlock, isLoggedIn, isVerified, isPending };
};
