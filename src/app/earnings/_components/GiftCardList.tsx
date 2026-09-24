"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { ModalLayout } from "@/components/ModalLayout";
import Button from "@/components/ui/Button";
import { QueryStateBoundary } from "@/components/state";
import { cn, formatWithCommas } from "@/lib/utils";
import { showAppToast } from "@/lib/toast";
import { useRewardProductsQuery } from "@/api/earning/getRewardProducts";
import { usePostRedemptionMutation } from "@/api/earning/postRedemption";
import type { RewardProduct } from "@/type/earning";

/** 서버 검증과 같은 휴대폰 번호 형식 */
const PHONE_PATTERN = /^01[0-9]-?\d{3,4}-?\d{4}$/;

interface GiftCardListProps {
  available: number;
}

/** 상품 썸네일. 이미지가 없으면 네이버페이 초록 위 머리글자로 대신 그린다. */
const RewardThumb = ({
  product,
  className,
}: {
  product: RewardProduct;
  className?: string;
}) =>
  product.imageUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={product.imageUrl}
      alt=""
      className={cn("size-12 shrink-0 rounded-2xl object-cover", className)}
    />
  ) : (
    <span
      className={cn(
        "title-3 flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#03C75A] text-white",
        className,
      )}
    >
      N
    </span>
  );

/**
 * 카드 맨 위를 채우는 상품 이미지. 무엇을 받는지가 카드에서 가장 큰 자리를 갖는다.
 * 이미지가 아직 없는 상품은 같은 자리를 상품권 색으로 채운다.
 */
const RewardVisual = ({ product }: { product: RewardProduct }) => {
  if (product.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={product.imageUrl}
        alt=""
        loading="lazy"
        className="aspect-4/3 w-full rounded-3xl bg-darkest object-cover"
      />
    );
  }

  return (
    <div
      className="flex aspect-4/3 w-full items-center justify-center rounded-3xl bg-[#03C75A]/10"
      aria-hidden
    >
      <span className="title-1 flex size-20 items-center justify-center rounded-3xl bg-[#03C75A] text-white">
        N
      </span>
    </div>
  );
};

interface RewardCardProps {
  product: RewardProduct;
  available: number;
  onSelect: (product: RewardProduct) => void;
}

/**
 * 교환 상품 카드.
 *
 * 포인트가 모자랄 때도 상품을 감추지 않는다. 얼마나 남았는지 막대와 문장으로
 * 보여 주는 편이 목표가 되기 때문이다.
 */
const RewardCard = ({ product, available, onSelect }: RewardCardProps) => {
  const t = useTranslations("earnings");
  const enough = available >= product.pointPrice;
  const missing = product.pointPrice - available;
  const progress = Math.min(
    100,
    Math.round((available / product.pointPrice) * 100),
  );

  return (
    <li className="flex flex-col gap-3">
      <RewardVisual product={product} />

      <div className="flex flex-col gap-0.5">
        <span className="title-5 truncate text-font-2">{product.name}</span>
        <span className="heading-2">
          {t("points", { value: formatWithCommas(product.pointPrice) })}
        </span>
        <span className="body-7 text-font-2">{t("exchange.giftNotice")}</span>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        {!enough && (
          <div className="flex flex-col gap-1.5">
            <div
              role="progressbar"
              aria-label={t("exchange.progressLabel")}
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-1.5 overflow-hidden rounded-full bg-main"
            >
              <span
                className="block h-full rounded-full bg-brand/60"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="body-7 text-font-2">
              {t("exchange.shortBy", { value: formatWithCommas(missing) })}
            </p>
          </div>
        )}

        <Button
          size="lg"
          fullWidth
          disabled={!enough}
          onClick={() => onSelect(product)}
        >
          {enough ? t("exchange.button") : t("exchange.insufficient")}
        </Button>
      </div>
    </li>
  );
};

const CardSkeleton = () => (
  <ul className="skeleton-motion grid gap-x-4 gap-y-8 @md:grid-cols-2">
    {Array.from({ length: 2 }).map((_, index) => (
      <li key={index} className="flex flex-col gap-3">
        <div className="aspect-4/3 w-full rounded-3xl bg-card" />
        <div className="h-4 w-2/3 rounded-full bg-card" />
        <div className="h-7 w-1/2 rounded-full bg-card" />
        <div className="h-11 w-full rounded-xl bg-card" />
      </li>
    ))}
  </ul>
);

interface ConfirmModalProps {
  product: RewardProduct;
  available: number;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (recipientPhone: string) => void;
}

const ExchangeConfirmModal = ({
  product,
  available,
  isSubmitting,
  onClose,
  onConfirm,
}: ConfirmModalProps) => {
  const t = useTranslations("earnings");
  const [phone, setPhone] = useState("");
  const isPhoneValid = PHONE_PATTERN.test(phone);
  const showPhoneError = phone.length > 0 && !isPhoneValid;

  const rows = [
    {
      label: t("exchange.usePoints"),
      value: t("points", { value: formatWithCommas(product.pointPrice) }),
    },
    {
      label: t("exchange.remainPoints"),
      value: t("points", {
        value: formatWithCommas(available - product.pointPrice),
      }),
    },
  ];

  return (
    <ModalLayout
      hasBackground
      onClose={onClose}
      className="w-[calc(100%-32px)] max-w-90 p-6"
    >
      <form
        className="flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          if (!isPhoneValid) return;
          onConfirm(phone);
        }}
      >
        <div className="flex items-center gap-3">
          <RewardThumb product={product} />
          <h2 className="title-3 truncate">{product.name}</h2>
        </div>

        <dl className="flex flex-col gap-2.5 body-5 rounded-2xl bg-darkest px-4 py-3.5">
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between gap-4">
              <dt className="text-font-2">{row.label}</dt>
              <dd className="truncate">{row.value}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="earning-recipient-phone"
            className="body-6 text-font-2"
          >
            {t("exchange.phone")}
          </label>
          <input
            id="earning-recipient-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            maxLength={13}
            placeholder="010-0000-0000"
            onChange={(event) => setPhone(event.target.value.trim())}
            aria-invalid={showPhoneError}
            className={cn(
              "body-5 h-11 rounded-lg border border-main bg-darkest px-4 text-font-1",
              "placeholder:text-font-2/50 focus:border-brand transition-colors",
              showPhoneError && "border-font-accents focus:border-font-accents",
            )}
          />
          <p
            className={cn(
              "body-7",
              showPhoneError ? "text-font-accents" : "text-font-2",
            )}
          >
            {showPhoneError
              ? t("exchange.phoneInvalid")
              : t("exchange.giftNotice")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            fullWidth
            onClick={onClose}
          >
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            size="lg"
            fullWidth
            disabled={isSubmitting || !isPhoneValid}
          >
            {t("exchange.button")}
          </Button>
        </div>
      </form>
    </ModalLayout>
  );
};

/** 상품권 목록. 신청하면 포인트가 바로 빠지고 내역에 발송 상태가 남는다. */
const GiftCardList = ({ available }: GiftCardListProps) => {
  const t = useTranslations("earnings");
  const [selected, setSelected] = useState<RewardProduct | null>(null);
  const {
    data: products = [],
    isPending,
    isError,
    error,
    refetch,
  } = useRewardProductsQuery();
  const { mutate: redeem, isPending: isSubmitting } =
    usePostRedemptionMutation();

  const handleConfirm = (product: RewardProduct, recipientPhone: string) => {
    redeem(
      { productId: product.productId, recipientPhone },
      {
        onSuccess: () => {
          setSelected(null);
          showAppToast("success", t("exchange.requested"));
        },
      },
    );
  };

  return (
    <QueryStateBoundary
      isPending={isPending}
      isError={isError}
      error={error}
      onRetry={refetch}
      pendingFallback={<CardSkeleton />}
      isEmpty={products.length === 0}
      emptyMood="peek"
      emptyMessage={t("empty.products")}
    >
      {/* 열 수는 뷰포트가 아니라 사이드바까지 반영된 콘텐츠 폭으로 정한다. */}
      <div className="@container">
        <ul className="grid gap-x-4 gap-y-8 @md:grid-cols-2">
          {products.map((product) => (
            <RewardCard
              key={product.productId}
              product={product}
              available={available}
              onSelect={setSelected}
            />
          ))}
        </ul>
      </div>

      {selected && (
        <ExchangeConfirmModal
          product={selected}
          available={available}
          isSubmitting={isSubmitting}
          onClose={() => setSelected(null)}
          onConfirm={(recipientPhone) =>
            handleConfirm(selected, recipientPhone)
          }
        />
      )}
    </QueryStateBoundary>
  );
};

export default GiftCardList;
