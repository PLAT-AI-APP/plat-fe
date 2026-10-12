"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import { QueryStateBoundary } from "@/components/state";
import { formatWithCommas } from "@/lib/utils";
import { useEarningSummaryQuery } from "@/api/earning/getEarningSummary";
import type { EarningSummary } from "@/type/earning";
import GiftCardList from "./GiftCardList";
import NoteConversionModal from "./NoteConversionModal";
import EarningHistoryModal from "./EarningHistoryModal";

type OpenModal = "convert" | "history" | null;

/** 등급 칩 뱃지. 등급 화면(earnings/tier)과 같은 그림을 쓴다. */
const TIER_BADGE: Record<Exclude<EarningSummary["tier"], "NONE">, string> = {
  DUST: "/images/creator-tier/1-dust.svg",
  COMET: "/images/creator-tier/2-comet.svg",
  PLANET: "/images/creator-tier/3-planet.svg",
  NOVA: "/images/creator-tier/4-nova.svg",
  GALAXY: "/images/creator-tier/5-galaxy.svg",
  ORIGIN: "/images/creator-tier/6-origin.svg",
};

const BalanceSkeleton = () => (
  <div className="h-24 animate-pulse rounded-3xl border border-main bg-darker" />
);

/** 나의 수익. 교환 가능 포인트 옆에서 노트 전환·내역을 열고, 아래에서 상품권을 고른다. */
const EarningsContents = () => {
  const t = useTranslations("earnings");
  const [modal, setModal] = useState<OpenModal>(null);
  const summaryQuery = useEarningSummaryQuery();
  const { data, isPending, isError, error, refetch } = summaryQuery;
  const available = data?.available ?? 0;
  // 값이 오기 전이나 없을 때는 막아 둔다. 서버도 인증이 없으면 상품권 신청을 거절한다.
  const identityVerified = data?.identityVerified === true;

  return (
    <section className="mx-auto mb-10 flex w-full max-w-160 flex-col gap-8 pt-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="heading-2">{t("title")}</h1>
        <Link
          href="/earnings/tier"
          aria-label={t("tier.chip")}
          className="body-6 flex items-center gap-1.5 rounded-full border border-main bg-darker py-1 pl-1.5 pr-3 transition-colors hover:bg-darkest"
        >
          {data && data.tier !== "NONE" ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={TIER_BADGE[data.tier]} alt="" width={22} height={22} />
              {t(`tier.names.${data.tier}`)}
            </>
          ) : (
            <span className="pl-1.5">{t("tier.chip")}</span>
          )}
        </Link>
      </div>

      <QueryStateBoundary
        isPending={isPending}
        isError={isError}
        error={error}
        onRetry={refetch}
        pendingFallback={<BalanceSkeleton />}
      >
        {data && (
          <div className="flex items-center justify-between gap-4 rounded-3xl border border-main bg-darker p-5">
            <div className="flex min-w-0 flex-col gap-1">
              <span className="body-5 text-font-2">{t("available")}</span>
              <span className="title-1 truncate">
                {t("points", { value: formatWithCommas(data.available) })}
              </span>
              {data.pending > 0 && (
                <span className="body-7 text-font-2">
                  {t("pending", { value: formatWithCommas(data.pending) })}
                </span>
              )}
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                size="md"
                disabled={data.available < data.noteUnitPrice}
                onClick={() => setModal("convert")}
              >
                {t("convert")}
              </Button>
              <Button
                size="md"
                variant="secondary"
                onClick={() => setModal("history")}
              >
                {t("history")}
              </Button>
            </div>
          </div>
        )}
      </QueryStateBoundary>

      <section className="flex flex-col gap-4">
        <h2 className="title-3">{t("giftCards")}</h2>
        <GiftCardList
          available={available}
          identityVerified={identityVerified}
        />
      </section>

      {modal === "convert" && data && (
        <NoteConversionModal
          available={data.available}
          noteUnitPrice={data.noteUnitPrice}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "history" && (
        <EarningHistoryModal onClose={() => setModal(null)} />
      )}
    </section>
  );
};

export default EarningsContents;
