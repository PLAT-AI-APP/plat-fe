"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import { QueryStateBoundary } from "@/components/state";
import { formatWithCommas } from "@/lib/utils";
import { useEarningSummaryQuery } from "@/api/earning/getEarningSummary";
import GiftCardList from "./GiftCardList";
import NoteConversionModal from "./NoteConversionModal";
import EarningHistoryModal from "./EarningHistoryModal";

type OpenModal = "convert" | "history" | null;

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

  return (
    <section className="mx-auto mb-10 flex w-full max-w-160 flex-col gap-8 pt-5">
      <h1 className="heading-2">{t("title")}</h1>

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
        <GiftCardList available={available} />
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
