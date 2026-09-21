"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useProductsQuery } from "@/api/product/getProducts";
import { useFadeInAfterLoading } from "@/hooks/common/useFadeInAfterLoading";
import { usePostPaymentOrderMutation } from "@/api/payment/postPaymentOrder";
import { useModalStore } from "@/store/useModalStore";
import { showAppToast } from "@/lib/toast";
import { useUsageHistoryListQuery } from "@/api/note/getUsageHistoryList";
import Token from "@/icons/Token";
import { cn, formatWithCommas, toMajorAmount } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useWalletStore } from "@/store/useWalletStore";
import type { Product } from "@/type/product";
import PolicyGuide from "./PolicyGuide";
import PageTitle from "@/components/PageTitle";
import { ErrorState } from "@/components/state";

interface ProductListItemProps {
  product: Product;
  disabled: boolean;
  onPurchase: (product: Product) => void;
}

const ProductListItem = ({
  product,
  disabled,
  onPurchase,
}: ProductListItemProps) => {
  const t = useTranslations();
  const { credits, price } = product;
  const displayPrice = toMajorAmount(price.amountMinor, price.currency);

  return (
    <li
      role="button"
      tabIndex={0}
      aria-disabled={disabled}
      onClick={() => !disabled && onPurchase(product)}
      onKeyDown={(event) => {
        if (!disabled && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onPurchase(product);
        }
      }}
      className="relative cursor-pointer rounded-2xl border border-main px-5 py-4 transition-colors hover:bg-btn-hover aria-disabled:cursor-wait aria-disabled:opacity-60"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Token className="h-8 w-8" />
          <div className="flex items-center gap-2">
            <p className="body-3 flex gap-1">
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
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const availableBalance = useWalletStore(
    (state) => state.balance?.availableBalance ?? 0,
  );
  const {
    data: products,
    error,
    isLoading,
    isError,
    refetch,
  } = useProductsQuery();
  const fadeInClassName = useFadeInAfterLoading(isLoading);
  const openModal = useModalStore((state) => state.openModal);
  const { mutate: createPaymentOrder, isPending: isCreatingOrder } =
    usePostPaymentOrderMutation();

  // 주문을 만들면 서버가 PG 결제 준비까지 마치고 결제창 주소를 준다. 접속 환경에 맞는 주소로 이동합니다.
  const handlePurchase = (product: Product) => {
    if (!isLoggedIn) {
      openModal("LOGIN", { triggerRef: undefined });
      return;
    }
    createPaymentOrder(product.productId, {
      onSuccess: (order) => {
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const redirectUrl = isMobile
          ? (order.redirectMobileUrl ?? order.redirectPcUrl)
          : (order.redirectPcUrl ?? order.redirectMobileUrl);
        if (!redirectUrl) {
          showAppToast("error", t("tokenCharge.payment.failed"));
          return;
        }
        showAppToast("info", t("tokenCharge.payment.redirecting"));
        window.location.href = redirectUrl;
      },
    });
  };

  // 전체 개수를 세지 않는 슬라이스 응답이라, 있는지 없는지만 한 건만 물어 확인합니다.
  const { data: usageHistoryData } = useUsageHistoryListQuery({ size: 1 });
  const hasUsageHistory =
    (usageHistoryData?.pages[0]?.content.length ?? 0) > 0;

  return (
    <section className="mx-auto w-full max-w-160 pt-5">
      <PageTitle messageKey="tokenCharge.title" />

      {isLoggedIn && (
        <div className="mb-9 flex items-center justify-between gap-4 rounded-3xl border border-main bg-darker px-5 py-4">
          <div className="flex flex-col gap-2">
            <span className="body-5 text-font-2">
              {t("tokenCharge.myNote")}
            </span>
            <div className="title-1 flex items-center gap-2">
              <Token className="h-6 w-6" /> {formatWithCommas(availableBalance)}
            </div>
          </div>

          {hasUsageHistory ? (
            <Link
              href="/usage-history"
              className="body-5 shrink-0 rounded-2xl bg-main px-4 py-2 text-font-1 transition-colors hover:bg-btn-hover"
            >
              {t("tokenCharge.viewUsageHistory")}
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="body-5 shrink-0 cursor-default rounded-2xl bg-font-disabled px-4 py-2 text-font-1"
            >
              {t("tokenCharge.viewUsageHistory")}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <h2 className="title-2 text-font-0">{t("tokenCharge.purchase")}</h2>

        {isLoading && <ProductListSkeleton />}

        {/* 서버가 준 사유와(개발 모드에서는) 실패한 요청까지 함께 보여주고 재시도를 제공한다. */}
        {isError && <ErrorState error={error} onRetry={refetch} />}

        {products && products.length === 0 && (
          <p className="body-5 py-10 text-center text-font-2">
            {t("tokenCharge.empty")}
          </p>
        )}

        {products && products.length > 0 && (
          <ul className={cn("flex flex-col gap-3", fadeInClassName)}>
            {products.map((product) => (
              <ProductListItem
                key={product.productId}
                product={product}
                disabled={isCreatingOrder}
                onPurchase={handlePurchase}
              />
            ))}
          </ul>
        )}
      </div>

      <PolicyGuide />
    </section>
  );
};

export default TokenChargeContents;
