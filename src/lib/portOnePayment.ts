/**
 * 포트원 V2 인증 결제.
 *
 * 흐름
 *  1. 서버가 주문을 만들고 금액·주문번호를 정한다. 주문번호를 포트원 paymentId 로 쓴다.
 *  2. SDK 로 결제창을 띄운다. 모바일까지 한 흐름으로 처리하려고 항상 리다이렉트로 돌아온다.
 *  3. 포트원이 이 창을 /payments/portone/success?orderUid=..&paymentId=..&paymentToken=.. 로 보낸다(실패면 code·message 가 붙는다).
 *  4. 결과 페이지가 paymentToken 을 서버에 보내고, 서버가 주문 금액으로 수동 승인 API 를 부른다. 이때 돈이 움직인다.
 *
 * 스토어 아이디·채널 키는 공개값이다. API Secret 은 서버에만 있다.
 */

import { isDevToolsEnabledFor } from "@/constants/identityVerification";

const SDK_URL = "https://cdn.portone.io/v2/browser-sdk.js";

const STORE_ID = process.env.NEXT_PUBLIC_PORTONE_STORE_ID ?? "";
const CHANNEL_KEY = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY ?? "";

/** 테스트 채널. 운영은 apphosting.prod.yaml 이 실연동 채널로 덮어쓴다. */
const TEST_CHANNEL_KEY = "channel-key-7ac022f7-b78c-4fa0-b2f6-cb7d09be076d";

// shortcut: PG 필수값인 전화번호는 프로필 응답에 없어 고정값이다. 결제창에 보이지 않는다. 본인인증 번호를 내려 주면 바꾼다.
const BUYER_PHONE = "010-0000-0000";

/**
 * 결제를 아직 열지 않았는지. 운영에서는 실연동 채널을 넣어야 충전이 열린다.
 * 테스트 채널로 열면 실제 돈 없이 결제되기 때문이다. 로컬·dev 는 테스트 채널로 그대로 연다.
 */
export const isPaymentPreparing = (host: string | null | undefined) =>
  !isDevToolsEnabledFor(host) &&
  (!CHANNEL_KEY || CHANNEL_KEY === TEST_CHANNEL_KEY);

/** 채널이 없으면 결제창을 띄울 수 없다(로컬 가짜 PG 는 이동 주소로 간다). */
export const isPortOneConfigured = () => CHANNEL_KEY.length > 0;

interface PortOneSdk {
  requestPayment(params: {
    storeId: string;
    channelKey: string;
    paymentId: string;
    orderName: string;
    totalAmount: number;
    currency: "CURRENCY_KRW";
    payMethod: "CARD";
    customer: { fullName: string; phoneNumber: string; email: string };
    redirectUrl: string;
    forceRedirect: boolean;
  }): Promise<{ code?: string; message?: string } | undefined>;
}

declare global {
  interface Window {
    PortOne?: PortOneSdk;
  }
}

let sdkPromise: Promise<PortOneSdk> | null = null;

/** SDK 스크립트를 한 번만 받는다. 실패하면 다음 시도에서 다시 받는다. */
const loadSdk = () => {
  if (window.PortOne) return Promise.resolve(window.PortOne);
  sdkPromise ??= new Promise<PortOneSdk>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.onload = () =>
      window.PortOne
        ? resolve(window.PortOne)
        : reject(new Error("PortOne SDK not available"));
    script.onerror = () => reject(new Error("PortOne SDK load failed"));
    document.head.appendChild(script);
  }).catch((error) => {
    sdkPromise = null;
    throw error;
  });
  return sdkPromise;
};

/** 결제창을 띄운다. 창이 열리면 이 페이지를 떠나므로, 돌아오는 값은 요청 자체가 거절된 경우뿐이다. */
export const requestPortOnePayment = async ({
  orderUid,
  orderName,
  amountMinor,
  buyerName,
  buyerEmail,
}: {
  orderUid: string;
  orderName: string;
  amountMinor: number;
  buyerName: string;
  buyerEmail: string;
}) => {
  const PortOne = await loadSdk();
  const response = await PortOne.requestPayment({
    storeId: STORE_ID,
    channelKey: CHANNEL_KEY,
    paymentId: orderUid,
    orderName,
    totalAmount: amountMinor,
    currency: "CURRENCY_KRW",
    payMethod: "CARD",
    customer: {
      fullName: buyerName,
      phoneNumber: BUYER_PHONE,
      email: buyerEmail,
    },
    redirectUrl: `${window.location.origin}/payments/portone/success?orderUid=${encodeURIComponent(orderUid)}`,
    forceRedirect: true,
  });
  if (response?.code !== undefined) {
    throw new Error(response.message ?? response.code);
  }
};
