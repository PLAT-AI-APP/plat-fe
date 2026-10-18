"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useSiteSettingsQuery } from "@/api/system/getSiteSettings";
import type { TermsLanguage } from "@/api/legal/getTerms";
import { Close } from "@/icons";
import { useLocaleStore } from "@/store/useLocaleStore";

const DISMISSED_KEY = "plat_beta_banner_dismissed_v1";
/** 배포 env 에 "off" 를 넣으면 배너를 끈다(정식 출시 때). */
const IS_ENABLED = process.env.NEXT_PUBLIC_BETA_BANNER !== "off";
export const BUG_REPORT_PATH = "/customer-service/qna/new?category=BUG";

/** 관리자가 문구를 바꾸면(updatedAt 이 바뀌면) 닫았던 사용자에게도 다시 보이도록 닫기 기록을 시각별로 둔다. */
const dismissedKeyOf = (updatedAt: string | null | undefined) =>
  updatedAt ? `${DISMISSED_KEY}:${updatedAt}` : DISMISSED_KEY;

const listeners = new Set<() => void>();

// 사생활 보호 모드 등에서는 저장소 접근 자체가 예외를 던진다. 그때는 닫지 않은 것으로 보고 이번 방문 동안만 닫는다.
const dismissedInMemory = new Set<string>();
const readDismissed = (key: string) => {
  if (dismissedInMemory.has(key)) return true;
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
};
const dismiss = (key: string) => {
  // 기본 키도 함께 남겨, 다음 방문에서 설정을 받기 전에 띠가 잠깐 보였다 사라지지 않게 한다.
  const keys = [key, DISMISSED_KEY];
  keys.forEach((item) => dismissedInMemory.add(item));
  try {
    keys.forEach((item) => window.localStorage.setItem(item, "1"));
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
 *
 * env 로 켜져 있고 관리자 콘솔 > 사이트 설정에서도 켜져 있을 때만 보인다. 설정을 받기 전·못 받았을 때는
 * env 만으로 정한다. 문구는 설정에 현재 언어 문구가 있으면 그것을, 없으면 번역 문구를 쓴다.
 */
const BetaBanner = () => {
  const t = useTranslations("betaBanner");
  const locale = useLocaleStore((state) => state.locale);
  const { data: settings } = useSiteSettingsQuery();
  const dismissedKey = dismissedKeyOf(settings?.updatedAt);
  const isDismissed = useSyncExternalStore(
    subscribe,
    () => readDismissed(dismissedKey),
    () => true,
  );

  if (!IS_ENABLED || isDismissed) return null;
  if (settings && !settings.betaBannerEnabled) return null;

  const message =
    settings?.betaBannerMessages?.[
      locale.toUpperCase() as TermsLanguage
    ]?.trim() || t("message");

  return (
    <div
      role="region"
      aria-label={t("label")}
      className="body-6 mb-3 flex items-center justify-between gap-3 rounded-xl border border-brand/30 bg-brand-opacity-2 px-4 py-2 text-font-1"
    >
      <p className="min-w-0">
        <span className="font-semibold text-brand">{t("badge")}</span> {message}{" "}
        <Link href={BUG_REPORT_PATH} className="underline underline-offset-2">
          {t("report")}
        </Link>
      </p>
      <button
        type="button"
        onClick={() => dismiss(dismissedKey)}
        aria-label={t("close")}
        className="flex size-6 shrink-0 items-center justify-center text-font-2 transition-colors hover:text-font-1"
      >
        <Close className="size-4" />
      </button>
    </div>
  );
};

export default BetaBanner;
