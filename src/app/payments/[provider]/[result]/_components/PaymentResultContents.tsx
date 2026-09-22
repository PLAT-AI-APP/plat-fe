"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { postPaymentConfirm } from "@/api/payment/postPaymentConfirm";
import { getPaymentOrder } from "@/api/payment/getPaymentOrder";
import { walletQueryKeys } from "@/api/wallet/queryKeys";
import { noteQueryKeys } from "@/api/note/queryKeys";
import { useAuthStore } from "@/store/useAuthStore";
import { handOffToOpener, isMobileDevice } from "@/lib/paymentWindow";
import type { AppError } from "@/api";
import Button from "@/components/ui/Button";
import PaymentSuccess from "./PaymentSuccess";
import PaymentFailure from "./PaymentFailure";
import PaymentPending, { type PendingPhase } from "./PaymentPending";

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
const CAPTURED_STATUSES = new Set(["CAPTURED", "PARTIALLY_REFUNDED"]);
const CLOSED_STATUSES = new Set(["FAILED", "CANCELLED", "EXPIRED"]);

/*
 * 폴링 간격. 처음 7분은 서버의 판정 불가 확인 배치(3분 유예 + 3분 주기)를 기다릴
 * 만큼 촘촘히 묻고, 그 뒤로는 화면이 열려 있는 동안 느리게 계속 묻는다. 서버가
 * 늦게라도 결론을 내면 사용자가 새로고침하지 않아도 결과 화면으로 넘어간다.
 */
const POLL_FAST_MS = 3_000;
const POLL_SLOW_MS = 30_000;
const FAST_WINDOW_MS = 7 * 60_000;
/** 승인 요청이 이만큼 걸리면 "평소보다 오래 걸린다"는 안내로 바꾼다. */
const SLOW_CONFIRM_MS = 8_000;

/**
 * 노트가 들어왔으니 잔액과 사용 내역을 다시 받는다. 사용 내역을 빼먹으면 충전 페이지의
 * "내역" 버튼이 캐시된 "내역 없음" 결과로 계속 비활성화돼 있다.
 */
const refreshNotes = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: walletQueryKeys.balance() });
  queryClient.invalidateQueries({
    queryKey: noteQueryKeys.usageHistoryLists(),
  });
};

interface PaymentResultContentsProps {
  provider: string;
  result: string;
}

const PaymentResultContents = ({
  provider,
  result,
}: PaymentResultContentsProps) => {
  const t = useTranslations("tokenCharge.payment");
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const orderUid = searchParams.get("orderUid");
  const pgToken = searchParams.get("pg_token");

  const [state, setState] = useState<PaymentState>(() => {
    if (result === "cancel") return { kind: "cancelled" };
    if (result !== "success" || !orderUid) return { kind: "failed" };
    // 승인 토큰 없이 돌아왔다면 승인은 이미 다른 창에서 끝났다. 주문 상태만 확인한다.
    if (!pgToken) return { kind: "checking" };
    return { kind: "confirming" };
  });

  /*
   * 결제창을 새 창으로 띄운 경우 이 페이지는 그 결제창 안에서 열린다. 결과를 기다리는
   * 원래 창이 있으면 넘기고, 승인은 원래 창이 보낸다. 휴대폰은 새 창을 쓰지 않으므로
   * 묻지 않는다.
   */
  // 서버 렌더와 첫 화면이 어긋나지 않게 기기 판별은 마운트 뒤에 한다.
  const [handoff, setHandoff] = useState<"pending" | "none" | "done">(
    orderUid ? "pending" : "none",
  );
  useEffect(() => {
    if (handoff !== "pending" || !orderUid) return;
    if (isMobileDevice()) {
      setHandoff("none");
      return;
    }
    let cancelled = false;
    handOffToOpener({ provider, result, orderUid, pgToken }).then(
      (handedOff) => {
        if (cancelled) return;
        setHandoff(handedOff ? "done" : "none");
        if (handedOff) window.close();
      },
    );
    return () => {
      cancelled = true;
    };
  }, [handoff, provider, result, orderUid, pgToken]);

  // StrictMode 이중 실행과 재렌더에도 승인은 한 번만 보냅니다.
  const requested = useRef(false);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (state.kind !== "confirming" || !orderUid || !pgToken) return;
    if (handoff !== "none") return;
    // 결제창에서 돌아오며 페이지가 새로 뜨므로 로그인 복원이 끝난 뒤에 승인합니다.
    if (!isAuthReady || !isLoggedIn) return;
    if (requested.current) return;
    requested.current = true;

    const slowTimer = setTimeout(() => setSlow(true), SLOW_CONFIRM_MS);
    postPaymentConfirm({ orderUid, pgToken })
      .then((confirmed) => {
        setState({
          kind: "success",
          credits: confirmed.creditAmount,
          granted: confirmed.fulfillmentStatus === "GRANTED",
        });
        refreshNotes(queryClient);
      })
      .catch((error: AppError) => {
        // 응답이 없었거나(네트워크) 결과를 모르는 오류면 주문 상태를 되짚습니다.
        if (!error?.status || UNCERTAIN_ERRORS.has(error.code)) {
          setState({ kind: "checking" });
          return;
        }
        setState({ kind: "failed", message: error?.message });
      })
      .finally(() => clearTimeout(slowTimer));
  }, [state.kind, orderUid, pgToken, handoff, isAuthReady, isLoggedIn, queryClient]);

  /*
   * 결론이 안 난 동안 주문 상태를 되묻는다.
   *  - checking : 결제됐는지부터 모른다
   *  - granting : 결제는 됐고 노트 지급을 기다린다(success · 미지급)
   *  - delayed  : 7분이 지났다. 느린 간격으로 계속 묻는다
   * 탭이 다시 보이면 기다리지 않고 바로 묻는다.
   */
  const polling =
    state.kind === "checking" ||
    state.kind === "delayed" ||
    (state.kind === "success" && !state.granted);
  const pollStartedAt = useRef<number | null>(null);

  useEffect(() => {
    if (!polling || !orderUid || handoff !== "none") return;
    if (!isAuthReady || !isLoggedIn) return;
    pollStartedAt.current ??= Date.now();
    const startedAt = pollStartedAt.current;
    const kind = state.kind;
    let stopped = false;
    let inFlight = false;
    let timer: ReturnType<typeof setTimeout>;

    const schedule = () => {
      const fast = Date.now() - startedAt < FAST_WINDOW_MS;
      timer = setTimeout(check, fast ? POLL_FAST_MS : POLL_SLOW_MS);
    };

    const check = async () => {
      if (stopped || inFlight) return;
      inFlight = true;
      try {
        const order = await getPaymentOrder(orderUid);
        if (stopped) return;
        const captured = CAPTURED_STATUSES.has(order.paymentStatus);
        if (captured && order.fulfillmentStatus === "GRANTED") {
          setState({ kind: "success", credits: order.creditAmount, granted: true });
          refreshNotes(queryClient);
          return;
        }
        if (captured && kind !== "success") {
          // 결제는 확인됐다. 지급 대기로 넘어가 계속 묻는다.
          setState({ kind: "success", credits: order.creditAmount, granted: false });
          return;
        }
        if (CLOSED_STATUSES.has(order.paymentStatus)) {
          setState({ kind: "failed" });
          return;
        }
      } catch {
        // 조회 자체의 일시 오류는 다음 회차에 다시 봅니다.
      } finally {
        inFlight = false;
      }
      if (stopped) return;
      if (kind === "checking" && Date.now() - startedAt >= FAST_WINDOW_MS) {
        setState({ kind: "delayed" });
        return;
      }
      schedule();
    };

    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      clearTimeout(timer);
      check();
    };
    document.addEventListener("visibilitychange", onVisible);
    // 승인 응답에서 막 넘어온 checking 은 바로 묻고, 나머지는 한 간격 뒤에 묻는다.
    if (kind === "checking") check();
    else schedule();

    return () => {
      stopped = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [polling, state.kind, orderUid, handoff, isAuthReady, isLoggedIn, queryClient]);

  if (handoff === "done") {
    return (
      <section className="mx-auto flex w-full max-w-160 flex-col items-center pt-12 pb-16 text-center">
        <PaymentPending
          phase="handedOff"
          actions={
            <Button size="lg" fullWidth onClick={() => window.close()}>
              {t("close")}
            </Button>
          }
        />
      </section>
    );
  }

  // 로그인 복원이 끝났는데 비로그인이면 승인할 수 없다. 결제는 승인 전이라 만료로 닫힌다.
  const needsLogin =
    (state.kind === "confirming" || state.kind === "checking") &&
    isAuthReady &&
    !isLoggedIn;
  const view: PaymentState =
    handoff === "pending"
      ? { kind: "confirming" }
      : needsLogin
        ? { kind: "failed" }
        : state;

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

  // 남은 상태는 모두 결과를 기다리는 중이다. 지급 대기(success·미지급)도 여기로 온다.
  const phase: PendingPhase =
    view.kind === "success"
      ? "granting"
      : view.kind === "confirming" && slow
        ? "checking"
        : view.kind;

  return (
    <section className="mx-auto flex w-full max-w-160 flex-col items-center pt-12 pb-16 text-center">
      <PaymentPending phase={phase} />
    </section>
  );
};

export default PaymentResultContents;
