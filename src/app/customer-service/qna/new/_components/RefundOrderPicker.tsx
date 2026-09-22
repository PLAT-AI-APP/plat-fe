"use client";

import React from "react";
import { AnimatePresence, m } from "framer-motion";
import { useTranslations } from "next-intl";
import { usePaymentOrderListQuery } from "@/api/payment/getPaymentOrderList";
import { useInfiniteList } from "@/hooks/data/useInfiniteList";
import useToggle from "@/hooks/common/useToggle";
import dayjs from "@/lib/dayjs";
import { cn, formatWithCommas, toMajorAmount } from "@/lib/utils";
import { ArrowDown } from "@/icons";
import Button from "@/components/ui/Button";
import { QueryStateBoundary } from "@/components/state";
import type { PaymentOrder } from "@/type/payment";

const PAGE_SIZE = 10;
const SKELETON_ITEM_COUNT = 3;
/** 기한이 이만큼 안쪽으로 남으면 D-day 배지를 강조색으로 바꾼다. */
const URGENT_DAYS = 1;

export type RefundAvailability =
  | "AVAILABLE"
  | "REQUESTED"
  | "COMPLETED"
  | "REJECTED"
  | "EXPIRED"
  | "UNAVAILABLE";

/**
 * 결제 한 건의 환불 신청 상태.
 *
 * 신청 이력이 없는 결제는 서버 `requestRefund` 의 사전 조건(결제 완료 · 기한 안 · 부분 환불 없음)을 화면에서 먼저
 * 걸러, 조건이 안 되면(기한 만료 · 환불 불가) 누를 수 없게 한다. 노트 사용 여부는 목록에서 알 수 없어 제출 때
 * 서버가 판정한다.
 *
 * 이미 신청한 결제는 다시 골라도 된다. 서버는 같은 결제로 다시 온 신청에 새로 만들지 않고(멱등) 기존 환불 문의를
 * 그대로 돌려준다.
 */
export const getRefundAvailability = (order: PaymentOrder): RefundAvailability => {
  if (order.refundStatus === "COMPLETED" || order.paymentStatus === "REFUNDED") {
    return "COMPLETED";
  }
  if (order.refundStatus === "REJECTED") return "REJECTED";
  if (order.refundStatus) return "REQUESTED";
  if (order.paymentStatus !== "CAPTURED" || order.refundedAmountMinor > 0) {
    return "UNAVAILABLE";
  }
  if (!order.refundableUntil || !dayjs().isBefore(order.refundableUntil)) {
    return "EXPIRED";
  }
  return "AVAILABLE";
};

interface OrderCardProps {
  order: PaymentOrder;
  availability: RefundAvailability;
  isSelected: boolean;
  onSelect: (orderUid: string) => void;
}

/** 이미 신청해 결과를 다시 돌려받을 수 있는 상태 */
const isAlreadyRequested = (availability: RefundAvailability) =>
  availability === "REQUESTED" || availability === "COMPLETED" || availability === "REJECTED";

/** 결제 한 장. 고르면 결제 금액 · 지급 노트 · 환불 기한을 펼쳐 무엇을 환불하는지 다시 확인하게 한다. */
const OrderCard = ({ order, availability, isSelected, onSelect }: OrderCardProps) => {
  const t = useTranslations("customerService.refund");
  const unitT = useTranslations("tokenCharge");
  const qnaT = useTranslations("customerService.qna");
  const isAvailable = availability === "AVAILABLE";
  const isSelectable = isAvailable || isAlreadyRequested(availability);

  const price = `${formatWithCommas(toMajorAmount(order.amountMinor, order.currency))}${unitT("priceUnit")}`;
  const credit = qnaT("creditUnit", { count: formatWithCommas(order.creditAmount) });
  // 기한은 신청 가능한 결제에만 의미가 있다. 남은 날을 내림해 하루가 안 남았으면 0(오늘 마감)이 된다.
  const daysLeft =
    isAvailable && order.refundableUntil
      ? Math.max(0, dayjs(order.refundableUntil).diff(dayjs(), "day"))
      : null;

  return (
    <li>
      <button
        type="button"
        role="radio"
        aria-checked={isSelected}
        disabled={!isSelectable}
        onClick={() => onSelect(order.orderUid)}
        className={cn(
          "flex w-full flex-col rounded-xl border px-4 py-3 text-left transition-colors",
          isSelected
            ? "border-brand bg-brand-opacity"
            : "border-main bg-dark enabled:hover:bg-btn-hover",
          !isSelectable && "cursor-not-allowed",
        )}
      >
        <span className="flex w-full items-center gap-3">
          {isSelectable && (
            <span
              aria-hidden="true"
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                isSelected ? "border-brand" : "border-main",
              )}
            >
              {isSelected && <span className="size-2 rounded-full bg-brand" />}
            </span>
          )}

          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <strong
              className={cn(
                "title-6 truncate",
                isAvailable ? "text-font-1" : "text-font-2",
              )}
            >
              {order.productName}
            </strong>
            <span className="body-7 text-font-2">
              {t("paidAt", { date: dayjs(order.paidAt).format("YYYY.MM.DD") })}
            </span>
          </span>

          <span className="flex shrink-0 flex-col items-end gap-1">
            <span className={cn("title-6", isAvailable ? "text-font-1" : "text-font-2")}>
              {price}
            </span>
            {isAvailable && daysLeft !== null ? (
              <span
                className={cn(
                  "body-7 rounded-md px-1.5 py-0.5",
                  daysLeft <= URGENT_DAYS ? "bg-brand-opacity text-brand" : "bg-card text-font-2",
                )}
              >
                {daysLeft === 0 ? t("dDayToday") : t("dDay", { days: daysLeft })}
              </span>
            ) : (
              <span className="body-7 rounded-md bg-card px-1.5 py-0.5 text-font-2">
                {t(`availability.${availability}`)}
              </span>
            )}
          </span>
        </span>

        <AnimatePresence initial={false}>
          {isSelected && (
            <m.span
              key="summary"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="block overflow-hidden"
            >
              <span className="body-6 mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 border-t border-main pt-3">
                <span className="text-font-2">{t("amountLabel")}</span>
                <span className="text-right text-font-1">{price}</span>
                <span className="text-font-2">{t("creditLabel")}</span>
                <span className="text-right text-font-1">{credit}</span>
                {order.refundableUntil && (
                  <>
                    <span className="text-font-2">{t("refundableUntilLabel")}</span>
                    <span className="text-right text-font-1">
                      {dayjs(order.refundableUntil).format("YYYY.MM.DD HH:mm")}
                    </span>
                  </>
                )}
              </span>
            </m.span>
          )}
        </AnimatePresence>
      </button>
    </li>
  );
};

interface RefundOrderPickerProps {
  selectedOrderUid: string | null;
  onSelect: (orderUid: string) => void;
}

/**
 * 환불할 결제 선택.
 *
 * 새로 신청할 수 있는 결제를 위에 두고, 이미 신청한 결제(신청됨 · 완료 · 거절)와 신청할 수 없는 결제(기한 만료 ·
 * 환불 불가)는 상태와 함께 아래에 접어 둔다. 이미 신청한 결제는 골라서 다시 요청하면 기존 결과를 돌려받는다.
 */
const RefundOrderPicker = ({ selectedOrderUid, onSelect }: RefundOrderPickerProps) => {
  const t = useTranslations("customerService.refund");
  const unavailableToggle = useToggle();

  const {
    data,
    error,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePaymentOrderListQuery({ size: PAGE_SIZE });

  const { items } = useInfiniteList({ data, hasNextPage, isFetchingNextPage, fetchNextPage });

  // 결제창만 열고 끝난 주문(결제 전 · 실패 · 만료)은 환불과 무관하므로 보여 주지 않는다.
  const orders = items
    .filter((order) => order.paidAt)
    .map((order) => ({ order, availability: getRefundAvailability(order) }));
  const available = orders.filter(({ availability }) => availability === "AVAILABLE");
  const unavailable = orders.filter(({ availability }) => availability !== "AVAILABLE");

  const renderCards = (list: typeof orders) =>
    list.map(({ order, availability }) => (
      <OrderCard
        key={order.orderUid}
        order={order}
        availability={availability}
        isSelected={selectedOrderUid === order.orderUid}
        onSelect={onSelect}
      />
    ));

  return (
    <QueryStateBoundary
      isPending={isLoading}
      isError={isError}
      error={error}
      isEmpty={Boolean(data) && orders.length === 0 && !hasNextPage}
      onRetry={refetch}
      emptyMessage={t("orderEmpty")}
      pendingFallback={
        <ul className="flex flex-col gap-2">
          {Array.from({ length: SKELETON_ITEM_COUNT }, (_, index) => (
            <li key={index} className="h-16 w-full rounded-xl skeleton" />
          ))}
        </ul>
      }
    >
      <div className="flex flex-col gap-3">
        {available.length > 0 ? (
          <ul role="radiogroup" aria-label={t("orderLabel")} className="flex flex-col gap-2">
            {renderCards(available)}
          </ul>
        ) : (
          <p className="body-6 rounded-xl border border-dashed border-main px-4 py-5 text-center text-font-2">
            {t("noAvailable")}
          </p>
        )}

        {unavailable.length > 0 && (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={unavailableToggle.toggle}
              aria-expanded={unavailableToggle.isOpen}
              className="body-6 flex items-center gap-1.5 self-start text-font-2 transition-colors hover:text-font-1"
            >
              {unavailableToggle.isOpen
                ? t("hide")
                : t("unavailableToggle", { count: unavailable.length })}
              <m.span
                animate={{ rotate: unavailableToggle.isOpen ? 180 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex"
              >
                <ArrowDown className="size-2.5" aria-hidden="true" />
              </m.span>
            </button>

            <AnimatePresence initial={false}>
              {unavailableToggle.isOpen && (
                <m.ul
                  key="unavailable"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="flex flex-col gap-2 overflow-hidden"
                >
                  {renderCards(unavailable)}
                </m.ul>
              )}
            </AnimatePresence>
          </div>
        )}

        {hasNextPage && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchNextPage()}
            isPending={isFetchingNextPage}
            disabled={isFetchingNextPage}
            className="self-center"
          >
            {t("loadMore")}
          </Button>
        )}
      </div>
    </QueryStateBoundary>
  );
};

export default RefundOrderPicker;
