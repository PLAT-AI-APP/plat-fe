"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { ComponentType } from "react";
import useToggle from "@/hooks/common/useToggle";
import { ArrowDown, BookOpen, LockLine, User } from "@/icons";
import type { IconProps } from "@/icons";
import CheckCircle from "@/icons/CheckCircle";
import StatusWarning from "@/icons/StatusWarning";
import { cn } from "@/lib/utils";
import type { HandoverConsentDocument } from "@/type/withdrawal";
import CheckboxRow from "./CheckboxRow";

// 동의서 전문은 남기기를 고른 뒤에만 그린다. 약관 화면과 같은 렌더러를 쓴다.
// loading 이 없으면 dynamic 이 자체 Suspense 경계를 두지 않아, 처음 그릴 때 페이지 전체가 잠깐 교체되며
// 스크롤이 맨 위로 튄다. 대기 자리를 이 상자 안에 둔다.
const MarkdownDocument = dynamic(
  () => import("@/components/markdown/MarkdownDocument"),
  {
    loading: () => (
      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-4 w-full rounded" />
        ))}
      </div>
    ),
  },
);

/** 동의서 요약. 약관 명시·설명의무 대상이라 굵게 보인다. 되돌릴 수 없음은 경고 칸으로 따로 칠한다. */
const SUMMARY_ITEMS: {
  key: "copyright" | "anonymous" | "review" | "irreversible";
  icon: ComponentType<IconProps>;
}[] = [
  { key: "copyright", icon: LockLine },
  { key: "anonymous", icon: User },
  { key: "review", icon: CheckCircle },
  { key: "irreversible", icon: StatusWarning },
];

interface HandoverConsentCardProps {
  consent: HandoverConsentDocument;
  ageAttestationRequired: boolean;
  isConsentAgreed: boolean;
  onToggleConsent: () => void;
  isAdultAttested: boolean;
  onToggleAdult: () => void;
}

/**
 * 남기기를 하나라도 고르면 나오는 캐릭터 이용허락 동의.
 * 요약 네 칸 → 동의서 전문(접힌 채로 첫머리를 미리 보인다) → 동의 체크 순서로 읽고 내려오게 한다.
 */
const HandoverConsentCard = ({
  consent,
  ageAttestationRequired,
  isConsentAgreed,
  onToggleConsent,
  isAdultAttested,
  onToggleAdult,
}: HandoverConsentCardProps) => {
  const t = useTranslations("withdrawalPage.characters");
  const documentToggle = useToggle();

  return (
    <section
      aria-labelledby="handover-consent-title"
      className="relative overflow-hidden rounded-3xl border border-main bg-darkest"
    >
      {/* 머리 쪽에만 브랜드 빛을 은은하게 깐다. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-brand-opacity-2 via-brand-opacity-3 to-transparent"
      />

      <div className="relative flex flex-col gap-5 p-5 sm:p-6">
        <header className="flex items-start gap-3.5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand text-on-brand shadow-[0_8px_24px_-8px_var(--color-brand)]">
            <BookOpen size={22} aria-hidden="true" />
          </span>
          <div className="flex min-w-0 flex-col gap-1">
            <h4 id="handover-consent-title" className="title-2 flex flex-wrap items-center gap-2 text-font-1">
              {t("consentTitle")}
              <span className="body-8 rounded-full border border-main bg-dark/60 px-2 py-0.5 font-medium text-font-2">
                v{consent.version}
              </span>
            </h4>
            <p className="body-6 break-keep text-font-2">{t("consentSubtitle")}</p>
          </div>
        </header>

        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SUMMARY_ITEMS.map(({ key, icon: Icon }) => {
            const isWarning = key === "irreversible";

            return (
              <li
                key={key}
                className={cn(
                  "flex items-start gap-3 rounded-2xl p-3.5",
                  isWarning ? "bg-warning-bg" : "bg-card",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-xl",
                    isWarning ? "bg-warning/15 text-warning" : "bg-dark text-font-1",
                  )}
                >
                  <Icon size={16} aria-hidden="true" />
                </span>
                <span
                  className={cn(
                    "title-6 break-keep pt-1.5 leading-snug",
                    isWarning ? "text-warning" : "text-font-1",
                  )}
                >
                  {t(`summary.${key}`)}
                </span>
              </li>
            );
          })}
        </ul>

        {/* 동의서 전문. 접혀 있어도 첫머리가 보여 "무엇에 동의하는지"가 가려지지 않는다. */}
        <div className="relative overflow-hidden rounded-2xl border border-main bg-dark">
          <div
            className={cn(
              "body-5 px-4 pt-4 text-font-1 transition-[max-height] duration-300",
              // 접힌 동안은 스크롤 자체를 막아(overflow-clip) 늘 첫머리가 보이게 한다.
              documentToggle.isOpen ? "max-h-96 overflow-y-auto pb-4" : "max-h-36 overflow-clip",
            )}
          >
            <MarkdownDocument content={consent.content} />
          </div>
          {!documentToggle.isOpen && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-11 h-20 bg-linear-to-t from-dark to-transparent"
            />
          )}
          <button
            type="button"
            aria-expanded={documentToggle.isOpen}
            onClick={documentToggle.toggle}
            className="title-6 relative flex h-11 w-full items-center justify-center gap-1.5 border-t border-main text-font-2 transition-colors hover:bg-btn-hover hover:text-font-1"
          >
            {documentToggle.isOpen ? t("hideConsent") : t("viewConsent")}
            <ArrowDown
              size={14}
              aria-hidden="true"
              className={cn("transition-transform duration-200", documentToggle.isOpen && "rotate-180")}
            />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <CheckboxRow
            variant="card"
            checked={isConsentAgreed}
            onToggle={onToggleConsent}
            label={t("consentAgree", { version: consent.version })}
          />
          {ageAttestationRequired && (
            <CheckboxRow
              variant="card"
              checked={isAdultAttested}
              onToggle={onToggleAdult}
              label={t("adultAttest")}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default HandoverConsentCard;
