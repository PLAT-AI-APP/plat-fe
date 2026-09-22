"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import PaymentPending from "@/app/payments/[provider]/[result]/_components/PaymentPending";
import { getPaymentOrder } from "@/api/payment/getPaymentOrder";
import {
  listenForPaymentReturn,
  paymentResultPath,
  reopenPaymentWindow,
} from "@/lib/paymentWindow";
import { TRANSITION } from "@/constants/motion";

/** 결제창과 별개로 서버에 주문 상태를 되묻는 간격. 결제창 쪽 신호를 놓쳤을 때의 안전망이다. */
const ORDER_POLL_MS = 4_000;
const WINDOW_WATCH_MS = 800;
const CAPTURED = new Set(["CAPTURED", "PARTIALLY_REFUNDED"]);
const CLOSED = new Set(["FAILED", "CANCELLED", "EXPIRED"]);

export interface PendingPaymentWindow {
  orderUid: string;
  /** 결과 페이지 경로의 PG 자리. providerSegment 로 다듬은 값 */
  provider: string;
  redirectUrl: string;
  popup: Window;
}

interface PaymentWindowOverlayProps {
  pending: PendingPaymentWindow;
  onClose: () => void;
}

/**
 * PC 결제창을 새 창으로 띄워 둔 동안 원래 창을 덮는 대기 화면.
 *
 * 결제창이 결과 페이지로 돌아오면 결과를 받아 이 창이 결과 페이지로 이동한다.
 * 결제창이 닫혀도 곧바로 "취소"로 단정하지 않는다 — PG 페이지의 COOP 설정 때문에
 * 열려 있는 창이 닫힌 것처럼 보일 수 있고, 사용자가 이미 결제를 마쳤을 수도 있다.
 * 그래서 닫힘은 안내만 바꾸고, 결과 신호와 서버 조회는 이 화면을 닫을 때까지 계속한다.
 */
const PaymentWindowOverlay = ({
  pending,
  onClose,
}: PaymentWindowOverlayProps) => {
  const t = useTranslations("tokenCharge.payment");
  const router = useRouter();
  const [phase, setPhase] = useState<"popup" | "popupClosed">("popup");
  const popupRef = useRef<Window | null>(pending.popup);
  const leaving = useRef(false);
  const primaryRef = useRef<HTMLButtonElement>(null);
  const { orderUid, provider, redirectUrl } = pending;

  const goTo = (path: string) => {
    if (leaving.current) return;
    leaving.current = true;
    router.push(path);
  };

  // 결제창이 돌아오며 보내는 결과
  useEffect(
    () =>
      listenForPaymentReturn(orderUid, (payload) => {
        popupRef.current?.close();
        goTo(paymentResultPath(payload));
      }),
    // goTo 는 ref 만 쓰므로 의존성에서 뺀다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orderUid],
  );

  // 결제창이 닫혔는지
  useEffect(() => {
    if (phase !== "popup") return;
    const timer = setInterval(() => {
      if (popupRef.current?.closed) setPhase("popupClosed");
    }, WINDOW_WATCH_MS);
    return () => clearInterval(timer);
  }, [phase]);

  // 안전망: 결제창이 결과를 넘기지 못하고 스스로 승인했거나 주문이 닫혔는지 서버에 묻는다.
  useEffect(() => {
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    const check = async () => {
      try {
        const order = await getPaymentOrder(orderUid);
        if (stopped) return;
        const base = { provider, orderUid, pgToken: null };
        // 승인이 이미 끝났다면 결과 페이지가 주문 조회만으로 결과를 보여준다.
        if (CAPTURED.has(order.paymentStatus)) {
          goTo(paymentResultPath({ ...base, result: "success" }));
          return;
        }
        if (CLOSED.has(order.paymentStatus)) {
          goTo(paymentResultPath({ ...base, result: "fail" }));
          return;
        }
      } catch {
        // 일시 오류는 다음 회차에 다시 본다.
      }
      if (!stopped) timer = setTimeout(check, ORDER_POLL_MS);
    };
    timer = setTimeout(check, ORDER_POLL_MS);
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderUid, provider]);

  // 떠 있는 동안 뒤 페이지가 스크롤되지 않게 하고, 첫 버튼에 초점을 둔다.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    primaryRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const showWindow = () => {
    const popup = popupRef.current;
    if (popup && !popup.closed) {
      popup.focus();
      return;
    }
    const reopened = reopenPaymentWindow(redirectUrl);
    if (reopened) {
      popupRef.current = reopened;
      setPhase("popup");
    }
  };

  const stop = () => {
    popupRef.current?.close();
    onClose();
  };

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={t(phase === "popup" ? "popupTitle" : "popupClosedTitle")}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-dark/90 px-5 py-10 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={TRANSITION}
    >
      <div className="w-full max-w-120 text-center">
        <PaymentPending
          phase={phase}
          actions={
            <>
              <Button
                ref={primaryRef}
                size="lg"
                fullWidth
                onClick={showWindow}
              >
                {t(phase === "popup" ? "showPopup" : "reopenPopup")}
              </Button>
              <Button variant="secondary" size="lg" fullWidth onClick={stop}>
                {t(phase === "popup" ? "stopPayment" : "close")}
              </Button>
            </>
          }
        />
      </div>
    </motion.div>,
    document.body,
  );
};

export default PaymentWindowOverlay;
