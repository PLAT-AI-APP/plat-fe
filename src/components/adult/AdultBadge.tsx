"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

/** 성인 콘텐츠 "19" 표시. 카드 제목·상세 제목 옆에 붙는다. */
const AdultBadge = ({ className }: { className?: string }) => {
  const t = useTranslations("adultVerification.badge");

  return (
    <span
      role="img"
      aria-label={t("ariaLabel")}
      className={cn(
        "inline-flex size-[18px] shrink-0 items-center justify-center rounded-full border border-danger text-[10px] font-semibold leading-none text-danger",
        className,
      )}
    >
      {t("label")}
    </span>
  );
};

export default AdultBadge;
