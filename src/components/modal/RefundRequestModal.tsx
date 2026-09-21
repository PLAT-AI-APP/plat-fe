"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import ActiveButton from "../ActiveButton";
import SmartInput from "@/components/smart-input";
import { ModalLayout } from "../ModalLayout";
import { Close, Info } from "@/icons";
import IconButton from "@/components/ui/IconButton";
import { usePaymentOrderQuery } from "@/api/payment/getPaymentOrder";
import { usePaymentRefundMutation } from "@/api/payment/postPaymentRefund";
import { RefundRequestModalProps } from "@/type/modal";
import { showAppToast } from "@/lib/toast";
import dayjs from "@/lib/dayjs";
import { formatWithCommas, toMajorAmount } from "@/lib/utils";

const REASON_MAX_LENGTH = 255;

/** 충전 결제 한 건의 환불 신청. 신청 가능 여부(노트 사용·기한)는 서버가 판정하고 거절 사유는 토스트로 안내됩니다. */
const RefundRequestModal = ({ onClose, orderUid }: RefundRequestModalProps) => {
  const t = useTranslations("modalUi.refundRequest");
  const commonT = useTranslations("modalUi.common");
  const unitT = useTranslations("tokenCharge");
  const [reason, setReason] = useState("");

  const { data: order, isLoading } = usePaymentOrderQuery(orderUid);
  const { mutate: requestRefund, isPending } = usePaymentRefundMutation();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isPending || !order) return;

    requestRefund(
      { orderUid, reason: reason.trim() },
      {
        onSuccess: () => {
          showAppToast("success", t("successToast"));
          onClose();
        },
      },
    );
  };

  const rows = order
    ? [
        { label: t("productLabel"), value: order.productName },
        {
          label: t("amountLabel"),
          value: `${formatWithCommas(toMajorAmount(order.amountMinor, order.currency))}${unitT("priceUnit")}`,
        },
        {
          label: t("creditLabel"),
          value: `${formatWithCommas(order.creditAmount)}${unitT("noteUnit")}`,
        },
        {
          label: t("refundableUntilLabel"),
          value: order.refundableUntil
            ? dayjs(order.refundableUntil).format("YYYY. MM. DD HH:mm")
            : "-",
        },
      ]
    : [];

  return (
    <ModalLayout
      onClose={onClose}
      hasBackground
      className="w-[450px] max-w-[calc(100vw-40px)] rounded-3xl bg-dark p-5"
    >
      <form onSubmit={handleSubmit} className="flex flex-col">
        <header className="flex items-center justify-between pb-6">
          <h2 className="title-1">{t("title")}</h2>
          <IconButton size="xs" onClick={onClose} aria-label={commonT("close")}>
            <Close className="size-3.5" />
          </IconButton>
        </header>

        <dl className="flex min-h-[132px] flex-col gap-2 rounded-2xl bg-card px-4 py-3.5">
          {isLoading
            ? Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="h-5 animate-pulse rounded bg-card-hover" />
              ))
            : rows.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 body-5">
                  <dt className="text-font-2">{row.label}</dt>
                  <dd className="truncate text-font-1">{row.value}</dd>
                </div>
              ))}
        </dl>

        <p className="mt-3 flex gap-1.5 body-7 text-font-2">
          <Info className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
          {t("notice")}
        </p>

        <SmartInput
          type="textarea"
          name="reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          label={t("reasonLabel")}
          maxLength={REASON_MAX_LENGTH}
          minLine={4}
          maxLine={6}
          placeholder={t("reasonPlaceholder")}
          className="mt-6 flex-none"
        />

        <ActiveButton
          type="submit"
          isActive={Boolean(order) && !isPending}
          text={t("submit")}
          className="mt-6 h-[42px] rounded-xl"
        />
      </form>
    </ModalLayout>
  );
};

export default RefundRequestModal;
