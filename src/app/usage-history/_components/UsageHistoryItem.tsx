"use client";
import React, { useState } from "react";
import dayjs from "@/lib/dayjs";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown } from "@/icons";
import Copy from "@/icons/Copy";
import { UsageHistoryItemType } from "@/type/note";

/** 개별 리스트 아이템 컴포넌트 */
const UsageHistoryItem = ({ item }: { item: UsageHistoryItemType }) => {
  const [isOpen, setIsOpen] = useState(false);

  const isPlusNote = item.amount > 0;
  const expiryDate = new Date(item.createdAt);
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation(); // li 클릭 이벤트 전파 방지
    navigator.clipboard.writeText(item.transactionHash);
    alert("거래번호가 복사되었습니다.");
  };

  return (
    <li
      className={cn(
        "cursor-pointer px-5 py-3 rounded-2xl hover:bg-btn-hover transition-colors",
        isOpen && "bg-btn-hover",
      )}
      onClick={() => setIsOpen(!isOpen)}
    >
      <header className="flex justify-between">
        <div className="flex flex-col gap-1">
          <span className="body-6 text-font-2">
            {dayjs(item.createdAt).format("M월 DD일 HH:mm")}
          </span>
          <strong className="title-5 font-normal">{item.description}</strong>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex flex-col items-end">
            <p className="flex gap-1">
              <span
                className={cn("title-5", isPlusNote && "text-font-accents")}
              >
                {isPlusNote && "+"}
                {item.amount}
              </span>
              <span className="text-font-2 body-4">노트</span>
            </p>
            <time className="body-6 text-font-2">
              ~ {expiryDate.toLocaleDateString()}
            </time>
          </div>

          {/* 화살표 회전 애니메이션 */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ArrowDown className="w-2.5 h-2.5 text-font-2" />
          </motion.div>
        </div>
      </header>

      {/* 상세 내용 애니메이션 (AnimatePresence로 마운트/언마운트 감지) */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <hr className="my-3 text-border-main" />

            <div className="flex flex-col gap-1 body-6 text-font-2 pb-1">
              <p>상세설명: {item.detailDescription}</p>
              <p className="flex items-center gap-1">
                거래번호: {item.transactionHash}
                <button type="button" onClick={handleCopy} className="p-1">
                  <Copy className="w-4 h-4 hover:text-font-1 transition-colors" />
                </button>
              </p>
              <p>
                거래일시:{" "}
                {dayjs(item.createdAt).format("YYYY. MM. DD HH:mm:ss")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

export default UsageHistoryItem;
