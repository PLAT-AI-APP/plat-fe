import * as Sentry from "@sentry/nextjs";

/**
 * 오류 수집(Sentry). DSN 이 없으면 아무것도 하지 않는다 — DSN 은 운영 준비 때 환경 변수로 넣는다.
 *
 * 대화 내용·개인정보가 섞이지 않게 기본 PII 수집을 끄고, 요청 본문은 싣지 않는다.
 */
export const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN ?? "";

export const isMonitoringEnabled = SENTRY_DSN !== "";

/** 주소의 쿼리스트링에는 검색어·토큰이 섞일 수 있어 경로만 남긴다. */
const stripQuery = (url: string | undefined) => url?.split("?")[0];

/**
 * 이벤트가 나가기 직전에 개인정보가 될 만한 것을 지운다.
 * 채팅 원문은 요청 본문·콘솔 로그·주소 쿼리에 실릴 수 있어 여기서 한 번 더 막는다.
 */
const scrubEvent = (event: Sentry.ErrorEvent): Sentry.ErrorEvent => {
  if (event.request) {
    delete event.request.data;
    delete event.request.cookies;
    delete event.request.headers;
    delete event.request.query_string;
    event.request.url = stripQuery(event.request.url);
  }
  delete event.user;
  return event;
};

/** 콘솔 출력은 채팅 내용이 그대로 찍힐 수 있어 모으지 않는다. 요청 기록은 주소의 쿼리를 뗀다. */
const scrubBreadcrumb = (
  breadcrumb: Sentry.Breadcrumb,
): Sentry.Breadcrumb | null => {
  if (breadcrumb.category === "console") return null;
  if (breadcrumb.data && typeof breadcrumb.data.url === "string") {
    breadcrumb.data.url = stripQuery(breadcrumb.data.url);
  }
  return breadcrumb;
};

export const sentryOptions = {
  dsn: SENTRY_DSN,
  environment:
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  sendDefaultPii: false,
  tracesSampleRate: 0,
  beforeSend: scrubEvent,
  beforeBreadcrumb: scrubBreadcrumb,
};

export const reportError = (
  error: unknown,
  extra?: Record<string, unknown>,
): void => {
  if (!isMonitoringEnabled) return;
  Sentry.captureException(error, extra ? { extra } : undefined);
};
