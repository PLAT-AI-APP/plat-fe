"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Token from "@/icons/Token";
import { cn, formatWithCommas } from "@/lib/utils";
import { useWalletStore } from "@/store/useWalletStore";
import Badge from "./Badge";
import PolicyGuide from "./PolicyGuide";

export interface ProductItem {
  id: string;
  title: number;
  bonus?: string;
  price: number;
  originalPrice?: number;
  discountRate?: number;
  badges?: ("popular" | "firstCharge")[];
}

export const MOCK_PRODUCTS: ProductItem[] = [
  { id: "1", title: 5000, price: 4900 },
  { id: "2", title: 10000, bonus: "+500", price: 9900 },
  {
    id: "3",
    title: 20000,
    bonus: "+2,500",
    price: 19900,
    badges: ["firstCharge", "popular"],
  },
  {
    id: "4",
    title: 46000,
    bonus: "+5,000",
    price: 30900,
    originalPrice: 45900,
    discountRate: 34,
    badges: ["firstCharge"],
  },
  { id: "5", title: 90000, bonus: "+11,000", price: 89900 },
];

const TokenChargeContents = () => {
  const t = useTranslations();
  const availableBalance = useWalletStore(
    (state) => state.balance?.availableBalance ?? 0,
  );

  return (
    <section className="mx-auto w-full max-w-160 px-9 pt-5">
      <div className="mb-9 flex items-center justify-between gap-4 rounded-3xl border border-border-main bg-bg-darker px-5 py-4">
        <div className="flex flex-col gap-2">
          <span className="body-4 text-font-2">{t("tokenCharge.myNote")}</span>
          <div className="title-1 flex items-center gap-2">
            <Token className="h-6 w-6" /> {formatWithCommas(availableBalance)}
          </div>
        </div>

        <Link
          href="/usage-history"
          className="body-4 shrink-0 rounded-2xl bg-border-main px-4 py-2 text-white transition-colors hover:bg-btn-hover"
        >
          {t("tokenCharge.viewUsageHistory")}
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="title-2 text-white">{t("tokenCharge.purchase")}</h3>

        <ul className="flex flex-col gap-3">
          {MOCK_PRODUCTS.map((product) => (
            <li
              key={product.id}
              className={cn(
                "relative cursor-pointer rounded-2xl border border-border-main px-5 py-4 hover:bg-btn-hover",
                product.badges && "pt-0",
              )}
            >
              {product.badges && (
                <div className="flex gap-2 pb-3">
                  {product.badges.map((badge) => (
                    <Badge type={badge} key={badge} />
                  ))}
                </div>
              )}

              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <Token className="h-8 w-8" />
                  <div className="flex gap-2">
                    <p className="body-2 flex gap-1">
                      <span>{formatWithCommas(product.title)}</span>
                      <span>{t("tokenCharge.noteUnit")}</span>
                    </p>

                    {product.bonus && (
                      <span className="title-3 text-brand-dark">
                        {product.bonus}
                        {t("tokenCharge.bonusNoteUnit")}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  {product.discountRate && (
                    <span className="body-5 text-font-disabled line-through">
                      {product.originalPrice}
                    </span>
                  )}
                  <div className="flex items-center gap-1.5">
                    {product.discountRate && (
                      <span className="title-5 text-brand">
                        {product.discountRate}%
                      </span>
                    )}

                    <span className="title-3">
                      {formatWithCommas(product.price)}
                      {t("tokenCharge.priceUnit")}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <PolicyGuide />
    </section>
  );
};

export default TokenChargeContents;
