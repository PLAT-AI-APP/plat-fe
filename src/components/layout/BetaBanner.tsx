"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Close } from "@/icons";

const DISMISSED_KEY = "plat_beta_banner_dismissed_v1";
/** 배포 env 에 "off" 를 넣으면 배너를 끈다(정식 출시 때). */
const IS_ENABLED = process.env.NEXT_PUBLIC_BETA_BANNER !== "off";
export const BUG_REPORT_PATH = "/customer-service/qna/new?category=BUG";

const listeners = new Set<() => void>();

// 사생활 보호 모드 등에서는 저장소 접근 자체가 예외를 던진다. 그때는 닫지 않은 것으로 보고 이번 방문 동안만 닫는다.
let dismissedInMemory = false;
const readDismissed = () => {
  if (dismissedInMemory) return true;
  try {
    return window.localStorage.getItem(DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
};
const dismiss = () => {
  dismissedInMemory = true;
  try {
    window.localStorage.setItem(DISMISSED_KEY, "1");
  } catch {
    // 기억은 못 해도 지금 화면에서는 닫는다.
  }
  listeners.forEach((listener) => listener());
};
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/**
 * 클로즈베타 안내 띠. 문제를 겪으면 바로 알릴 수 있게 버그 제보 링크를 함께 둔다.
 * 서버 렌더에서는 닫힌 것으로 두어, 닫았던 사용자에게 띠가 잠깐 보였다 사라지지 않게 한다.
 */
const BetaBanner = () => {
  const t = useTranslations("betaBanner");
  const isDismissed = useSyncExternalStore(subscribe, readDismissed, () => true);

  if (!IS_ENABLED || isDismissed) return null;

  return (
    <div
      role="region"
      aria-label={t("label")}
      className="body-6 mb-3 flex items-center justify-between gap-3 rounded-xl border border-brand/30 bg-brand-opacity-2 px-4 py-2 text-font-1"
    >
      <p className="min-w-0">
        <span className="font-semibold text-brand">{t("badge")}</span>{" "}
        {t("message")}{" "}
        <Link href={BUG_REPORT_PATH} className="underline underline-offset-2">
          {t("report")}
        </Link>
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label={t("close")}
        className="flex size-6 shrink-0 items-center justify-center text-font-2 transition-colors hover:text-font-1"
      >
        <Close className="size-4" />
      </button>
    </div>
  );
};

export default BetaBanner;
