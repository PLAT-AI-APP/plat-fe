"use client";

import React from "react";
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
  verified: "bg-brand/10 text-brand-dark",
  renewSoon: "bg-danger-bg text-danger",
  expired: "bg-card text-font-2",
  unverified: "bg-card text-font-disabled",
};

interface VerificationRowProps {
  label: string;
  verifiedAt: string | null | undefined;
  verifiedUntil: string | null | undefined;
  /** 미인증일 때 덧붙일 안내(성인인증은 만 19세 이상만 된다는 것). */
  unverifiedHint?: string;
}

const VerificationRow = ({
  label,
  verifiedAt,
  verifiedUntil,
  unverifiedHint,
}: VerificationRowProps) => {
  const t = useTranslations("adultVerification");
  const openModal = useModalStore((state) => state.openModal);
  const status = getVerificationStatus(verifiedAt, verifiedUntil);
  const needsAction = status !== "verified";

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border px-4 py-3",
        status === "renewSoon" ? "border-danger" : "border-main",
      )}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="title-6 text-font-1">{label}</span>
          <span
            className={cn(
              "body-8 shrink-0 rounded-md px-1.5 py-0.5",
              BADGE_CLASS[status],
            )}
          >
            {t(`status.${status}`)}
          </span>
        </div>

        {status === "unverified" ? (
          <p className="body-7 text-font-2">
            {unverifiedHint ?? t("field.notVerified")}
          </p>
        ) : status === "expired" ? (
          <p className="body-7 text-font-2">
            {t("field.expiredAt", { date: formatDate(verifiedUntil) })}
          </p>
        ) : (
          <p className="body-7 text-font-2">
            {t("field.verifiedAt", { date: formatDate(verifiedAt) })}
            {" · "}
            <span className={cn(status === "renewSoon" && "text-danger")}>
              {t("field.until", { date: formatDate(verifiedUntil) })}
            </span>
          </p>
        )}

        {status === "renewSoon" && (
          <p className="body-7 text-danger">{t("field.renewNotice")}</p>
        )}
      </div>

      {needsAction && (
        <Button
          size="sm"
          variant={status === "unverified" ? "primary" : "brandSoft"}
          onClick={() => openModal("IDENTITY_VERIFICATION")}
        >
          {status === "unverified" ? t("field.verify") : t("field.renew")}
        </Button>
      )}
    </div>
  );
};

/** 프로필 수정의 본인인증·성인인증 상태. 인증·갱신은 본인인증 모달 하나로 한다(성인이면 성인인증도 함께). */
const VerificationField = () => {
  const t = useTranslations("adultVerification.field");
  const user = useUserStore((state) => state.user);

  return (
    <section className="flex flex-col gap-2">
      <h3 className="title-5 text-font-1">{t("title")}</h3>
      <VerificationRow
        label={t("identity")}
        verifiedAt={user?.identityVerifiedAt}
        verifiedUntil={user?.identityVerifiedUntil}
      />
      <VerificationRow
        label={t("adult")}
        verifiedAt={user?.adultVerifiedAt}
        verifiedUntil={user?.adultVerifiedUntil}
        unverifiedHint={t("adultMinorNotice")}
      />
    </section>
  );
};

export default VerificationField;
