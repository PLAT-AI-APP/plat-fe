"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import dayjs from "@/lib/dayjs";
import { getVerificationStatus, type VerificationStatus } from "@/lib/adultAccess";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/store/useModalStore";
import { useUserStore } from "@/store/useUserStore";

const formatDate = (value: string | null | undefined) =>
  value ? dayjs(value).format("YYYY.MM.DD") : "";

const BADGE_CLASS: Record<VerificationStatus, string> = {
  verified: "bg-brand-opacity text-brand",
  renewSoon: "bg-warning-bg text-warning",
  expired: "bg-danger-bg text-danger",
  unverified: "bg-card text-font-disabled",
};

const BAR_CLASS: Record<VerificationStatus, string> = {
  verified: "bg-gradient-to-r from-brand to-[#ffb35c]",
  renewSoon: "bg-warning",
  expired: "bg-danger",
  unverified: "bg-transparent",
};

const DAY_MS = 24 * 60 * 60 * 1000;
const VALIDITY_DAYS = 365;

/** 본인인증 아이콘 — 사람 실루엣 위 체크 */
const IdentityIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
    <circle cx="10" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.9" />
    <path d="M3.8 19.2c.6-3.3 3.2-5.4 6.2-5.4 1.2 0 2.3.3 3.2.9" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    <path d="m14.6 17.4 2.1 2.1 4-4.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface VerificationRowProps {
  kind: "identity" | "adult";
  label: string;
  verifiedAt: string | null | undefined;
  verifiedUntil: string | null | undefined;
  /** 미인증일 때 덧붙일 안내(성인인증은 만 19세 이상만 된다는 것). */
  unverifiedHint?: string;
}

const VerificationRow = ({
  kind,
  label,
  verifiedAt,
  verifiedUntil,
  unverifiedHint,
}: VerificationRowProps) => {
  const t = useTranslations("adultVerification");
  const openModal = useModalStore((state) => state.openModal);
  // 렌더마다 시각이 바뀌지 않게 처음 그릴 때의 시각으로 계산한다(모달을 다시 열면 새로 잡힌다).
  const [now] = useState(() => Date.now());
  const status = getVerificationStatus(verifiedAt, verifiedUntil, now);
  const needsAction = status !== "verified";
  const active = status === "verified" || status === "renewSoon";
  const daysLeft = verifiedUntil
    ? Math.max(0, Math.ceil((new Date(verifiedUntil).getTime() - now) / DAY_MS))
    : 0;
  const remaining = active ? Math.min(1, daysLeft / VALIDITY_DAYS) : 0;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border px-4 py-3.5 transition-colors",
        status === "renewSoon" ? "border-warning/60" : "border-main",
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            active ? "bg-brand-opacity text-brand" : "bg-darkest text-font-disabled",
          )}
        >
          {kind === "adult" ? (
            <span className={cn("text-[13px] font-extrabold tracking-[-0.04em]", active ? "text-danger" : "")}>
              19
            </span>
          ) : (
            <IdentityIcon />
          )}
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="title-6 text-font-1">{label}</span>
            <span className={cn("body-8 shrink-0 rounded-full px-2 py-0.5 font-semibold", BADGE_CLASS[status])}>
              {t(`status.${status}`)}
            </span>
          </div>
          <p className="body-7 truncate text-font-2">
            {status === "unverified"
              ? (unverifiedHint ?? t("field.notVerified"))
              : status === "expired"
                ? t("field.expiredAt", { date: formatDate(verifiedUntil) })
                : `${t("field.verifiedAt", { date: formatDate(verifiedAt) })} · ${t("field.until", { date: formatDate(verifiedUntil) })}`}
          </p>
        </div>

        {needsAction && (
          <Button
            size="sm"
            variant={status === "unverified" || status === "expired" ? "primary" : "brandSoft"}
            onClick={() => openModal("IDENTITY_VERIFICATION")}
          >
            {status === "unverified" ? t("field.verify") : t("field.renew")}
          </Button>
        )}
      </div>

      {active && (
        <div className="flex items-center gap-3">
          <div
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-darkest"
            role="progressbar"
            aria-label={t("field.remaining")}
            aria-valuemin={0}
            aria-valuemax={VALIDITY_DAYS}
            aria-valuenow={daysLeft}
          >
            <div
              className={cn("h-full rounded-full transition-[width] duration-slow", BAR_CLASS[status])}
              style={{ width: `${Math.max(remaining * 100, 4)}%` }}
            />
          </div>
          <span className={cn("body-8 shrink-0 font-semibold", status === "renewSoon" ? "text-warning" : "text-font-2")}>
            {t("field.daysLeft", { days: daysLeft })}
          </span>
        </div>
      )}

      {status === "renewSoon" && <p className="body-7 -mt-1 text-warning">{t("field.renewNotice")}</p>}
    </div>
  );
};

/** 프로필 수정의 본인인증·성인인증 상태. 인증·갱신은 본인인증 모달 하나로 한다(성인이면 성인인증도 함께). */
const VerificationField = () => {
  const t = useTranslations("adultVerification.field");
  const user = useUserStore((state) => state.user);

  return (
    <section className="flex flex-col gap-2.5">
      <h3 className="title-5 text-font-1">{t("title")}</h3>
      <VerificationRow
        kind="identity"
        label={t("identity")}
        verifiedAt={user?.identityVerifiedAt}
        verifiedUntil={user?.identityVerifiedUntil}
      />
      <VerificationRow
        kind="adult"
        label={t("adult")}
        verifiedAt={user?.adultVerifiedAt}
        verifiedUntil={user?.adultVerifiedUntil}
        unverifiedHint={t("adultMinorNotice")}
      />
    </section>
  );
};

export default VerificationField;
