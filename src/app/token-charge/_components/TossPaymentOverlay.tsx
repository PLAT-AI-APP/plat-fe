"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { m } from "framer-motion";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import PaymentPending from "@/app/payments/[provider]/[result]/_components/PaymentPending";
import { showAppToast } from "@/lib/toast";
import { prepareTossCheckout, type TossCheckout } from "@/lib/tossPayments";
import type { PaymentOrderCreated } from "@/type/payment";
import { TRANSITION } from "@/constants/motion";

/** 결제창을 다시 열 때 이만큼 남았으면 새 주문으로 연다. 서버가 만료된 주문의 승인을 거절한다. */
const EXPIRY_MARGIN_MS = 60_000;

type Phase = "tossOpening" | "tossOpen" | "tossClosed";

interface TossPaymentOverlayProps {
  /** 서버가 만든 주문. 만드는 중이면 null 이고 여는 중 연출만 보여준다. */
  order: PaymentOrderCreated | null;
  /** 주문명이 비어 오는 예전 서버를 위한 대체 이름 */
  fallbackOrderName: string;
  onClose: () => void;
  /** 주문 유효시간이 지나 같은 주문으로 이어 갈 수 없을 때. 새 주문을 만든다. */
  onExpired: () => void;
}

/**
 * 토스 결제창을 띄우는 동안 충전 페이지를 덮는 대기 화면.
 *
 * 구매를 누르면 바로 떠서 주문을 만들고 결제창을 여는 동안 연출을 보여준다. 결제창은 이 화면 위에 겹쳐 뜬다.
 * 결제창을 닫으면 승인 전이라 돈은 움직이지 않았으므로, 같은 주문으로 결제창을 다시 열어 이어서 결제할 수 있게 한다.
 * 인증이 끝나면 토스가 이 창을 결과 페이지로 보내므로 성공은 여기서 다루지 않는다.
 */
const TossPaymentOverlay = ({
  order,
  fallbackOrderName,
  onClose,
  onExpired,
}: TossPaymentOverlayProps) => {
  const t = useTranslations("tokenCharge.payment");
  const [phase, setPhase] = useState<Phase>("tossOpening");
  const checkoutRef = useRef<TossCheckout | null>(null);
  const primaryRef = useRef<HTMLButtonElement>(null);

  const openWindow = async (checkout: TossCheckout) => {
    setPhase("tossOpening");
    try {
      await checkout.open({ onClosed: () => setPhase("tossClosed") });
      setPhase("tossOpen");
    } catch {
      setPhase("tossClosed");
      showAppToast("error", t("failed"));
    }
  };

  // 주문이 만들어지면 결제창을 준비하고 연다. 만료로 새 주문이 오면 앞 주문의 결제창은 정리하고 새로 준비한다.
  useEffect(() => {
    if (!order) return;
    let cancelled = false;
    prepareTossCheckout({
      orderUid: order.orderUid,
      orderName: order.orderName || fallbackOrderName,
      amountMinor: order.amountMinor,
    })
      .then((checkout) => {
        if (cancelled) {
          checkout.close();
          return;
        }
        checkoutRef.current = checkout;
        openWindow(checkout);
      })
      .catch(() => {
        if (cancelled) return;
        showAppToast("error", t("failed"));
        onClose();
      });
    return () => {
      cancelled = true;
      checkoutRef.current?.close();
      checkoutRef.current = null;
    };
    // 주문 하나에 한 번만 준비한다. 콜백·문구는 주문이 바뀌지 않는 한 다시 묶지 않는다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.orderUid]);

  // 떠 있는 동안 뒤 페이지가 스크롤되지 않게 한다.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // 결제창이 닫히면 다시 열기 버튼에 초점을 둔다.
  useEffect(() => {
    if (phase === "tossClosed") primaryRef.current?.focus();
  }, [phase]);

  const reopen = () => {
    const checkout = checkoutRef.current;
    if (!order || !checkout) return;
    if (Date.parse(order.expiresAt) - Date.now() < EXPIRY_MARGIN_MS) {
      // 새 주문을 만드는 동안 여는 중 연출을 보여준다. 주문이 오면 결제창을 다시 준비한다.
      setPhase("tossOpening");
      onExpired();
      return;
    }
    openWindow(checkout);
  };

  return createPortal(
    <m.div
      role="dialog"
      aria-modal="true"
      aria-label={t(
        phase === "tossClosed"
          ? "tossClosedTitle"
          : phase === "tossOpen"
            ? "popupTitle"
            : "tossOpeningTitle",
      )}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-dark/90 px-5 py-10 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={TRANSITION}
    >
      <div className="w-full max-w-120 text-center">
        <PaymentPending
          phase={phase}
          actions={
            phase === "tossClosed" ? (
              <>
                <Button ref={primaryRef} size="lg" fullWidth onClick={reopen}>
                  {t("reopenPopup")}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={onClose}
                >
                  {t("stopPayment")}
                </Button>
              </>
            ) : (
              // 여는 중 · 결제창이 떠 있는 동안에는 결제창이 위를 덮는다. 열리지 않을 때만 빠져나갈 수 있게 둔다.
              <Button variant="secondary" size="lg" fullWidth onClick={onClose}>
                {t("stopPayment")}
              </Button>
            )
          }
        />
      </div>
    </m.div>,
    document.body,
  );
};

export default TossPaymentOverlay;
