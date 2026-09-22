"use client";

import React, { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useTranslations } from "next-intl";
import dayjs from "@/lib/dayjs";
import { cn, formatWithCommas, toMajorAmount } from "@/lib/utils";
import { ArrowDown } from "@/icons";
import type { MyQnaItem as MyQnaItemType, QnaStatus } from "@/type/qna";

/** 답변 대기는 진행 중이라는 정보색, 답변 완료는 성공색. */
const STATUS_BADGE_CLASS: Record<QnaStatus, string> = {
  OPEN: "bg-info-bg text-info",
  ANSWERED: "bg-success-bg text-success",
};

const DATE_FORMAT = "YYYY.MM.DD";
const DATE_TIME_FORMAT = "YYYY.MM.DD HH:mm";

interface MyQnaItemProps {
  item: MyQnaItemType;
}

/**
 * 문의 한 건. 접힌 상태는 유형·상태·제목, 펼치면 내가 쓴 내용과 운영팀 답변을 보여준다.
 * 환불 문의는 신청 내역을 함께 보여 주고, 환불 결과는 운영팀 답변으로 전달된다.
 */
const MyQnaItem = ({ item }: MyQnaItemProps) => {
  const t = useTranslations("customerService.qna");
  const unitT = useTranslations("tokenCharge");
  const [isOpen, setIsOpen] = useState(false);
  const { refund } = item;

  return (
    <li
      className={cn(
        "w-full overflow-hidden rounded-2xl transition-colors",
        isOpen ? "bg-btn-hover" : "bg-dark hover:bg-btn-hover",
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full flex-col gap-2 px-5 py-4 text-left"
      >
        <div className="flex w-full items-center justify-between gap-3">
          <span className="body-7 rounded-md bg-card px-2 py-0.5 text-font-2">
            {t(`categories.${item.category}`)}
          </span>
          <div className="flex shrink-0 items-center gap-1.5">
            <span
              className={cn(
                "title-7 rounded-md px-2 py-0.5",
                STATUS_BADGE_CLASS[item.status],
              )}
            >
              {t(`statuses.${item.status}`)}
            </span>
            <m.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="flex w-3.5 items-center justify-center p-0.5"
            >
              <ArrowDown className="size-2.5 text-font-2" aria-hidden="true" />
            </m.span>
          </div>
        </div>

        <strong className="title-5 truncate text-font-1">{item.title}</strong>

        <p className="body-7 text-font-2">
          <time dateTime={item.createdAt}>
            {t("askedAt", { date: dayjs(item.createdAt).format(DATE_FORMAT) })}
          </time>
        </p>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <m.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mx-5 flex flex-col gap-4 border-t border-main pb-4 pt-4">
              {refund && (
                <section className="flex flex-col gap-1">
                  <h3 className="title-7 text-font-2">{t("refundLabel")}</h3>
                  <dl className="body-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-xl bg-card px-3 py-2.5">
                    <dt className="text-font-2">{t("refundProduct")}</dt>
                    <dd className="text-font-1">{refund.productName}</dd>
                    <dt className="text-font-2">{t("refundAmount")}</dt>
                    <dd className="text-font-1">
                      {formatWithCommas(
                        toMajorAmount(refund.amountMinor, refund.currency),
                      )}
                      {unitT("priceUnit")}
                    </dd>
                    <dt className="text-font-2">{t("refundCredit")}</dt>
                    <dd className="text-font-1">
                      {t("creditUnit", {
                        count: formatWithCommas(refund.creditAmount),
                      })}
                    </dd>
                    <dt className="text-font-2">{t("orderUid")}</dt>
                    <dd className="text-font-1">{refund.orderUid}</dd>
                  </dl>
                </section>
              )}

              <section className="flex flex-col gap-1">
                <h3 className="title-7 text-font-2">
                  {refund ? t("refundReasonLabel") : t("myContentLabel")}
                </h3>
                <p className="body-6 whitespace-pre-wrap break-all text-font-1">
                  {item.content || t("noContent")}
                </p>
              </section>

              <section className="flex flex-col gap-1">
                <h3 className="title-7 text-font-2">{t("answerLabel")}</h3>
                <p
                  className={cn(
                    "body-6 whitespace-pre-wrap break-keep rounded-xl bg-card px-3 py-2.5",
                    item.answer ? "text-font-1" : "text-font-2",
                  )}
                >
                  {item.answer ?? t("waitingAnswer")}
                </p>
                {item.answeredAt && (
                  <time
                    dateTime={item.answeredAt}
                    className="body-7 text-font-2"
                  >
                    {t("answeredAt", {
                      date: dayjs(item.answeredAt).format(DATE_TIME_FORMAT),
                    })}
                  </time>
                )}
              </section>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </li>
  );
};

export default MyQnaItem;
