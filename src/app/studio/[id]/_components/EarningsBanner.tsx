"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight } from "@/icons";
import { formatWithCommas } from "@/lib/utils";
import { useEarningSummaryQuery } from "@/api/earning/getEarningSummary";

/** 스튜디오에서 수익 화면으로 가는 요약 배너. 요약을 못 받으면 금액 없이 링크만 둔다. */
const EarningsBanner = () => {
  const t = useTranslations("earnings");
  const { data } = useEarningSummaryQuery();

  return (
    <Link
      href="/earnings"
      className="flex items-center justify-between gap-4 rounded-3xl border border-main bg-darker px-5 py-4 transition-colors hover:bg-btn-hover"
    >
      <div className="flex flex-col gap-1">
        <span className="body-5 text-font-2">{t("bannerTitle")}</span>
        <span className="title-2">
          {data ? t("points", { value: formatWithCommas(data.available) }) : "-"}
        </span>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-font-2" />
    </Link>
  );
};

export default EarningsBanner;
