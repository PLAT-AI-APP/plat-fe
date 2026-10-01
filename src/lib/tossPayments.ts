/**
 * 토스페이먼츠 결제창형 결제(SDK v2).
 *
 * 흐름
 *  1. 서버가 주문을 만들고 금액·주문번호를 정한다(금액은 카탈로그 권위값).
 *  2. 여기서 SDK 로 결제창을 띄운다. 결제창은 이 페이지 위에 겹쳐 열리므로 새 창을 미리 열지 않는다.
 *  3. 구매자가 결제수단을 고르면 requestPayment 로 인증을 요청하고, 토스가 이 창을
 *     /payments/toss/success?paymentKey=..&orderId=..&amount=.. 또는 /fail?code=.. 로 보낸다.
 *  4. 결과 페이지가 서버에 승인을 보낸다. 서버가 금액을 주문과 대조하고 시크릿 키로 토스에 승인한다.
 *
 * 보안
 *  - 여기서는 클라이언트 키(test_gck_/live_gck_, 주문서형·결제창형 연동 키)만 쓴다.
 *    시크릿 키는 서버에만 있고, api.tosspayments.com 은 브라우저에서 부르지 않는다.
 *  - customerKey 는 ANONYMOUS 다. 회원 식별자를 PG 에 넘기지 않는다(카드 저장 기능은 쓰지 않는다).
 */

const SDK_URL = "https://js.tosspayments.com/v2/standard";

/** 브라우저 번들에 들어가도 되는 클라이언트 키. 비어 있으면 토스 결제를 쓸 수 없다. */
export const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ?? "";

/** 결제창이 끝난 뒤 돌아올 결과 페이지의 PG 자리(서버 PgProvider.TOSS 의 설정 키). */
export const TOSS_PROVIDER_SEGMENT = "toss";

/** 구매자가 결제창을 닫거나 결제를 포기했을 때 failUrl 로 오는 코드. 실패가 아니라 취소로 보여준다. */
export const TOSS_USER_CANCEL_CODES = new Set([
  "PAY_PROCESS_CANCELED",
  "USER_CANCEL",
]);

interface TossAmount {
  value: number;
  currency: "KRW";
}

interface TossPaymentWindow {
  on(
    event: "paymentRequest",
    callback: (payload: { paymentMethod: { code: string } }) => void,
  ): void;
  on(event: "cancel", callback: () => void): void;
  destroy(): Promise<void>;
}

interface TossWidgets {
  setAmount(amount: TossAmount): Promise<void>;
  renderPaymentWindow(params: {
    orderName: string;
    variantKey?: { paymentMethod?: string; agreement?: string };
  }): Promise<TossPaymentWindow>;
  requestPayment(params: {
    orderId: string;
    orderName: string;
    successUrl: string;
    failUrl: string;
  }): Promise<void>;
}

interface TossPaymentsInstance {
  widgets(params: { customerKey: string }): TossWidgets;
}

interface TossPaymentsFactory {
  (clientKey: string): TossPaymentsInstance;
  ANONYMOUS: string;
}

declare global {
  interface Window {
    TossPayments?: TossPaymentsFactory;
  }
}

let sdkPromise: Promise<TossPaymentsFactory> | null = null;

/** SDK 스크립트를 한 번만 받는다. 실패하면 다음 시도에서 다시 받는다. */
const loadSdk = () => {
  if (window.TossPayments) return Promise.resolve(window.TossPayments);
  sdkPromise ??= new Promise<TossPaymentsFactory>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.onload = () =>
      window.TossPayments
        ? resolve(window.TossPayments)
        : reject(new Error("TossPayments SDK not available"));
    script.onerror = () => reject(new Error("TossPayments SDK load failed"));
    document.head.appendChild(script);
  }).catch((error) => {
    sdkPromise = null;
    throw error;
  });
  return sdkPromise;
};

export const isTossConfigured = () => TOSS_CLIENT_KEY.length > 0;

interface OpenTossPaymentWindowParams {
  orderUid: string;
  orderName: string;
  amountMinor: number;
  /** 구매자가 결제창을 닫았을 때. 결제는 일어나지 않았다. */
  onCancel: () => void;
}

/**
 * 결제창을 띄운다. 결제수단을 고르면 인증을 요청하고, 성공·실패 모두 토스가 이 창을 결과 페이지로 보낸다.
 * SDK 를 못 받았거나 파라미터가 거절되면 예외를 던진다.
 */
export const openTossPaymentWindow = async ({
  orderUid,
  orderName,
  amountMinor,
  onCancel,
}: OpenTossPaymentWindowParams) => {
  const TossPayments = await loadSdk();
  const widgets = TossPayments(TOSS_CLIENT_KEY).widgets({
    customerKey: TossPayments.ANONYMOUS,
  });
  // 금액은 서버가 주문에 박아 둔 값이다. 바꿔도 승인에서 걸린다.
  await widgets.setAmount({ value: amountMinor, currency: "KRW" });

  const base = `${window.location.origin}/payments/${TOSS_PROVIDER_SEGMENT}`;
  // orderName 은 결제창과 requestPayment 가 같아야 한다(최대 100자).
  const name = orderName.slice(0, 100);
  const paymentWindow = await widgets.renderPaymentWindow({ orderName: name });

  paymentWindow.on("cancel", () => {
    paymentWindow.destroy().catch(() => {});
    onCancel();
  });
  paymentWindow.on("paymentRequest", () => {
    widgets
      .requestPayment({
        orderId: orderUid,
        orderName: name,
        successUrl: `${base}/success`,
        failUrl: `${base}/fail`,
      })
      .catch(() => {
        // 인증 요청 단계에서 막혔다(파라미터 오류 등). 돈은 움직이지 않았다.
        paymentWindow.destroy().catch(() => {});
        onCancel();
      });
  });
};
