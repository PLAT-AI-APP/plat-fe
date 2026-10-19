"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { m } from "framer-motion";
import { useTranslations } from "next-intl";
import DrawCheck from "@/components/motion/DrawCheck";
import MiniConfetti from "@/components/motion/MiniConfetti";
import { EASE_OUT } from "@/constants/motion";
import { ModalLayout } from "@/components/ModalLayout";
import Button from "@/components/ui/Button";
import { QueryStateBoundary } from "@/components/state";
import { cn, formatWithCommas } from "@/lib/utils";
import FallbackImg from "@/components/image/FallbackImg";
import { useRewardProductsQuery } from "@/api/earning/getRewardProducts";
import { usePostRedemptionMutation } from "@/api/earning/postRedemption";
import { useDeliveryOptionsQuery } from "@/api/earning/getDeliveryOptions";
import ClearInputButton from "@/components/ui/ClearInputButton";
import { useModalStore } from "@/store/useModalStore";
import Checkbox from "@/icons/Checkbox";
import CheckboxEmpty from "@/icons/CheckboxEmpty";
import { ArrowDown } from "@/icons";
import type {
  RewardDeliveryChannel,
  RewardDeliveryOptions,
  RewardProduct,
} from "@/type/earning";

// 동의서 전문은 펼쳤을 때만 그린다. 약관 화면과 같은 렌더러를 쓴다.
const MarkdownDocument = dynamic(
  () => import("@/components/markdown/MarkdownDocument"),
  {
    // loading 이 없으면 dynamic 이 자체 Suspense 경계를 두지 않아, 처음 펼칠 때 화면 전체가 잠깐 교체되며 깜빡인다.
    loading: () => (
      <div className="flex flex-col gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-4 w-full rounded" />
        ))}
      </div>
    ),
  },
);

/**
 * 휴대폰으로 받는 방법. 번호를 입력받지 않고 본인인증한 번호로 보낸다 — 남의 번호로 상품권을 받아 가지 못하게.
 */
const PHONE_CHANNELS: ReadonlySet<RewardDeliveryChannel> = new Set([
  "SMS",
  "KAKAO_ALIMTALK",
]);

/** 받는 곳을 직접 적는 방법(이메일)의 입력 모양. 서버 검증과 같은 형식이다. */
const EMAIL_FIELD = {
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  placeholder: "name@example.com",
  maxLength: 100,
};

/** 받는 방법을 아직 못 받았을 때 쓰는 기본값. 서버도 지금은 문자만 연다. */
const DEFAULT_CHANNEL: RewardDeliveryChannel = "SMS";

interface GiftCardListProps {
  available: number;
  /** 본인인증 전이면 상품권 교환 버튼을 막고 이유를 버튼에 적는다. */
  identityVerified: boolean;
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
    <FallbackImg
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
      <FallbackImg
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
  identityVerified: boolean;
  /** 카드 안내 문구에 쓸 받는 방법(고를 수 있는 첫 번째). */
  channel: RewardDeliveryChannel;
  onSelect: (product: RewardProduct) => void;
}

/**
 * 교환 상품 카드.
 *
 * 포인트가 모자랄 때도 상품을 감추지 않는다. 얼마나 남았는지 막대와 문장으로
 * 보여 주는 편이 목표가 되기 때문이다.
 */
const RewardCard = ({
  product,
  available,
  identityVerified,
  channel,
  onSelect,
}: RewardCardProps) => {
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
        <span className="body-7 text-font-2">
          {t(`delivery.${channel}.notice`)}
        </span>
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
          disabled={!identityVerified || !enough}
          onClick={() => onSelect(product)}
        >
          {!identityVerified
            ? t("exchange.identityRequired")
            : enough
              ? t("exchange.button")
              : t("exchange.insufficient")}
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

/** 신청이 끝난 건. 완료 화면이 받는 방법과 받는 곳을 말한다. */
interface RequestedDelivery {
  channel: RewardDeliveryChannel;
  recipient: string;
  consentDocumentId: string;
}

interface ConfirmModalProps {
  product: RewardProduct;
  available: number;
  isSubmitting: boolean;
  channels: RewardDeliveryChannel[];
  /** 본인인증 휴대폰 번호. 없으면 휴대폰으로 받는 방법을 신청할 수 없다. */
  verifiedPhone: string | null;
  /** 동의받을 상품권 발송 개인정보 수집·이용 동의서. 없으면 신청할 수 없다. */
  consent: RewardDeliveryOptions["consent"];
  /** 신청이 끝났으면 받는 방법·받는 곳. 있으면 완료 화면을 보여 준다. */
  requested?: RequestedDelivery;
  onClose: () => void;
  onConfirm: (delivery: RequestedDelivery) => void;
}

/** 신청 완료 — 상품권이 뒤집히며 체크가 그려지고 발송 안내가 떠오른다 */
const ExchangeDone = ({
  product,
  requested,
  onClose,
}: {
  product: RewardProduct;
  requested: RequestedDelivery;
  onClose: () => void;
}) => {
  const t = useTranslations("earnings");
  return (
    <div className="flex flex-col items-center gap-6 pt-2">
      <div className="relative size-28 [perspective:800px]">
        <m.div
          className="relative size-full [transform-style:preserve-3d]"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 180, y: [0, -14, 0] }}
          transition={{ duration: 0.75, ease: EASE_OUT }}
        >
          <div className="absolute inset-0 [backface-visibility:hidden]">
            <RewardThumb
              product={product}
              className="size-full rounded-3xl text-4xl"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center rounded-3xl border border-main bg-card text-brand [transform:rotateY(180deg)] [backface-visibility:hidden]">
            <DrawCheck size={52} delay={0.45} />
          </div>
        </m.div>
        <MiniConfetti
          className="top-1/2 left-1/2"
          count={18}
          spread={130}
          delay={0.6}
        />
      </div>
      <m.div
        role="status"
        className="flex flex-col items-center gap-1 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4, ease: EASE_OUT }}
      >
        <h2 className="title-2 text-font-1">{t("exchange.requested")}</h2>
        <p className="body-5 text-font-2 break-keep">
          {t(`delivery.${requested.channel}.requested`, {
            recipient: requested.recipient,
          })}
        </p>
      </m.div>
      <Button
        type="button"
        variant="secondary"
        size="lg"
        fullWidth
        onClick={onClose}
      >
        {t("exchange.done")}
      </Button>
    </div>
  );
};

const ExchangeConfirmModal = ({
  product,
  available,
  isSubmitting,
  channels,
  verifiedPhone,
  consent,
  requested,
  onClose,
  onConfirm,
}: ConfirmModalProps) => {
  const t = useTranslations("earnings");
  const openModal = useModalStore((state) => state.openModal);
  const [channel, setChannel] = useState<RewardDeliveryChannel>(
    channels[0] ?? DEFAULT_CHANNEL,
  );
  const [email, setEmail] = useState("");
  const isPhoneChannel = PHONE_CHANNELS.has(channel);
  const isEmailValid = EMAIL_FIELD.pattern.test(email);
  const showEmailError = !isPhoneChannel && email.length > 0 && !isEmailValid;
  const [isConsentAgreed, setIsConsentAgreed] = useState(false);
  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const canSubmit =
    !isSubmitting &&
    Boolean(consent) &&
    isConsentAgreed &&
    (isPhoneChannel ? Boolean(verifiedPhone) : isEmailValid);

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
      {requested ? (
        <ExchangeDone product={product} requested={requested} onClose={onClose} />
      ) : (
        <form
          className="flex flex-col gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            if (!canSubmit || !consent) return;
            onConfirm({
              channel,
              recipient: isPhoneChannel ? (verifiedPhone ?? "") : email,
              consentDocumentId: consent.documentId,
            });
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

          <fieldset className="flex flex-col gap-1.5">
            <legend className="body-6 mb-1.5 text-font-2">
              {t("delivery.label")}
            </legend>
            <div role="radiogroup" className="flex flex-wrap gap-2">
              {(channels.length > 0 ? channels : [DEFAULT_CHANNEL]).map(
                (item) => {
                  const isSelected = item === channel;
                  return (
                    <button
                      key={item}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setChannel(item)}
                      className={cn(
                        "body-6 h-9 rounded-full border px-4 transition-colors",
                        isSelected
                          ? "border-brand bg-brand/10 text-brand-dark"
                          : "border-main text-font-2 hover:text-font-1",
                      )}
                    >
                      {t(`delivery.${item}.name`)}
                    </button>
                  );
                },
              )}
            </div>
          </fieldset>

          {isPhoneChannel ? (
            <div className="flex flex-col gap-1.5">
              <div className="body-5 flex min-h-12 items-center justify-between gap-3 rounded-lg bg-darkest px-4 py-2">
                <span className="text-font-2">
                  {t(`delivery.${channel}.field`)}
                </span>
                {verifiedPhone ? (
                  <span className="tabular-nums text-font-1">
                    {verifiedPhone}
                  </span>
                ) : (
                  // 번호는 본인인증한 본인 명의 번호만 쓴다. 인증하면 이 화면의 번호도 다시 받는다.
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      openModal("IDENTITY_VERIFICATION", { purpose: "identity" })
                    }
                  >
                    {t("delivery.verifyPhone")}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="earning-recipient"
                className="body-6 text-font-2"
              >
                {t(`delivery.${channel}.field`)}
              </label>
              <div className="relative">
                <input
                  id="earning-recipient"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  maxLength={EMAIL_FIELD.maxLength}
                  placeholder={EMAIL_FIELD.placeholder}
                  onChange={(event) => setEmail(event.target.value.trim())}
                  aria-invalid={showEmailError}
                  className={cn(
                    "body-5 h-11 w-full rounded-lg border border-main bg-darkest px-4 text-font-1",
                    "placeholder:text-font-2/50 focus:border-brand transition-colors",
                    email && "pr-11",
                    showEmailError &&
                      "border-font-accents focus:border-font-accents",
                  )}
                />
                {email && (
                  <ClearInputButton
                    onClear={() => setEmail("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  />
                )}
              </div>
              {showEmailError && (
                <p className="body-7 text-font-accents">
                  {t(`delivery.${channel}.invalid`)}
                </p>
              )}
            </div>
          )}

          {consent ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setIsConsentAgreed((prev) => !prev)}
                  aria-pressed={isConsentAgreed}
                  className="flex min-w-0 items-center gap-2 text-left"
                >
                  {isConsentAgreed ? <Checkbox /> : <CheckboxEmpty />}
                  <span className="body-6 truncate text-font-1">
                    {t("consent.label")}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsConsentOpen((prev) => !prev)}
                  aria-expanded={isConsentOpen}
                  aria-controls="gift-card-consent"
                  className="body-7 flex shrink-0 items-center gap-1 text-font-2 hover:text-font-1"
                >
                  {t(isConsentOpen ? "consent.hide" : "consent.view")}
                  <ArrowDown
                    className={cn(
                      "size-3 transition-transform",
                      isConsentOpen && "rotate-180",
                    )}
                    aria-hidden="true"
                  />
                </button>
              </div>
              {isConsentOpen && (
                <div
                  id="gift-card-consent"
                  className="custom-scrollbar body-6 max-h-48 overflow-y-auto rounded-lg bg-darkest px-4 py-3 text-font-1"
                >
                  <MarkdownDocument content={consent.content} />
                </div>
              )}
            </div>
          ) : (
            <p className="body-7 text-font-accents">
              {t("consent.unavailable")}
            </p>
          )}

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
            <Button type="submit" size="lg" fullWidth disabled={!canSubmit}>
              {t("exchange.button")}
            </Button>
          </div>
        </form>
      )}
    </ModalLayout>
  );
};

/** 상품권 목록. 신청하면 포인트가 바로 빠지고 내역에 발송 상태가 남는다. */
const GiftCardList = ({ available, identityVerified }: GiftCardListProps) => {
  const t = useTranslations("earnings");
  const [selected, setSelected] = useState<RewardProduct | null>(null);
  // 신청이 끝나면 모달을 닫지 않고 그 안에서 완료 화면을 보여 준다
  const [requested, setRequested] = useState<RequestedDelivery>();
  const closeModal = () => {
    setSelected(null);
    setRequested(undefined);
  };
  const { data: deliveryOptions } = useDeliveryOptionsQuery();
  const channels = deliveryOptions?.channels ?? [];
  const {
    data: products = [],
    isPending,
    isError,
    error,
    refetch,
  } = useRewardProductsQuery();
  const { mutate: redeem, isPending: isSubmitting } =
    usePostRedemptionMutation();

  const handleConfirm = (
    product: RewardProduct,
    delivery: RequestedDelivery,
  ) => {
    redeem(
      {
        productId: product.productId,
        deliveryChannel: delivery.channel,
        // 휴대폰으로 받는 방법은 서버가 본인인증 번호를 쓴다. 적은 곳은 이메일만 보낸다.
        ...(PHONE_CHANNELS.has(delivery.channel)
          ? {}
          : { recipient: delivery.recipient }),
        consentDocumentId: delivery.consentDocumentId,
      },
      {
        onSuccess: () => setRequested(delivery),
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
              identityVerified={identityVerified}
              channel={channels[0] ?? DEFAULT_CHANNEL}
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
          channels={channels}
          verifiedPhone={deliveryOptions?.verifiedPhone ?? null}
          consent={deliveryOptions?.consent ?? null}
          requested={requested}
          onClose={closeModal}
          onConfirm={(delivery) => handleConfirm(selected, delivery)}
        />
      )}
    </QueryStateBoundary>
  );
};

export default GiftCardList;
