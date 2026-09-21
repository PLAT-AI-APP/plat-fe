"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import dayjs from "@/lib/dayjs";
import { cn, formatWithCommas } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { showAppToast } from "@/lib/toast";
import { ArrowDown } from "@/icons";
import Copy from "@/icons/Copy";
import useToggle from "@/hooks/common/useToggle";
import { UsageHistoryItemType } from "@/type/note";
import { useModalStore } from "@/store/useModalStore";
import Button from "@/components/ui/Button";

/** 만료일 노출이 필요한 지급성 내역인지 확인합니다. */
const shouldShowExpiryDate = (amount: number) => amount > 0;

/** 노트 만료일. 지급일로부터 1년 뒤입니다. */
const getExpiryDate = (createdAt: string) =>
  dayjs(createdAt).add(1, "year").format("YYYY.MM.DD");

/** 상세설명에 보여줄 API 참조 정보를 고릅니다. */
const getLedgerDetailText = (item: UsageHistoryItemType) =>
  item.referenceType || item.description;

/** 결제로 충전된 줄인지. 이 줄의 참조 ID 가 곧 주문번호라 환불 신청에 그대로 씁니다. */
const isPaymentCharge = (item: UsageHistoryItemType) =>
  item.type === "CHARGE" && item.referenceType === "PAYMENT";

/** 개별 사용내역 아이템 */
const UsageHistoryItem = ({ item }: { item: UsageHistoryItemType }) => {
  const t = useTranslations();
  const { isOpen, toggle } = useToggle();
  const openModal = useModalStore((state) => state.openModal);

  const isPlusNote = item.amount > 0;
  const isExpiryVisible = shouldShowExpiryDate(item.amount);
  const amountText = `${isPlusNote ? "+" : ""}${formatWithCommas(item.amount)}`;

  const handleRefundRequest = (event: React.MouseEvent) => {
    event.stopPropagation();
    openModal("REFUND_REQUEST", { orderUid: item.referenceId });
  };

  const handleCopy = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigator.clipboard.writeText(item.referenceId);
    showAppToast("success", t("toast.transactionIdCopied"));
  };

  return (
    <li
      className={cn(
        "w-full cursor-pointer overflow-hidden rounded-2xl px-5 py-3 transition-colors",
        isOpen ? "bg-btn-hover" : "bg-dark hover:bg-btn-hover",
      )}
      onClick={toggle}
    >
      <header className="flex items-center justify-between gap-4">
        <div className="flex w-[117px] shrink-0 flex-col gap-1">
          <time className="body-7 text-font-2">
            {dayjs(item.createdAt).format(t("usageHistory.dateFormat"))}
          </time>
          <strong className="title-5 text-font-1">{item.description}</strong>
        </div>

        <div className="flex shrink-0 items-center justify-center gap-1.5">
          <div className="flex flex-col items-end justify-center gap-0.5">
            <p className="body-5 flex items-center gap-1 whitespace-nowrap">
              <span className={cn("title-5", isPlusNote && "text-brand-dark")}>
                {amountText}
              </span>
              <span className="text-font-2">{t("tokenCharge.noteUnit")}</span>
            </p>

            {isExpiryVisible && (
              <time className="body-7 whitespace-nowrap text-font-2">
                {t("usageHistory.expiresUntil", {
                  date: getExpiryDate(item.createdAt),
                })}
              </time>
            )}
          </div>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex w-3.5 shrink-0 items-center justify-center rounded-md p-0.5"
          >
            <ArrowDown className="size-2.5 text-font-2" />
          </motion.div>
        </div>
      </header>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-3 flex flex-col gap-1 border-t border-main pt-3 body-7 text-font-2">
              <p>
                {t("usageHistory.detailLabel")}: {getLedgerDetailText(item)}
              </p>
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
              {isPaymentCharge(item) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefundRequest}
                  className="mt-2 self-end"
                >
                  {t("usageHistory.refundRequest")}
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

export default UsageHistoryItem;
