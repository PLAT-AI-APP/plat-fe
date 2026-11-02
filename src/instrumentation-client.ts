import * as Sentry from "@sentry/nextjs";
import { isMonitoringEnabled, sentryOptions } from "@/lib/monitoring";
// Next.js 라우터·next-navigation-guard 의 popstate 리스너보다 먼저 달려야 하므로 하이드레이션 전에 실행되는 이 파일에서 불러온다.
import "@/lib/popStateGuard";

/** 브라우저 쪽 오류 수집. DSN 이 없으면 켜지 않는다. */
if (isMonitoringEnabled) {
  Sentry.init(sentryOptions);
}
