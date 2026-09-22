/**
 * PC 에서 결제창을 새 창으로 띄우고, 결제창이 결과 페이지로 돌아오면 그 결과를
 * 원래 창에 넘기는 약속.
 *
 * 흐름
 *  1. 원래 창이 구매 클릭 순간 빈 창을 연다(비동기 뒤에 열면 팝업 차단에 걸린다).
 *  2. 주문이 만들어지면 그 창을 PG 결제창 주소로 보낸다.
 *  3. PG 가 결제창을 /payments/{PG}/{result} 로 돌려보내면, 결제창은 승인을 직접
 *     보내지 않고 결과를 원래 창에 넘긴 뒤 스스로 닫는다.
 *  4. 원래 창이 같은 결과 페이지로 이동해 승인·결과 연출을 이어 간다.
 *
 * 보안
 *  - BroadcastChannel 은 같은 출처(origin)끼리만 닿는다. 다른 사이트는 이 채널을
 *    듣지도 쓰지도 못한다. opener 참조에 기대지 않으므로 PG 페이지의 COOP 설정으로
 *    창 사이 연결이 끊겨도 동작한다.
 *  - 받는 쪽은 자기가 만든 주문번호의 메시지만 받고, 값은 형식을 검사한 뒤
 *    주소를 새로 조립한다. 받은 문자열을 그대로 주소로 쓰지 않는다.
 *  - 메시지는 "어느 결과 페이지로 가라"는 신호일 뿐이다. 결제가 됐는지는 결과
 *    페이지가 서버에 다시 묻고, 승인도 서버가 금액·멱등키로 검증한다.
 */

export const PAYMENT_WINDOW_NAME = "plat-payment";
const CHANNEL_NAME = "plat-payment";
const RESULTS = new Set(["success", "cancel", "fail"]);
const PROVIDER_PATTERN = /^[a-z]{1,20}$/;
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{1,200}$/;

export interface PaymentReturn {
  provider: string;
  result: string;
  orderUid: string;
  pgToken: string | null;
}

/** 휴대폰·태블릿은 새 창 대신 지금 창에서 결제창으로 이동한다(앱 전환·팝업 제약). */
export const isMobileDevice = () =>
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

export const canUsePaymentWindow = () =>
  typeof window !== "undefined" &&
  typeof BroadcastChannel !== "undefined" &&
  !isMobileDevice();

const parseReturn = (value: unknown): PaymentReturn | null => {
  if (!value || typeof value !== "object") return null;
  const { provider, result, orderUid, pgToken } = value as Record<
    string,
    unknown
  >;
  if (typeof provider !== "string" || !PROVIDER_PATTERN.test(provider))
    return null;
  if (typeof result !== "string" || !RESULTS.has(result)) return null;
  if (typeof orderUid !== "string" || !TOKEN_PATTERN.test(orderUid))
    return null;
  if (pgToken !== null && (typeof pgToken !== "string" || !TOKEN_PATTERN.test(pgToken)))
    return null;
  return { provider, result, orderUid, pgToken };
};

/** 검사를 마친 값으로만 결과 페이지 주소를 만든다. */
export const paymentResultPath = ({
  provider,
  result,
  orderUid,
  pgToken,
}: PaymentReturn) => {
  const query = new URLSearchParams({ orderUid });
  if (pgToken) query.set("pg_token", pgToken);
  return `/payments/${provider}/${result}?${query}`;
};

/** PG 종류 이름을 결과 페이지 경로에 쓸 수 있는 모양으로. 결과 페이지는 이 값을 판단에 쓰지 않는다. */
export const providerSegment = (pgProvider: string) => {
  const segment = pgProvider.toLowerCase().replace(/[^a-z]/g, "");
  return PROVIDER_PATTERN.test(segment) ? segment : "pg";
};

/**
 * (결제창 안에서) 이 결과를 기다리는 원래 창이 있으면 넘긴다.
 * 원래 창이 받았다고 답하면 true — 이때 결제창은 승인을 보내지 않는다.
 */
export const handOffToOpener = (
  payload: PaymentReturn,
  timeoutMs = 700,
): Promise<boolean> => {
  if (typeof BroadcastChannel === "undefined") return Promise.resolve(false);
  if (!parseReturn(payload)) return Promise.resolve(false);

  return new Promise((resolve) => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    const nonce = crypto.randomUUID();
    const finish = (handedOff: boolean) => {
      clearTimeout(timer);
      channel.close();
      resolve(handedOff);
    };
    channel.onmessage = (event: MessageEvent) => {
      const data = event.data as Record<string, unknown> | null;
      if (
        data?.type === "ack" &&
        data.nonce === nonce &&
        data.orderUid === payload.orderUid
      ) {
        finish(true);
      }
    };
    const timer = setTimeout(() => finish(false), timeoutMs);
    channel.postMessage({ type: "return", nonce, payload });
  });
};

/** (원래 창에서) 내가 만든 주문의 결과만 받는다. 정리 함수를 돌려준다. */
export const listenForPaymentReturn = (
  orderUid: string,
  onReturn: (payload: PaymentReturn) => void,
) => {
  if (typeof BroadcastChannel === "undefined") return () => {};

  const channel = new BroadcastChannel(CHANNEL_NAME);
  channel.onmessage = (event: MessageEvent) => {
    const data = event.data as Record<string, unknown> | null;
    if (data?.type !== "return" || typeof data.nonce !== "string") return;
    const payload = parseReturn(data.payload);
    if (!payload || payload.orderUid !== orderUid) return;
    channel.postMessage({ type: "ack", nonce: data.nonce, orderUid });
    onReturn(payload);
  };
  return () => channel.close();
};

const windowFeatures = () => {
  const width = 480;
  const height = 720;
  const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2);
  const top = window.screenY + Math.max(0, (window.outerHeight - height) / 2);
  return `popup=yes,width=${width},height=${height},left=${Math.round(left)},top=${Math.round(top)}`;
};

/** 클릭 순간에 빈 결제창을 연다. 막혔으면 null — 이때는 지금 창에서 이동한다. */
export const openBlankPaymentWindow = (loadingText: string) => {
  const popup = window.open("", PAYMENT_WINDOW_NAME, windowFeatures());
  if (!popup) return null;
  try {
    // 주문을 만드는 동안 하얀 빈 창 대신 앱 배경색 위에 안내만 둔다.
    popup.document.title = loadingText;
    const body = popup.document.body;
    body.style.cssText =
      "margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#11141f;color:#989db8;font:15px system-ui,sans-serif";
    body.textContent = loadingText;
  } catch {
    // 이미 다른 주소로 가 있는 창을 재사용한 경우. 곧 결제창 주소로 바뀌므로 무시한다.
  }
  return popup;
};

/** 닫힌 결제창을 사용자가 다시 열 때(클릭 안에서 불러야 한다). */
export const reopenPaymentWindow = (redirectUrl: string) =>
  window.open(redirectUrl, PAYMENT_WINDOW_NAME, windowFeatures());
