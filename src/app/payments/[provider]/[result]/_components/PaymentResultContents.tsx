"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { postPaymentConfirm } from "@/api/payment/postPaymentConfirm";
import { getPaymentOrder } from "@/api/payment/getPaymentOrder";
import { walletQueryKeys } from "@/api/wallet/queryKeys";
import { useAuthStore } from "@/store/useAuthStore";
import { formatWithCommas } from "@/lib/utils";
import type { AppError } from "@/api";
import ButtonLink from "@/components/ui/ButtonLink";
import Token from "@/icons/Token";
import PaymentSuccess from "./PaymentSuccess";
import PaymentFailure from "./PaymentFailure";

type PaymentState =
  | { kind: "confirming" }
  /** 승인 응답이 끊겼거나 다른 요청이 처리 중이다. 주문 상태를 되짚어 결과를 확정한다. */
  | { kind: "checking" }
  /** 되짚는 시간 안에 결론이 안 났다. 결제가 됐다면 서버 복구 배치가 노트를 넣는다. */
  | { kind: "delayed" }
  | { kind: "success"; credits: number; granted: boolean }
  | { kind: "cancelled" }
  | { kind: "failed"; message?: string };

/** 응답만으로는 결과를 알 수 없는 오류. 실패로 단정하면 돈은 빠졌는데 실패 화면을 보게 된다. */
const UNCERTAIN_ERRORS = new Set([
  "PAYMENT_GATEWAY_FAILED",
  "PAYMENT_IN_PROGRESS",
  "PAYMENT_ALREADY_CONFIRMED",
]);
const CHECK_INTERVAL_MS = 3_000;
/** 서버의 판정 불가 확인 배치(3분 유예 + 3분 주기)를 기다릴 만큼 되짚습니다. */
const CHECK_LIMIT_MS = 7 * 60_000;
const CLOSED_STATUSES = new Set(["FAILED", "CANCELLED", "EXPIRED"]);

interface PaymentResultContentsProps {
  result: string;
}

const PaymentResultContents = ({ result }: PaymentResultContentsProps) => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const orderUid = searchParams.get("orderUid");
  const pgToken = searchParams.get("pg_token");

  const [state, setState] = useState<PaymentState>(() => {
    if (result === "cancel") return { kind: "cancelled" };
    if (result !== "success" || !orderUid || !pgToken) return { kind: "failed" };
    return { kind: "confirming" };
  });
  // StrictMode 이중 실행과 재렌더에도 승인은 한 번만 보냅니다.
  const requested = useRef(false);

  useEffect(() => {
    if (state.kind !== "confirming" || !orderUid || !pgToken) return;
    // 결제창에서 돌아오며 페이지가 새로 뜨므로 로그인 복원이 끝난 뒤에 승인합니다.
    if (!isAuthReady || !isLoggedIn) return;
    if (requested.current) return;
    requested.current = true;

    postPaymentConfirm({ orderUid, pgToken })
      .then((confirmed) => {
        setState({
          kind: "success",
          credits: confirmed.creditAmount,
          granted: confirmed.fulfillmentStatus === "GRANTED",
        });
        queryClient.invalidateQueries({ queryKey: walletQueryKeys.balance() });
      })
      .catch((error: AppError) => {
        // 응답이 없었거나(네트워크) 결과를 모르는 오류면 주문 상태를 되짚습니다.
        if (!error?.status || UNCERTAIN_ERRORS.has(error.code)) {
          setState({ kind: "checking" });
          return;
        }
        setState({ kind: "failed", message: error?.message });
      });
  }, [state.kind, orderUid, pgToken, isAuthReady, isLoggedIn, queryClient]);

  useEffect(() => {
    if (state.kind !== "checking" || !orderUid) return;
    const startedAt = Date.now();
    let stopped = false;

    const check = async () => {
      if (stopped) return;
      try {
        const order = await getPaymentOrder(orderUid);
        if (stopped) return;
        const captured =
          order.paymentStatus === "CAPTURED" ||
          order.paymentStatus === "PARTIALLY_REFUNDED";
        if (captured && order.fulfillmentStatus === "GRANTED") {
          setState({ kind: "success", credits: order.creditAmount, granted: true });
          queryClient.invalidateQueries({ queryKey: walletQueryKeys.balance() });
          return;
        }
        if (CLOSED_STATUSES.has(order.paymentStatus)) {
          setState({ kind: "failed" });
          return;
        }
      } catch {
        // 조회 자체의 일시 오류는 다음 회차에 다시 봅니다.
      }
      if (Date.now() - startedAt >= CHECK_LIMIT_MS) {
        setState({ kind: "delayed" });
        return;
      }
      timer = setTimeout(check, CHECK_INTERVAL_MS);
    };

    let timer = setTimeout(check, CHECK_INTERVAL_MS);
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [state.kind, orderUid, queryClient]);

  // 로그인 복원이 끝났는데 비로그인이면 승인할 수 없다. 결제는 승인 전이라 만료로 닫힌다.
  const view: PaymentState =
    state.kind === "confirming" && isAuthReady && !isLoggedIn
      ? { kind: "failed" }
      : state;

  const message = (() => {
    switch (view.kind) {
      case "confirming":
      case "checking":
        return t("tokenCharge.payment.confirming");
      case "delayed":
        return t("tokenCharge.payment.delayed");
      case "success":
        return view.granted
          ? t("tokenCharge.payment.success", {
              credits: formatWithCommas(view.credits),
            })
          : t("tokenCharge.payment.granting");
      case "cancelled":
      case "failed":
        return null;
    }
  })();

  if (view.kind === "success" && view.granted) {
    return (
      <section className="mx-auto flex w-full max-w-160 flex-col items-center pt-12 pb-16 text-center">
        <PaymentSuccess credits={view.credits} />
      </section>
    );
  }

  if (view.kind === "failed" || view.kind === "cancelled") {
    return (
      <section className="mx-auto flex w-full max-w-160 flex-col items-center pt-12 pb-16 text-center">
        <PaymentFailure
          variant={view.kind}
          reason={view.kind === "failed" ? view.message : undefined}
        />
      </section>
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-160 flex-col items-center gap-6 pt-20 text-center">
      {(view.kind === "confirming" ||
        view.kind === "checking" ||
        view.kind === "success") && (
        <Token
          className={
            view.kind === "success" ? "size-16" : "size-16 animate-pulse"
          }
        />
      )}

      <p role="status" className="title-2 text-font-0">
        {message}
      </p>

      {view.kind !== "confirming" && view.kind !== "checking" && (
        <ButtonLink href="/token-charge" variant="secondary" size="lg">
          {t("tokenCharge.payment.backToCharge")}
        </ButtonLink>
      )}
    </section>
  );
};

export default PaymentResultContents;
