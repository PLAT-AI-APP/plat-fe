"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dayjs from "@/lib/dayjs";
import { cn, formatWithCommas } from "@/lib/utils";
import { showAppToast } from "@/lib/toast";
import { ArrowDown } from "@/icons";
import Copy from "@/icons/Copy";
import { UsageHistoryItemType } from "@/type/note";

/** 만료일 노출이 필요한 지급성 내역인지 확인합니다. */
const shouldShowExpiryDate = (amount: number) => amount > 0;

/** 노트 만료일 표기 */
const getExpiryDateLabel = (createdAt: string) => {
  const expiryDate = dayjs(createdAt).add(1, "year");

  return `~ ${expiryDate.format("YYYY.MM.DD")} 까지`;
};

/** 상세설명에 보여줄 API 참조 정보를 고릅니다. */
const getLedgerDetailText = (item: UsageHistoryItemType) =>
  item.referenceType || item.description;

/** 개별 사용내역 아이템 */
const UsageHistoryItem = ({ item }: { item: UsageHistoryItemType }) => {
  const [isOpen, setIsOpen] = useState(false);

  const isPlusNote = item.amount > 0;
  const isExpiryVisible = shouldShowExpiryDate(item.amount);
  const amountText = `${isPlusNote ? "+" : ""}${formatWithCommas(item.amount)}`;

  const handleCopy = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigator.clipboard.writeText(item.referenceId);
    showAppToast("success", "거래번호가 복사되었습니다.");
  };

  return (
    <li
      className={cn(
        "w-full cursor-pointer overflow-hidden rounded-2xl px-5 py-3 transition-colors",
        isOpen ? "bg-btn-hover" : "bg-dark hover:bg-btn-hover",
      )}
      onClick={() => setIsOpen((prev) => !prev)}
    >
      <header className="flex items-center justify-between gap-4">
        <div className="flex w-[117px] shrink-0 flex-col gap-1">
          <time className="body-6 text-font-2">
            {dayjs(item.createdAt).format("M월 D일 HH:mm")}
          </time>
          <strong className="title-5 text-font-1">{item.description}</strong>
        </div>

        <div className="flex shrink-0 items-center justify-center gap-1.5">
          <div className="flex flex-col items-end justify-center gap-0.5">
            <p className="body-4 flex items-center gap-1 whitespace-nowrap">
              <span
                className={cn("title-5", isPlusNote && "text-brand-dark")}
              >
                {amountText}
              </span>
              <span className="text-font-2">노트</span>
            </p>

            {isExpiryVisible && (
              <time className="body-6 whitespace-nowrap text-font-2">
                {getExpiryDateLabel(item.createdAt)}
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
            <div className="mt-3 flex flex-col gap-1 border-t border-main pt-3 body-6 text-font-2">
              <p>상세설명: {getLedgerDetailText(item)}</p>
              <p className="flex items-end gap-1">
                <span className="truncate">거래번호: {item.referenceId}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex size-4 shrink-0 items-center justify-center rounded p-0.5 transition-colors hover:text-font-1"
                  aria-label="거래번호 복사"
                >
                  <Copy className="size-3" />
                </button>
              </p>
              <p>
                거래일시: {dayjs(item.createdAt).format("YYYY. MM. DD HH:mm:ss")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

export default UsageHistoryItem;
