"use client";

import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { type ReactNode, useEffect, useState } from "react";
import { Check, Close } from "@/icons";
import StatusWarning from "@/icons/StatusWarning";
import { cn } from "@/lib/utils";
import type { WithdrawalChecks } from "@/type/withdrawal";

/** 하나씩 확인해 가는 것처럼 보이게 결과를 이 간격으로 차례로 연다. */
const REVEAL_INTERVAL_MS = 280;
/** 다시 확인은 결과를 최소 이만큼 "확인 중"으로 보인 뒤에 연다. 바로 바뀌면 눌린 줄 모른다. */
const RETRY_MIN_CHECKING_MS = 600;
/** 다시 확인 결과가 나온 뒤 이만큼은 다시 누를 수 없다. 연타로 요청이 쌓이지 않게. */
const RETRY_COOLDOWN_MS = 1000;
const ROW_COUNT = 5;

/** warning: 알리기만 하고 탈퇴는 된다(주황). error: 탈퇴가 막힌다(빨강). */
type RowState = "checking" | "ok" | "warning" | "error" | "todo";

interface RowProps {
  state: RowState;
  title: string;
  action?: ReactNode;
}

const StatusIcon = ({ state }: { state: RowState }) => {
  if (state === "checking") {
    return (
      <span className="flex size-6 shrink-0 items-center justify-center">
        <span className="size-4 animate-spin rounded-full border-2 border-main border-t-font-2" />
      </span>
    );
  }
  if (state === "ok") {
    return (
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-success-bg text-success">
        <Check size={14} />
      </span>
    );
  }
  if (state === "error") {
    return (
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-danger-bg text-danger">
        <Close size={12} />
      </span>
    );
  }
  if (state === "warning") {
    return (
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-warning-bg text-warning">
        <StatusWarning size={14} />
      </span>
    );
  }
  // 직접 확인해야 하는 항목. 확인을 누르면 체크로 바뀐다.
  return (
    <span className="flex size-6 shrink-0 items-center justify-center">
      <span className="size-4 rounded-full border-2 border-font-disabled" />
    </span>
  );
};

const Row = ({ state, title, action }: RowProps) => (
  <li className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
    <span aria-hidden="true">
      <StatusIcon state={state} />
    </span>
    <p
      className={cn(
        "body-5 min-w-0 flex-1 break-keep",
        state === "checking" && "text-font-disabled",
        state === "warning" && "text-warning",
        state === "error" && "text-danger",
        (state === "ok" || state === "todo") && "text-font-1",
      )}
    >
      {title}
    </p>
    {action}
  </li>
);

interface WithdrawalChecklistProps {
  checks?: WithdrawalChecks;
  /** 확인을 받지 못했다. 탈퇴 요청 때 서버가 다시 막으므로 화면은 막지 않고 다시 확인만 권한다. */
  checksFailed: boolean;
  onRetry: () => Promise<unknown>;
  /** 남은 노트·수익 포인트. 아직 모르면 undefined. */
  credits?: number;
  points?: number;
  creditsAcknowledged: boolean;
  pointsAcknowledged: boolean;
  onAcknowledgeCredits: () => void;
  onAcknowledgePoints: () => void;
}

/**
 * 탈퇴 전 확인. 탈퇴를 막는 처리 중인 환불·발송 대기 상품권 교환, 막지는 않지만 알릴 답변 대기 문의,
 * 사라지는 노트·수익 포인트(직접 확인)를 하나씩 보여 준다.
 */
const WithdrawalChecklist = ({
  checks,
  checksFailed,
  onRetry,
  credits,
  points,
  creditsAcknowledged,
  pointsAcknowledged,
  onAcknowledgeCredits,
  onAcknowledgePoints,
}: WithdrawalChecklistProps) => {
  const t = useTranslations("withdrawalPage.checks");
  const reduceMotion = useReducedMotion();
  const isReady = Boolean(checks || checksFailed) && credits !== undefined && points !== undefined;
  const [revealed, setRevealed] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isRetryCoolingDown, setIsRetryCoolingDown] = useState(false);

  // 다시 확인: 요청은 바로 보내고, 서버에 묻는 세 항목을 최소 0.6초 "확인 중"으로 보인 뒤 결과를 연다.
  // 결과가 나온 뒤 1초 동안은 다시 누를 수 없다.
  const handleRetry = () => {
    if (isRetrying || isRetryCoolingDown) return;
    setIsRetrying(true);
    const startedAt = Date.now();
    void onRetry().finally(() => {
      const remaining = Math.max(0, RETRY_MIN_CHECKING_MS - (Date.now() - startedAt));
      window.setTimeout(() => {
        setIsRetrying(false);
        setIsRetryCoolingDown(true);
        window.setTimeout(() => setIsRetryCoolingDown(false), RETRY_COOLDOWN_MS);
      }, remaining);
    });
  };

  useEffect(() => {
    if (!isReady || reduceMotion || revealed >= ROW_COUNT) return;
    const timer = window.setTimeout(() => setRevealed((count) => count + 1), REVEAL_INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [isReady, reduceMotion, revealed]);

  const visibleCount = !isReady ? 0 : reduceMotion ? ROW_COUNT : revealed;
  const isShown = (index: number) => index < visibleCount;
  /** 서버에 묻는 항목(환불·상품권 교환·문의). 다시 확인하는 동안은 "확인 중"으로 돌린다. */
  const isCheckShown = (index: number) => isShown(index) && !isRetrying;
  const checking = (item: string): RowProps => ({ state: "checking", title: t("checking", { item: t(`items.${item}`) }) });
  const failed = (item: string): RowProps => ({
    state: "warning",
    title: t("failed", { item: t(`items.${item}`) }),
    action: (
      <button
        type="button"
        onClick={handleRetry}
        disabled={isRetrying || isRetryCoolingDown}
        className="title-7 shrink-0 text-font-2 underline-offset-2 enabled:hover:text-font-1 enabled:hover:underline disabled:text-font-disabled"
      >
        {t("retry")}
      </button>
    ),
  });

  const acknowledgeButton = (onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      // 아이콘(24px)과 같은 높이라 다른 줄과 높이가 같다.
      className="title-7 h-6 shrink-0 rounded-md border border-main px-2.5 text-font-1 transition-colors hover:bg-btn-hover"
    >
      {t("acknowledge")}
    </button>
  );

  const rows: RowProps[] = [
    !isCheckShown(0)
      ? checking("refund")
      : !checks
        ? failed("refund")
        : checks.refundPending
          ? { state: "error", title: t("refundPending") }
          : { state: "ok", title: t("refundOk") },
    !isCheckShown(1)
      ? checking("redemption")
      : !checks
        ? failed("redemption")
        : checks.redemptionPending
          ? { state: "error", title: t("redemptionPending") }
          : { state: "ok", title: t("redemptionOk") },
    !isCheckShown(2)
      ? checking("inquiry")
      : !checks
        ? failed("inquiry")
        : checks.unansweredInquiryCount > 0
          ? {
              state: "warning",
              title: t("inquiryPending", { count: checks.unansweredInquiryCount }),
              action: (
                <Link
                  href="/customer-service/qna"
                  className="title-7 shrink-0 text-font-2 underline-offset-2 hover:text-font-1 hover:underline"
                >
                  {t("inquiryView")}
                </Link>
              ),
            }
          : { state: "ok", title: t("inquiryOk") },
    !isShown(3) || credits === undefined
      ? checking("credits")
      : credits === 0
        ? { state: "ok", title: t("creditsNone") }
        : {
            state: creditsAcknowledged ? "ok" : "todo",
            title: t("creditsLost", { count: credits.toLocaleString() }),
            action: creditsAcknowledged ? undefined : acknowledgeButton(onAcknowledgeCredits),
          },
    !isShown(4) || points === undefined
      ? checking("points")
      : points === 0
        ? { state: "ok", title: t("pointsNone") }
        : {
            state: pointsAcknowledged ? "ok" : "todo",
            title: t("pointsLost", { points: points.toLocaleString() }),
            action: pointsAcknowledged ? undefined : acknowledgeButton(onAcknowledgePoints),
          },
  ];

  return (
    <section
      id="withdrawal-checks"
      aria-labelledby="withdrawal-checks-title"
      aria-busy={visibleCount < ROW_COUNT || undefined}
      className="flex flex-col gap-3 rounded-3xl border border-main bg-darkest px-5 py-5"
    >
      <h3 id="withdrawal-checks-title" className="title-5 text-font-1">
        {t("title")}
      </h3>
      <ul className="flex flex-col divide-y divide-main">
        {rows.map((row, index) => (
          <Row key={index} {...row} />
        ))}
      </ul>
    </section>
  );
};

export default WithdrawalChecklist;
