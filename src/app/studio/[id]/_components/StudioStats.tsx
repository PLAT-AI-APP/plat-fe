"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight } from "@/icons";
import { formatWithCommas } from "@/lib/utils";

export const MOCK_STUDIO_DATA = {
  characterCount: 329,
  chatCount: 1455,
  isIdentityVerified: true,
  isAdultVerified: false,
};

const StudioStats = () => {
  const t = useTranslations("studio");

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
          {MOCK_STUDIO_DATA.isIdentityVerified
            ? t("stats.verified")
            : t("stats.unverified")}
        </span>
      </div>

      <div className="relative flex min-w-27.5 flex-1 items-center gap-2">
        <div className="flex flex-1 flex-col gap-2">
          <span className="body-5 text-font-2">{t("stats.adult")}</span>
          <span
            className={`title-3 ${!MOCK_STUDIO_DATA.isAdultVerified ? "text-font-disabled" : ""}`}
          >
            {MOCK_STUDIO_DATA.isAdultVerified
              ? t("stats.verified")
              : t("stats.unverified")}
          </span>
        </div>

        <Link
          href=""
          className="rounded-lg p-1 transition-colors hover:bg-btn-hover"
        >
          <ArrowRight className="h-3 w-3 text-font-2" />
        </Link>
      </div>
    </div>
  );
};

export default StudioStats;
