"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePaymentRefundMutation } from "@/api/payment/postPaymentRefund";
import { usePostQnaMutation } from "@/api/qna/postQna";
import ActiveButton from "@/components/ActiveButton";
import SmartInput from "@/components/smart-input";
import { ChipButton } from "@/components/ui/Button";
import { showAppToast } from "@/lib/toast";
import type { QnaWritableCategory } from "@/type/qna";
import CustomerServiceHeader from "../../../_components/CustomerServiceHeader";
import RefundOrderPicker from "./RefundOrderPicker";

const TITLE_MAX_LENGTH = 60;
const CONTENT_MAX_LENGTH = 1000;
/** 서버 환불 사유 컬럼(255자)에 맞춘다. */
const REFUND_REASON_MAX_LENGTH = 255;

/** 작성 화면에서 고르는 문의 유형. 환불은 오류 신고와 기타 사이에 둔다. */
const WRITE_CATEGORIES = ["ACCOUNT", "PAYMENT", "CHARACTER", "BUG", "REFUND", "ETC"] as const;
type WriteCategory = (typeof WRITE_CATEGORIES)[number];

const QNA_LIST_PATH = "/customer-service/qna";

/**
 * 1:1 문의 작성.
 *
 * 환불도 여기서 받는다. 유형을 환불로 고르면 제목 대신 환불할 결제를 고르고, 제출은 기존 환불 신청
 * API(`POST /payments/orders/{orderUid}/cancel`)로 보낸다. 서버가 환불을 접수하면서 환불 문의를 함께 열고,
 * 결과는 운영팀이 그 문의에 답변으로 단다.
 */
const QnaWriteContents = () => {
  const t = useTranslations("customerService");
  const router = useRouter();
  const { mutate: postQna, isPending: isQnaPending } = usePostQnaMutation();
  const { mutate: requestRefund, isPending: isRefundPending } = usePaymentRefundMutation();

  const [category, setCategory] = useState<WriteCategory>(WRITE_CATEGORIES[0]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [orderUid, setOrderUid] = useState<string | null>(null);

  const isRefund = category === "REFUND";
  const isPending = isQnaPending || isRefundPending;
  // 환불 사유는 기존 환불 신청과 같이 선택 입력이다.
  const canSubmit = isRefund
    ? Boolean(orderUid)
    : title.trim().length > 0 && content.trim().length > 0;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit || isPending) return;

    if (isRefund && orderUid) {
      requestRefund(
        { orderUid, reason: content.trim() },
        {
          onSuccess: ({ isExisting }) => {
            // 이미 신청한 결제면 새로 접수하지 않고 기존 문의의 결과를 안내한다.
            showAppToast(
              isExisting ? "info" : "success",
              isExisting ? t("refund.existingToast") : t("refund.successToast"),
              { description: t("refund.successDescription") },
            );
            router.push(QNA_LIST_PATH);
          },
        },
      );
      return;
    }

    postQna(
      { category: category as QnaWritableCategory, title: title.trim(), content: content.trim() },
      {
        onSuccess: () => {
          showAppToast("success", t("write.success"));
          router.push(QNA_LIST_PATH);
        },
      },
    );
  };

  const handleChangeCategory = (next: WriteCategory) => {
    setCategory(next);
    // 환불 사유는 255자라 일반 문의에서 넘어오면 잘라 둔다.
    if (next === "REFUND") setContent((prev) => prev.slice(0, REFUND_REASON_MAX_LENGTH));
  };

  return (
    <section className="mx-auto flex w-full max-w-155 flex-col gap-6 pt-5">
      <CustomerServiceHeader />

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <h2 className="title-3 text-font-1">{t("write.title")}</h2>

        <div className="flex flex-col gap-2">
          <p className="title-5 text-font-1">{t("write.categoryLabel")}</p>
          <div className="flex flex-wrap gap-2">
            {WRITE_CATEGORIES.map((id) => (
              <ChipButton
                key={id}
                selected={category === id}
                onClick={() => handleChangeCategory(id)}
              >
                {t(`qna.categories.${id}`)}
              </ChipButton>
            ))}
          </div>
        </div>

        {isRefund ? (
          <>
            <div className="flex flex-col gap-2">
              <p className="title-5 text-font-1">{t("refund.orderLabel")}</p>
              <p className="body-6 rounded-xl bg-card px-3 py-2.5 text-font-2">
                {t("refund.notice")}
              </p>
              <RefundOrderPicker selectedOrderUid={orderUid} onSelect={setOrderUid} />
            </div>

            <SmartInput
              type="textarea"
              name="reason"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              label={t("refund.reasonLabel")}
              maxLength={REFUND_REASON_MAX_LENGTH}
              minLine={4}
              maxLine={6}
              placeholder={t("refund.reasonPlaceholder")}
            />
          </>
        ) : (
          <>
            <SmartInput
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              label={t("write.titleLabel")}
              maxLength={TITLE_MAX_LENGTH}
              placeholder={t("write.titlePlaceholder")}
            />

            <SmartInput
              type="textarea"
              name="content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              label={t("write.contentLabel")}
              maxLength={CONTENT_MAX_LENGTH}
              minLine={8}
              maxLine={14}
              placeholder={t("write.contentPlaceholder")}
            />
          </>
        )}

        <ActiveButton
          type="submit"
          isActive={canSubmit && !isPending}
          text={isRefund ? t("refund.submit") : t("write.submit")}
        />
      </form>
    </section>
  );
};

export default QnaWriteContents;
