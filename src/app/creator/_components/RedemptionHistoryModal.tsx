"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import dayjs from "@/lib/dayjs";
import { kstMonth } from "@/lib/kst";
import { ArrowLeft, ArrowRight, Close } from "@/icons";
import Copy from "@/icons/Copy";
import { ModalLayout } from "@/components/ModalLayout";
import IconButton from "@/components/ui/IconButton";
import { InfiniteQueryBoundary, QueryStateBoundary } from "@/components/state";
import { showAppToast } from "@/lib/toast";
import { cn, formatWithCommas } from "@/lib/utils";
import { useInfiniteList } from "@/hooks/data/useInfiniteList";
import { useEarningExchangesQuery } from "@/api/earning/getEarningExchanges";
import { useRedemptionDetailQuery } from "@/api/earning/getRedemptionDetail";
import type {
  EarningLedgerItem,
  RedemptionDetail,
  RewardRedemptionStatus,
  RewardType,
} from "@/type/earning";

const PAGE_SIZE = 30;
const shiftMonth = (month: string, amount: number) =>
  dayjs(`${month}-01`).add(amount, "month").format("YYYY-MM");

/** 상태 문구 키. 상품권은 발송, 노트는 지급으로 부른다. */
const statusKey = (type: RewardType, status: RewardRedemptionStatus) =>
  status === "ISSUED" && type === "NOTE" ? "ISSUED_NOTE" : status;

const StatusBadge = ({
  type,
  status,
}: {
  type: RewardType;
  status: RewardRedemptionStatus;
}) => {
  const t = useTranslations("earnings.exchanges.status");
  return (
    <span
      className={cn(
        "body-8 shrink-0 rounded-full px-2 py-0.5",
        status === "REJECTED"
          ? "bg-font-accents/10 text-font-accents"
          : status === "ISSUED"
            ? "bg-font-1/[0.06] text-font-2"
            : "bg-brand/10 text-brand",
      )}
    >
      {t(statusKey(type, status))}
    </span>
  );
};

type StepState = "done" | "current" | "todo";

interface Step {
  key: string;
  at: string | null;
  state: StepState;
  tone?: "accent";
}

/**
 * 단계. 상품권: 신청 접수 → 발송 준비(운영팀 처리) → 받는 방법으로 발송. 노트: 신청 접수 → 노트 지급.
 * 반려면 신청 접수 → 반려 → 포인트 환불(반려와 같은 시각)로 끝난다.
 */
const stepsOf = (item: RedemptionDetail): Step[] => {
  const requested: Step = {
    key: "requested",
    at: item.requestedAt,
    state: "done",
  };
  if (item.status === "REJECTED") {
    return [
      requested,
      { key: "rejected", at: item.processedAt, state: "done", tone: "accent" },
      { key: "refunded", at: item.processedAt, state: "done" },
    ];
  }
  // 노트는 차감과 지급이 한 번에 끝나 반려가 아니면 늘 지급 완료다.
  if (item.type === "NOTE") {
    return [
      requested,
      { key: "granted", at: item.processedAt, state: "done" },
    ];
  }
  const issued = item.status === "ISSUED";
  return [
    requested,
    {
      key: issued ? "prepared" : "preparing",
      at: null,
      state: issued ? "done" : "current",
    },
    { key: "sent", at: item.processedAt, state: issued ? "done" : "todo" },
  ];
};

const Steps = ({ item }: { item: RedemptionDetail }) => {
  const t = useTranslations("earnings");
  const steps = stepsOf(item);
  return (
    <ol className="flex flex-col">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <li key={step.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "mt-1 size-2.5 shrink-0 rounded-full",
                  step.state === "todo"
                    ? "border border-font-disabled"
                    : step.tone === "accent"
                      ? "bg-font-accents"
                      : step.state === "current"
                        ? "bg-brand"
                        : "bg-font-2",
                )}
              />
              {!isLast && (
                <span
                  className={cn(
                    "my-1 w-px flex-1",
                    steps[index + 1].state === "todo" ? "bg-main" : "bg-font-2",
                  )}
                />
              )}
            </div>
            <div className={cn("flex flex-col gap-0.5", !isLast && "pb-4")}>
              <span
                className={cn(
                  "title-5",
                  step.state === "todo" && "text-font-disabled",
                  step.state === "current" && "text-brand",
                  step.tone === "accent" && "text-font-accents",
                )}
              >
                {step.key === "sent"
                  ? t(`delivery.${item.deliveryChannel ?? "SMS"}.sent`)
                  : t(`exchanges.steps.${step.key}`)}
              </span>
              {/* 시각이 없는 단계도 같은 높이가 되도록 줄 자리를 남긴다. */}
              <time
                className={cn(
                  "body-7 tabular-nums text-font-2",
                  !step.at && "invisible",
                )}
              >
                {step.at ? dayjs(step.at).format(t("dateTimeFormat")) : "-"}
              </time>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

const titleOf = (
  item: {
    rewardType: RewardType | null;
    productName: string | null;
    noteAmount: number | null;
  },
  t: ReturnType<typeof useTranslations<"earnings">>,
) =>
  item.rewardType === "NOTE"
    ? t("noteConverted", { count: formatWithCommas(item.noteAmount ?? 0) })
    : (item.productName ?? "");

const RedemptionDetailView = ({ redemptionNo }: { redemptionNo: string }) => {
  const t = useTranslations("earnings");
  const { data, isPending, isError, error, refetch } =
    useRedemptionDetailQuery(redemptionNo);

  const copyNo = async () => {
    try {
      await navigator.clipboard.writeText(redemptionNo);
      showAppToast("success", t("exchanges.copied"));
    } catch {
      // 복사를 못 해도 화면의 번호를 직접 볼 수 있다.
    }
  };

  return (
    <QueryStateBoundary
      isPending={isPending}
      isError={isError}
      error={error}
      onRetry={refetch}
      pendingFallback={<div className="h-80 animate-pulse" />}
    >
      {data && (
        <div className="flex flex-col gap-6 px-5 pt-4 pb-5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="title-3 min-w-0 truncate">
                {titleOf(
                  {
                    rewardType: data.type,
                    productName: data.productName,
                    noteAmount: data.noteAmount,
                  },
                  t,
                )}
              </span>
              <StatusBadge type={data.type} status={data.status} />
            </div>
            <button
              type="button"
              onClick={copyNo}
              className="body-6 flex w-fit items-center gap-1 tabular-nums text-font-2 transition-colors hover:text-font-1"
            >
              {t("exchanges.redemptionNo", { no: data.redemptionNo })}
              <Copy className="size-3.5" aria-hidden="true" />
            </button>
          </div>

          <Steps item={data} />

          {data.rejectReason && (
            <p className="body-6 rounded-xl bg-card px-3 py-2.5 text-font-2">
              {data.rejectReason}
            </p>
          )}

          <dl className="flex flex-col divide-y divide-main rounded-2xl border border-main px-4">
            {[
              {
                key: "usedPoints",
                value: t("points", {
                  value: formatWithCommas(data.pointAmount),
                }),
              },
              ...(data.type === "NOTE" && data.noteAmount !== null
                ? [
                    {
                      key: "receivedNotes",
                      value: t("exchanges.notesValue", {
                        count: formatWithCommas(data.noteAmount),
                      }),
                    },
                  ]
                : []),
              ...(data.recipient
                ? [
                    {
                      key: "recipient",
                      label: t(
                        `delivery.${data.deliveryChannel ?? "SMS"}.field`,
                      ),
                      value: data.recipient,
                    },
                  ]
                : []),
              {
                key: "requestedAt",
                value: dayjs(data.requestedAt).format(t("dateTimeFormat")),
              },
            ].map((row: { key: string; label?: string; value: string }) => (
              <div
                key={row.key}
                className="body-5 flex items-center justify-between gap-3 py-3"
              >
                <dt className="text-font-2">
                  {row.label ?? t(`exchanges.${row.key}`)}
                </dt>
                <dd className="tabular-nums">{row.value}</dd>
              </div>
            ))}
          </dl>

          <Link
            href={`/customer-service/qna/new?category=EARNING&redemption=${encodeURIComponent(data.redemptionNo)}`}
            className="body-5 flex h-11 items-center justify-center rounded-xl border border-main transition-colors hover:bg-darkest"
          >
            {t("exchanges.inquiry")}
          </Link>
        </div>
      )}
    </QueryStateBoundary>
  );
};

const ExchangeRow = ({
  item,
  onOpen,
}: {
  item: EarningLedgerItem;
  onOpen: (redemptionNo: string) => void;
}) => {
  const t = useTranslations("earnings");
  const redemptionNo = item.redemptionNo;
  const isExchange = item.type === "REDEEM" && redemptionNo !== null;
  // 반려된 교환은 포인트를 돌려받았으므로 금액을 지운 것으로 보인다.
  const refunded = item.redemptionStatus === "REJECTED";
  const content = (
    <>
      <div className="flex min-w-0 flex-col gap-1">
        <span className="flex min-w-0 items-center gap-2">
          <span className="title-5 truncate">
            {isExchange ? titleOf(item, t) : t(`ledgerType.${item.type}`)}
          </span>
          {isExchange && item.rewardType && item.redemptionStatus && (
            <StatusBadge
              type={item.rewardType}
              status={item.redemptionStatus}
            />
          )}
        </span>
        <span className="body-7 tabular-nums text-font-2">
          {dayjs(item.createdAt).format(t("dayFormat"))}{" "}
          {dayjs(item.createdAt).format(t("timeFormat"))}
          {isExchange && ` · ${redemptionNo}`}
        </span>
      </div>
      <span
        className={cn(
          "title-4 shrink-0 tabular-nums",
          refunded
            ? "text-font-disabled line-through"
            : item.amount > 0
              ? "text-brand-dark"
              : "text-font-1",
        )}
      >
        {item.amount > 0 ? "+" : ""}
        {t("points", { value: formatWithCommas(item.amount) })}
      </span>
    </>
  );

  if (!isExchange) {
    return (
      <li className="flex items-center justify-between gap-4 py-3.5">
        {content}
      </li>
    );
  }
  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(redemptionNo)}
        className="flex w-full items-center justify-between gap-4 py-3.5 text-left"
      >
        {content}
      </button>
    </li>
  );
};

interface RedemptionHistoryModalProps {
  onClose: () => void;
}

/**
 * 전환 내역. 노트 전환 · 상품권 교환과 소멸 · 운영 지급/차감을 한 달씩 보고, 교환을 누르면 단계 · 교환 번호 ·
 * 1:1 문의를 본다. 대화 적립은 수익 캘린더가 대신한다.
 */
const RedemptionHistoryModal = ({ onClose }: RedemptionHistoryModalProps) => {
  const t = useTranslations("earnings");
  const thisMonth = kstMonth();
  const [month, setMonth] = useState(thisMonth);
  const [selected, setSelected] = useState<string | null>(null);

  const query = useEarningExchangesQuery({ month, size: PAGE_SIZE });
  const { items, hasItems, sentinelRef } = useInfiniteList(query);

  return (
    <ModalLayout
      hasBackground
      onClose={onClose}
      className="flex h-[min(80dvh,640px)] w-[calc(100%-32px)] max-w-110 flex-col overflow-hidden p-0"
    >
      <header className="flex items-center justify-between gap-2 border-b border-main px-5 py-4">
        <div className="flex items-center gap-1">
          {selected && (
            <IconButton
              aria-label={t("exchanges.backToList")}
              onClick={() => setSelected(null)}
            >
              <ArrowLeft className="size-4" />
            </IconButton>
          )}
          <h2 className="title-3">
            {selected ? t("exchanges.detail") : t("exchanges.title")}
          </h2>
        </div>
        <IconButton aria-label={t("close")} onClick={onClose}>
          <Close className="size-4" />
        </IconButton>
      </header>

      {selected ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <RedemptionDetailView redemptionNo={selected} />
        </div>
      ) : (
        <>
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

          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
            <InfiniteQueryBoundary
              isPending={query.isLoading}
              isError={query.isError}
              error={query.error}
              hasItems={hasItems}
              isEmpty={!hasItems && !query.hasNextPage}
              emptyMood="peek"
              emptyMessage={t("exchanges.empty")}
              isFetchingNextPage={query.isFetchingNextPage}
              onRetry={query.refetch}
              onRetryNextPage={query.fetchNextPage}
            >
              <ul className="flex flex-col divide-y divide-main">
                {items.map((item) => (
                  <ExchangeRow
                    key={item.ledgerId}
                    item={item}
                    onOpen={setSelected}
                  />
                ))}
              </ul>
              {query.hasNextPage && <div ref={sentinelRef} />}
            </InfiniteQueryBoundary>
          </div>
        </>
      )}
    </ModalLayout>
  );
};

export default RedemptionHistoryModal;
