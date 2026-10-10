"use client";

import { useTranslations } from "next-intl";
import { useAdultContentMutation } from "@/api/verification/patchAdultContent";
import Switch from "@/components/ui/Switch";
import { useAdultAccess } from "@/hooks/data/useAdultAccess";
import {
  ADULT_VERIFICATION_REQUIRED,
  isVerificationValid,
  readAdultClaims,
} from "@/lib/adultAccess";
import { showAppToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";
import { useUserStore } from "@/store/useUserStore";

/**
 * 헤더의 19 토글. 목록·검색·랭킹에 성인 콘텐츠를 섞을지만 정한다(접근 권한은 성인인증이 정한다).
 *
 * - 비로그인: 누르면 로그인 창
 * - 성인인증 무효(미인증·만료): 누르면 본인인증 창
 * - 유효: 서버에 바꾸고 새 토큰으로 교체, 목록을 다시 받는다
 */
const AdultToggle = ({ className }: { className?: string }) => {
  const t = useTranslations("adultVerification.toggle");
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn) && isAuthReady;
  const accessToken = useAuthStore((state) => state.accessToken);
  const openModal = useModalStore((state) => state.openModal);
  const tokenAdultAccess = useAdultAccess();
  const adultVerifiedUntil = useUserStore((state) => state.user?.adultVerifiedUntil);
  const storedEnabled = useUserStore((state) => state.user?.adultContentEnabled);
  const { mutate: changeAdultContent, isPending } = useAdultContentMutation();

  // /users/me 가 오기 전(새로고침 직후)에는 토큰 클레임으로 그린다. 토큰이 서버 판단의 기준이기도 하다.
  const isAdultValid =
    adultVerifiedUntil !== undefined
      ? isVerificationValid(adultVerifiedUntil)
      : tokenAdultAccess;
  const enabled =
    isLoggedIn &&
    isAdultValid &&
    (storedEnabled ?? readAdultClaims(accessToken).adultMode);

  // 판정 전에는 어느 상태도 그리지 않고 자리만 잡는다(헤더의 다른 자리표시자와 같은 방식).
  if (!isAuthReady) {
    return (
      <div
        aria-hidden="true"
        className={cn("skeleton h-7 w-[52px] rounded-full", className)}
      />
    );
  }

  const handleChange = (next: boolean) => {
    if (!isLoggedIn) {
      openModal("LOGIN", { triggerRef: undefined });
      return;
    }
    // 끄기는 언제나 된다. 켜기만 성인인증이 필요하다.
    if (next && !isAdultValid) {
      openModal("IDENTITY_VERIFICATION");
      return;
    }

    changeAdultContent(next, {
      onSuccess: (result) =>
        showAppToast(
          "success",
          result.adultContentEnabled ? t("enabled") : t("disabled"),
        ),
      onError: (error) => {
        if (error.code === ADULT_VERIFICATION_REQUIRED) {
          // 화면이 아는 것보다 먼저 인증이 만료됐다. 다시 인증하게 한다.
          openModal("IDENTITY_VERIFICATION");
          return;
        }
        showAppToast("error", t("failed"));
      },
    });
  };

  return (
    <div className={cn("flex h-10 shrink-0 items-center px-1", className)}>
      <Switch
        size="label"
        tone="danger"
        checked={enabled}
        label={t("ariaLabel")}
        onChange={handleChange}
        themeIcon={false}
        disabled={isPending}
        thumbContent={
          <span aria-hidden="true" className="text-[11px] font-extrabold leading-none tracking-[-0.04em]">
            {t("label")}
          </span>
        }
      />
    </div>
  );
};

export default AdultToggle;
