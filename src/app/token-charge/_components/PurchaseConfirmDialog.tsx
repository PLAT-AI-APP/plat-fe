"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { ModalLayout } from "@/components/ModalLayout";
import CheckboxEmpty from "@/icons/CheckboxEmpty";
import CheckboxFill from "@/icons/CheckboxFill";
import { cn, formatWithCommas, toMajorAmount } from "@/lib/utils";
import type { Product } from "@/type/product";

interface PurchaseConfirmDialogProps {
  product: Product;
  onClose: () => void;
  /** 결제창은 이 클릭 안에서 열어야 팝업 차단에 걸리지 않으므로 동기로 호출한다. */
  onConfirm: (product: Product) => void;
}

/** 결제 전에 계약 내용(상품·금액·유효기간·청약철회 조건)을 보여 주고 동의를 받는다. */
const PurchaseConfirmDialog = ({
  product,
  onClose,
  onConfirm,
}: PurchaseConfirmDialogProps) => {
  const t = useTranslations("tokenCharge.confirm");
  const tc = useTranslations("tokenCharge");
  const [agreed, setAgreed] = useState(false);
  const { credits, price } = product;
  const displayPrice = toMajorAmount(price.amountMinor, price.currency);

  const rows = [
    { label: t("product"), value: product.display.name },
    {
      label: t("notes"),
      value:
        credits.bonus > 0
          ? t("notesWithBonus", {
              total: formatWithCommas(credits.total),
              base: formatWithCommas(credits.base),
              bonus: formatWithCommas(credits.bonus),
            })
          : `${formatWithCommas(credits.total)}${tc("noteUnit")}`,
    },
    {
      label: t("price"),
      value: `${formatWithCommas(displayPrice)}${tc("priceUnit")}${
        price.taxIncluded ? ` ${t("vatIncluded")}` : ""
      }`,
    },
    { label: t("validity"), value: t("validityValue") },
  ];

  const handleConfirm = () => {
    if (!agreed) return;
    onConfirm(product);
  };

  return (
    <ModalLayout
      hasBackground
      onClose={onClose}
      className="w-[385px] max-w-[calc(100vw-40px)] overflow-hidden rounded-3xl bg-dark px-6 pb-6 pt-8"
    >
      <div id="purchase-confirm-dialog" className="flex w-full flex-col gap-6">
        <h2 className="title-2 text-font-1">{t("title")}</h2>

        <dl className="flex flex-col gap-2.5">
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between gap-4">
              <dt className="body-5 shrink-0 text-font-2">{row.label}</dt>
              <dd className="body-5 text-right text-font-1">{row.value}</dd>
            </div>
          ))}
        </dl>

        <p className="body-6 whitespace-pre-line rounded-xl bg-darker px-4 py-3 text-font-2">
          {t("refundNotice")}
        </p>

        <button
          id="purchase-confirm-agree"
          type="button"
          role="checkbox"
          aria-checked={agreed}
          onClick={() => setAgreed((prev) => !prev)}
          className="flex items-center gap-2 text-left"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center">
            {agreed ? <CheckboxFill className="text-brand" /> : <CheckboxEmpty />}
          </span>
          <span className="body-5 text-font-1">{t("agree")}</span>
        </button>

        <div className="title-5 flex w-full gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 flex-1 items-center justify-center rounded-xl bg-card px-6 text-font-1 transition-colors hover:bg-card-hover"
          >
            {t("cancel")}
          </button>
          <button
            id="purchase-confirm-submit"
            type="button"
            onClick={handleConfirm}
            disabled={!agreed}
            className={cn(
              "flex h-10 flex-1 items-center justify-center rounded-xl bg-brand px-6 text-on-brand transition-opacity hover:opacity-90",
              "disabled:cursor-not-allowed disabled:opacity-40",
            )}
          >
            {t("submit")}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default PurchaseConfirmDialog;
