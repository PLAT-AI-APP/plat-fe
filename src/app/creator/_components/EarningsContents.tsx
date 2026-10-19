"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import { QueryStateBoundary } from "@/components/state";
import { formatWithCommas } from "@/lib/utils";
import { useEarningSummaryQuery } from "@/api/earning/getEarningSummary";
import NoteConversionModal from "./NoteConversionModal";
import RedemptionHistoryModal from "./RedemptionHistoryModal";
import CharacterEarnings from "./CharacterEarnings";
import EarningCalendar from "./EarningCalendar";
import InfoTip from "@/components/ui/InfoTip";

type OpenModal = "convert" | "history" | null;

const BalanceSkeleton = () => (
  <div className="h-24 animate-pulse rounded-3xl border border-main bg-darker" />
);

/**
 * 크리에이터 센터 수익 탭. 교환 가능 포인트 옆에서 노트 전환 · 전환 내역을 열고, 아래 세 칸에 내일 정산 예정 ·
 * 전환 대기 · 소멸 예정을 둔다. 그 아래 수익 캘린더와 캐릭터별 수익.
 */
const EarningsContents = () => {
  const t = useTranslations("earnings");
  const [modal, setModal] = useState<OpenModal>(null);
  const summaryQuery = useEarningSummaryQuery();
  const { data, isPending, isError, error, refetch } = summaryQuery;

  // 내일 풀리는 몫은 승급 전 등급의 보류일로 쌓였을 수 있어 설명에 일수를 적지 않는다.
  const cells = data
    ? [
        {
          key: "settleTomorrow",
          value: data.settleTomorrow,
          tip: t("summary.settleTomorrowTip"),
        },
        { key: "waiting", value: data.pending, tip: t("summary.waitingTip") },
        {
          key: "expiringSoon",
          value: data.expiringSoon,
          tip: t("summary.expiringSoonTip"),
        },
      ]
    : [];

  return (
    <section className="flex flex-col gap-8">
      <QueryStateBoundary
        isPending={isPending}
        isError={isError}
        error={error}
        onRetry={refetch}
        pendingFallback={<BalanceSkeleton />}
      >
        {data && (
          <div className="flex flex-col rounded-3xl border border-main bg-darker">
            <div className="flex items-center justify-between gap-4 p-5">
              <div className="flex min-w-0 flex-col gap-1">
                <span className="body-5 text-font-2">{t("available")}</span>
                <span className="title-1 truncate">
                  {t("points", {
                    value: formatWithCommas(data.available),
                  })}
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

            <div className="grid grid-cols-1 divide-y divide-main border-t border-main sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {cells.map((cell, index) => (
                <div
                  key={cell.key}
                  className="flex min-w-0 items-center justify-between gap-1 px-5 py-3.5 sm:flex-col sm:items-start sm:justify-start sm:py-4"
                >
                  <span className="body-6 flex items-center gap-1 text-font-2">
                    <span className="truncate">{t(`summary.${cell.key}`)}</span>
                    <InfoTip
                      text={cell.tip}
                      align={index === cells.length - 1 ? "end" : "start"}
                    />
                  </span>
                  <span className="title-4 tabular-nums">
                    {t("points", { value: formatWithCommas(cell.value) })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </QueryStateBoundary>

      <EarningCalendar />

      <CharacterEarnings />

      {modal === "convert" && data && (
        <NoteConversionModal
          available={data.available}
          noteUnitPrice={data.noteUnitPrice}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "history" && (
        <RedemptionHistoryModal onClose={() => setModal(null)} />
      )}
    </section>
  );
};

export default EarningsContents;
