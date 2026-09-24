"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import dayjs from "@/lib/dayjs";
import { ArrowLeft, ArrowRight, Close } from "@/icons";
import { ModalLayout } from "@/components/ModalLayout";
import IconButton from "@/components/ui/IconButton";
import { InfiniteQueryBoundary } from "@/components/state";
import { cn, formatWithCommas } from "@/lib/utils";
import { useInfiniteList } from "@/hooks/data/useInfiniteList";
import { useEarningLedgersQuery } from "@/api/earning/getEarningLedgers";
import type { EarningLedgerItem } from "@/type/earning";

const PAGE_SIZE = 30;
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** 서버가 달을 KST 로 자르므로 이번 달도 KST 로 정한다. */
const currentKstMonth = () =>
  new Date(Date.now() + KST_OFFSET_MS).toISOString().slice(0, 7);

const shiftMonth = (month: string, amount: number) =>
  dayjs(`${month}-01`).add(amount, "month").format("YYYY-MM");

interface EarningHistoryModalProps {
  onClose: () => void;
}

/** 한 줄의 제목. 교환이면 상품권 이름·전환 노트로, 나머지는 유형 이름으로 쓴다. */
const useLedgerTitle = () => {
  const t = useTranslations("earnings");

  return (item: EarningLedgerItem) => {
    if (item.type === "REDEEM" && item.rewardType === "NOTE") {
      return t("noteConverted", {
        count: formatWithCommas(item.noteAmount ?? 0),
      });
    }
    if (item.type === "REDEEM" && item.productName) {
      return item.productName;
    }
    if (item.type === "REDEEM_CANCEL" && item.productName) {
      return t("giftRefunded", { name: item.productName });
    }
    return t(`ledgerType.${item.type}`);
  };
};

/** 상품권 신청 줄에만 발송 상태를 단다. 노트 전환의 지급 대기는 드러내지 않는다. */
const GiftStatus = ({ item }: { item: EarningLedgerItem }) => {
  const t = useTranslations("earnings");
  const status = item.redemptionStatus;

  if (item.type !== "REDEEM" || item.rewardType !== "GIFT_CARD" || !status) {
    return null;
  }
  if (status !== "REQUESTED" && status !== "ISSUED" && status !== "REJECTED") {
    return null;
  }
  return (
    <span
      className={cn(
        "body-7",
        status === "REJECTED" ? "text-font-accents" : "text-font-2",
      )}
    >
      {t(`giftStatus.${status}`)}
    </span>
  );
};

/** 수익 포인트 내역. 한 달씩 넘겨 보고, 그 달 안에서는 날짜별로 묶는다. */
const EarningHistoryModal = ({ onClose }: EarningHistoryModalProps) => {
  const t = useTranslations("earnings");
  const titleOf = useLedgerTitle();
  const thisMonth = currentKstMonth();
  const [month, setMonth] = useState(thisMonth);

  const {
    data,
    error,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useEarningLedgersQuery({ month, size: PAGE_SIZE });

  const { items, hasItems, sentinelRef } = useInfiniteList({
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const groups = items.reduce<Record<string, EarningLedgerItem[]>>(
    (acc, item) => {
      const key = dayjs(item.createdAt).format("YYYY-MM-DD");
      (acc[key] ??= []).push(item);
      return acc;
    },
    {},
  );

  return (
    <ModalLayout
      hasBackground
      onClose={onClose}
      className="flex max-h-[80dvh] w-[calc(100%-32px)] max-w-110 flex-col overflow-hidden p-0"
    >
      <header className="flex items-center justify-between gap-2 border-b border-main px-5 py-4">
        <h2 className="title-3">{t("history")}</h2>
        <IconButton aria-label={t("close")} onClick={onClose}>
          <Close className="size-4" />
        </IconButton>
      </header>

      <div className="flex items-center justify-center gap-4 px-5 pt-4 pb-2">
        <IconButton
          aria-label={t("prevMonth")}
          onClick={() => setMonth(shiftMonth(month, -1))}
        >
          <ArrowLeft className="size-3.5" />
        </IconButton>
        <span className="title-4 min-w-28 text-center tabular-nums">
          {dayjs(`${month}-01`).format(t("monthFormat"))}
        </span>
        <IconButton
          aria-label={t("nextMonth")}
          disabled={month >= thisMonth}
          onClick={() => setMonth(shiftMonth(month, 1))}
        >
          <ArrowRight className="size-3.5" />
        </IconButton>
      </div>

      <div className="min-h-60 flex-1 overflow-y-auto px-5 pb-5">
        <InfiniteQueryBoundary
          isPending={isLoading}
          isError={isError}
          error={error}
          hasItems={hasItems}
          isEmpty={!hasItems && !hasNextPage}
          emptyMood="peek"
          emptyMessage={t("empty.ledger")}
          isFetchingNextPage={isFetchingNextPage}
          onRetry={refetch}
          onRetryNextPage={fetchNextPage}
        >
          <div className="flex flex-col gap-5 pt-2">
            {Object.entries(groups).map(([date, dayItems]) => (
              <section key={date} className="flex flex-col">
                <h3 className="body-6 pb-1 text-font-2">
                  {dayjs(date).format(t("dayFormat"))}
                </h3>
                <ul className="flex flex-col divide-y divide-main">
                  {dayItems.map((item) => {
                    const isPlus = item.amount > 0;
                    return (
                      <li
                        key={item.ledgerId}
                        className="flex items-center justify-between gap-4 py-3"
                      >
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <span className="title-5 truncate">
                            {titleOf(item)}
                          </span>
                          <span className="flex gap-2">
                            <time className="body-7 text-font-2">
                              {dayjs(item.createdAt).format("HH:mm")}
                            </time>
                            <GiftStatus item={item} />
                          </span>
                          {item.type === "REDEEM_CANCEL" &&
                            item.rejectReason && (
                              <p className="body-7 text-font-2">
                                {item.rejectReason}
                              </p>
                            )}
                        </div>
                        <span
                          className={cn(
                            "title-4 shrink-0",
                            isPlus ? "text-brand-dark" : "text-font-1",
                          )}
                        >
                          {isPlus ? "+" : ""}
                          {t("points", {
                            value: formatWithCommas(item.amount),
                          })}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
            {hasNextPage && <div ref={sentinelRef} />}
          </div>
        </InfiniteQueryBoundary>
      </div>
    </ModalLayout>
  );
};

export default EarningHistoryModal;
