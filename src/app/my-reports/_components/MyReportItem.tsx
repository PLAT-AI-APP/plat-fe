"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import dayjs from "@/lib/dayjs";
import { cn } from "@/lib/utils";
import { ArrowDown } from "@/icons";
import type { MyReportItem as MyReportItemType, ReportCaseStatus } from "@/type/report";

/**
 * 상태 배지의 색. 접수됨은 아직 진행 중이라는 정보색, 조치 완료는 신고가 받아들여졌다는 성공색,
 * 위반 없음은 실패가 아니라 "문제없음"이므로 경고색 대신 중립색을 쓴다.
 */
const STATUS_BADGE_CLASS: Record<ReportCaseStatus, string> = {
  PENDING: "bg-info-bg text-info",
  ACTIONED: "bg-success-bg text-success",
  DISMISSED: "bg-card text-font-2",
};

const DATE_FORMAT = "YYYY.MM.DD";
const DATE_TIME_FORMAT = "YYYY.MM.DD HH:mm";

interface MyReportItemProps {
  item: MyReportItemType;
  /** 딥링크로 지목된 신고면 펼친 채로 시작하고 화면 안으로 스크롤한다. */
  defaultOpen?: boolean;
}

/** 신고 내역 한 건. 접힌 상태는 무엇을 왜 신고했는지, 펼치면 내가 쓴 내용과 처리 결과를 보여준다. */
const MyReportItem = ({ item, defaultOpen = false }: MyReportItemProps) => {
  const t = useTranslations("myReports");
  const reportT = useTranslations("report");
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const itemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!defaultOpen) return;
    itemRef.current?.scrollIntoView({ block: "center" });
  }, [defaultOpen]);

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <li
      ref={itemRef}
      className={cn(
        "w-full overflow-hidden rounded-2xl transition-colors",
        isOpen ? "bg-btn-hover" : "bg-dark hover:bg-btn-hover",
      )}
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        className="flex w-full flex-col gap-2 px-5 py-4 text-left"
      >
        <div className="flex w-full items-center justify-between gap-3">
          <span className="body-7 rounded-md bg-card px-2 py-0.5 text-font-2">
            {reportT(`targetTypes.${item.targetType}`)}
          </span>
          <div className="flex shrink-0 items-center gap-1.5">
            <span
              className={cn(
                "title-7 rounded-md px-2 py-0.5",
                STATUS_BADGE_CLASS[item.status],
              )}
            >
              {reportT(`statuses.${item.status}`)}
            </span>
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="flex w-3.5 items-center justify-center p-0.5"
            >
              <ArrowDown className="size-2.5 text-font-2" aria-hidden="true" />
            </motion.span>
          </div>
        </div>

        <div className="flex w-full min-w-0 flex-col gap-1">
          <strong className="title-5 truncate text-font-1">{item.target.title}</strong>
          <p className="body-6 line-clamp-2 break-all text-font-2">
            {item.target.excerpt}
          </p>
        </div>

        <p className="body-7 flex items-center gap-1.5 text-font-2">
          <span>{reportT(`reasons.${item.reason}`)}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={item.createdAt}>
            {t("reportedAt", { date: dayjs(item.createdAt).format(DATE_FORMAT) })}
          </time>
        </p>
      </button>

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
            <div className="mx-5 flex flex-col gap-4 border-t border-main pb-4 pt-4">
              <section className="flex flex-col gap-1">
                <h3 className="title-7 text-font-2">{t("detailLabel")}</h3>
                <p
                  className={cn(
                    "body-6 whitespace-pre-wrap break-all",
                    item.detail ? "text-font-1" : "text-font-disabled",
                  )}
                >
                  {item.detail || t("noDetail")}
                </p>
              </section>

              <section className="flex flex-col gap-1">
                <h3 className="title-7 text-font-2">{t("resultLabel")}</h3>
                {/* 신고자에게는 상태만 온다. 결과 문구는 상태별 고정 안내다(docs/19). */}
                <p className="body-6 rounded-xl bg-card px-3 py-2.5 text-font-1">
                  {reportT(`statusGuides.${item.status}`)}
                </p>
                {item.handledAt && (
                  <time dateTime={item.handledAt} className="body-7 text-font-2">
                    {t("handledAt", {
                      date: dayjs(item.handledAt).format(DATE_TIME_FORMAT),
                    })}
                  </time>
                )}
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

export default MyReportItem;
