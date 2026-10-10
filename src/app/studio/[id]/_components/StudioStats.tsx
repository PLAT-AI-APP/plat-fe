"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "@/icons";
import { isVerificationValid } from "@/lib/adultAccess";
import { formatWithCommas } from "@/lib/utils";
import { useModalStore } from "@/store/useModalStore";
import { useUserStore } from "@/store/useUserStore";

export const MOCK_STUDIO_DATA = {
  characterCount: 329,
  chatCount: 1455,
};

const StudioStats = () => {
  const t = useTranslations("studio");
  const verificationT = useTranslations("adultVerification.studio");
  const openModal = useModalStore((state) => state.openModal);
  // 지금 기준으로 유효한지. 만료된 인증은 미인증과 같다.
  const isIdentityVerified = useUserStore((state) =>
    isVerificationValid(state.user?.identityVerifiedUntil),
  );
  const isAdultVerified = useUserStore((state) =>
    isVerificationValid(state.user?.adultVerifiedUntil),
  );

  return (
    <div className="grid grid-cols-2 gap-3 @[516px]:grid-cols-4">
      <div className="flex min-w-27.5 flex-1 flex-col gap-2">
        <span className="body-5 text-font-2">{t("stats.characters")}</span>
        <span className="title-3">
          {formatWithCommas(MOCK_STUDIO_DATA.characterCount)}
        </span>
      </div>

      <div className="flex min-w-27.5 flex-1 flex-col gap-2">
        <span className="body-5 text-font-2">{t("stats.chats")}</span>
        <span className="title-3">
          {formatWithCommas(MOCK_STUDIO_DATA.chatCount)}
        </span>
      </div>

      <div className="flex min-w-27.5 flex-1 flex-col gap-2">
        <span className="body-5 text-font-2">{t("stats.identity")}</span>
        <span className="title-3">
          {isIdentityVerified
            ? t("stats.verified")
            : t("stats.unverified")}
        </span>
      </div>

      <div className="relative flex min-w-27.5 flex-1 items-center gap-2">
        <div className="flex flex-1 flex-col gap-2">
          <span className="body-5 text-font-2">{t("stats.adult")}</span>
          <span
            className={`title-3 ${!isAdultVerified ? "text-font-disabled" : ""}`}
          >
            {isAdultVerified
              ? t("stats.verified")
              : t("stats.unverified")}
          </span>
        </div>

        {/* 본인인증 한 번으로 성인 여부도 함께 확인된다. 이미 성인인증이 유효하면 갈 곳이 없다. */}
        {!isAdultVerified && (
          <button
            type="button"
            aria-label={verificationT("verify")}
            onClick={() => openModal("IDENTITY_VERIFICATION")}
            className="rounded-lg p-1 transition-colors hover:bg-btn-hover"
          >
            <ArrowRight className="h-3 w-3 text-font-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default StudioStats;
