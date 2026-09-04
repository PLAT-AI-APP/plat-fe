"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useProductsQuery } from "@/api/product/getProducts";
import Token from "@/icons/Token";
import { formatWithCommas, toMajorAmount } from "@/lib/utils";
import { useWalletStore } from "@/store/useWalletStore";
import type { Product } from "@/type/product";
import PolicyGuide from "./PolicyGuide";
import PageTitle from "@/components/PageTitle";
import { ErrorState } from "@/components/state";

interface ProductListItemProps {
  product: Product;
}

const ProductListItem = ({ product }: ProductListItemProps) => {
  const t = useTranslations();
  const { credits, price } = product;
  const displayPrice = toMajorAmount(price.amountMinor, price.currency);

  return (
    <li className="relative cursor-pointer rounded-2xl border border-main px-5 py-4 transition-colors hover:bg-btn-hover">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Token className="h-8 w-8" />
          <div className="flex items-center gap-2">
            <p className="body-2 flex gap-1">
              <span>{formatWithCommas(credits.base)}</span>
              <span>{t("tokenCharge.noteUnit")}</span>
            </p>

            {credits.bonus > 0 && (
              <span className="title-3 text-brand-dark">
                +{formatWithCommas(credits.bonus)}
                {t("tokenCharge.bonusNoteUnit")}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="title-3">
            {formatWithCommas(displayPrice)}
            {t("tokenCharge.priceUnit")}
          </span>
        </div>
      </div>
    </li>
  );
};

/** 상품 목록을 불러오는 동안 목록 자리를 유지하는 스켈레톤 */
const ProductListSkeleton = () => (
  <ul className="flex animate-pulse flex-col gap-3">
    {Array.from({ length: 5 }).map((_, index) => (
      <li
        key={index}
        className="h-[74px] rounded-2xl border border-main bg-darker"
      />
    ))}
  </ul>
);

const TokenChargeContents = () => {
  const t = useTranslations();
  const availableBalance = useWalletStore(
    (state) => state.balance?.availableBalance ?? 0,
  );
  // isPending 은 로그인 전 비활성 상태에서도 true 라 스켈레톤이 걷히지 않는다.
  const {
    data: products,
    error,
    isLoading,
    isError,
    refetch,
  } = useProductsQuery();

  return (
    <section className="mx-auto w-full max-w-160 pt-5">
      <PageTitle messageKey="tokenCharge.title" />

      <div className="mb-9 flex items-center justify-between gap-4 rounded-3xl border border-main bg-darker px-5 py-4">
        <div className="flex flex-col gap-2">
          <span className="body-4 text-font-2">{t("tokenCharge.myNote")}</span>
          <div className="title-1 flex items-center gap-2">
            <Token className="h-6 w-6" /> {formatWithCommas(availableBalance)}
          </div>
        </div>

        <Link
          href="/usage-history"
          className="body-4 shrink-0 rounded-2xl bg-main px-4 py-2 text-font-1 transition-colors hover:bg-btn-hover"
        >
          {t("tokenCharge.viewUsageHistory")}
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="title-2 text-font-0">{t("tokenCharge.purchase")}</h2>

        {isLoading && <ProductListSkeleton />}

        {/* 서버가 준 사유와(개발 모드에서는) 실패한 요청까지 함께 보여주고 재시도를 제공한다. */}
        {isError && <ErrorState error={error} onRetry={refetch} />}

        {products && products.length === 0 && (
          <p className="body-4 py-10 text-center text-font-2">
            {t("tokenCharge.empty")}
          </p>
        )}

        {products && products.length > 0 && (
          <ul className="flex flex-col gap-3">
            {products.map((product) => (
              <ProductListItem key={product.productId} product={product} />
            ))}
          </ul>
        )}
      </div>

      <PolicyGuide />
    </section>
  );
};

export default TokenChargeContents;
