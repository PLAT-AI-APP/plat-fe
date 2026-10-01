"use client";

import React, { useId } from "react";
import { AnimatePresence, m } from "framer-motion";
import dayjs from "@/lib/dayjs";
import { cn, formatWithCommas } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { showAppToast } from "@/lib/toast";
import { ArrowDown } from "@/icons";
import Copy from "@/icons/Copy";
import useToggle from "@/hooks/common/useToggle";
import { UsageHistoryItemType } from "@/type/note";

type LedgerTitleKey =
  | "payment"
  | "adminGrant"
  | "event"
  | "promotion"
  | "earningExchange"
  | "refundRestore"
  | "charge"
  | "chat"
  | "imageGeneration"
  | "use"
  | "refund"
  | "expire"
  | "adminDeduct";

/** 충전·지급 항목의 참조 유형(서버 CreditSource·CreditConstants)별 제목 */
const CHARGE_TITLE_BY_REFERENCE: Record<string, LedgerTitleKey> = {
  PAYMENT: "payment",
  ADMIN: "adminGrant",
  EVENT: "event",
  PROMOTION: "promotion",
  EARNING_EXCHANGE: "earningExchange",
  REFUND_RESTORE: "refundRestore",
};

/** 사용 항목의 참조 유형별 제목 */
const USE_TITLE_BY_REFERENCE: Record<string, LedgerTitleKey> = {
  CHAT_TURN: "chat",
  IMAGE_GENERATION: "imageGeneration",
};

/** 원장 유형·참조 유형으로 정한 제목 키. 모르는 조합이면 null — 그때만 서버 설명을 제목으로 쓴다. */
const getTitleKey = (item: UsageHistoryItemType): LedgerTitleKey | null => {
  switch (item.type) {
    case "CHARGE":
      return CHARGE_TITLE_BY_REFERENCE[item.referenceType] ?? null;
    case "USE":
      return USE_TITLE_BY_REFERENCE[item.referenceType] ?? null;
    case "REFUND":
      return "refund";
    case "EXPIRE":
      return "expire";
    case "ADMIN_DEDUCT":
      return "adminDeduct";
    default:
      return null;
  }
};

/** 설명마저 비었을 때 유형만으로 붙이는 제목 */
const getFallbackTitleKey = (item: UsageHistoryItemType): LedgerTitleKey =>
  item.amount > 0 ? "charge" : "use";

/** 클립보드는 https·권한이 있어야 쓸 수 있다. 못 쓰면 false. */
const copyText = async (text: string) => {
  try {
    if (!navigator.clipboard?.writeText) return false;
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/** 개별 사용내역 아이템 */
const UsageHistoryItem = ({ item }: { item: UsageHistoryItemType }) => {
  const t = useTranslations();
  const { isOpen, toggle } = useToggle();
  const detailId = useId();

  const isPlusNote = item.amount > 0;
  const amountText = `${isPlusNote ? "+" : ""}${formatWithCommas(item.amount)}`;
  const titleKey = getTitleKey(item);
  const description = item.description?.trim() ?? "";
  const title = titleKey
    ? t(`usageHistory.titles.${titleKey}`)
    : description || t(`usageHistory.titles.${getFallbackTitleKey(item)}`);
  // 만료일은 서버가 준 값만 보인다. 없으면(사용 항목·옛 응답) 지어내지 않는다.
  const expiresAt = item.expiresAt ? dayjs(item.expiresAt) : null;

  const handleCopy = async () => {
    const isCopied = await copyText(item.referenceId);
    if (isCopied) {
      showAppToast("success", t("toast.transactionIdCopied"));
    } else {
      showAppToast("error", t("usageHistory.copyFailed"));
    }
  };

  return (
    <li
      className={cn(
        "w-full overflow-hidden rounded-2xl transition-colors",
        isOpen ? "bg-btn-hover" : "bg-dark hover:bg-btn-hover",
      )}
    >
      {/* 펼치기는 키보드·스크린리더로도 쓸 수 있어야 해서 머리 부분 전체를 버튼으로 둔다.
          거래번호 복사 버튼은 이 버튼 밖(펼친 내용)에 있어 버튼이 겹치지 않는다. */}
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls={detailId}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-3 text-left"
      >
        <span className="flex min-w-[117px] flex-col gap-1">
          <time className="body-7 text-font-2" dateTime={item.createdAt}>
            {dayjs(item.createdAt).format(t("usageHistory.dateFormat"))}
          </time>
          <strong className="title-5 text-font-1">{title}</strong>
        </span>

        <span className="flex shrink-0 items-center justify-center gap-1.5">
          <span className="flex flex-col items-end justify-center gap-0.5">
            <span className="body-5 flex items-center gap-1 whitespace-nowrap">
              <span className={cn("title-5", isPlusNote && "text-brand-dark")}>
                {amountText}
              </span>
              <span className="text-font-2">{t("tokenCharge.noteUnit")}</span>
            </span>

            {expiresAt?.isValid() && (
              <time
                className="body-7 whitespace-nowrap text-font-2"
                dateTime={item.expiresAt ?? undefined}
              >
                {t("usageHistory.expiresUntil", {
                  date: expiresAt.format("YYYY.MM.DD"),
                })}
              </time>
            )}
          </span>

          <m.span
            aria-hidden
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex w-3.5 shrink-0 items-center justify-center rounded-md p-0.5"
          >
            <ArrowDown className="size-2.5 text-font-2" />
          </m.span>
          <span className="sr-only">{t("usageHistory.toggleDetail")}</span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <m.div
            key="content"
            id={detailId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden px-5"
          >
            <div className="flex flex-col gap-1 border-t border-main pt-3 pb-3 body-7 text-font-2">
              {/* 상세설명은 서버가 사용자용으로 쓴 설명만 보인다. 참조 유형 enum 은 내부 값이라 보이지 않는다. */}
              {description && (
                <p>
                  {t("usageHistory.detailLabel")}: {description}
                </p>
              )}
              <p className="flex items-end gap-1">
                <span className="truncate">
                  {t("usageHistory.transactionIdLabel")}: {item.referenceId}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex size-4 shrink-0 items-center justify-center rounded p-0.5 transition-colors hover:text-font-1"
                  aria-label={t("usageHistory.copyTransactionId")}
                >
                  <Copy className="size-3" />
                </button>
              </p>
              <p>
                {t("usageHistory.transactionDateLabel")}:{" "}
                {dayjs(item.createdAt).format("YYYY. MM. DD HH:mm:ss")}
              </p>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </li>
  );
};

export default UsageHistoryItem;
