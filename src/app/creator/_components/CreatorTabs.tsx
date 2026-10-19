"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { m } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTabUnderline } from "@/hooks/dom/useTabUnderline";
import { SPRING_SNAPPY } from "@/constants/motion";
import { useEarningSummaryQuery } from "@/api/earning/getEarningSummary";
import { CREATOR_TIER_BADGE } from "@/constants/creatorTier";

type TabKey = "earnings" | "tier" | "exchange";

const TABS: Array<{ key: TabKey; href: string }> = [
  { key: "earnings", href: "/creator" },
  { key: "tier", href: "/creator/tier" },
  { key: "exchange", href: "/creator/exchange" },
];

/** 크리에이터 센터 머리. 수익 · 등급 · 교환을 나란히 둔 탭이고, 하위 상세 화면에서는 숨긴다. */
const CreatorTabs = () => {
  const t = useTranslations("earnings.center");
  const pathname = usePathname();
  const active: TabKey | null =
    TABS.find((tab) => tab.href === pathname)?.key ?? null;
  const { containerRef, setTabRef, rect } = useTabUnderline<TabKey>(
    active ?? "earnings",
  );
  const { data } = useEarningSummaryQuery();

  if (!active) return null;

  return (
    <header className="flex flex-col gap-4">
      <h1 className="heading-2">{t("title")}</h1>
      <nav
        ref={containerRef as React.RefObject<HTMLElement>}
        className="relative flex gap-1 border-b border-main"
      >
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            href={tab.href}
            ref={(el) => setTabRef(tab.key, el)}
            aria-current={active === tab.key ? "page" : undefined}
            className={cn(
              "body-3 flex items-center gap-1.5 px-4 py-2.5 text-font-disabled transition-colors hover:text-font-1",
              active === tab.key && "title-3 text-font-1",
            )}
          >
            {t(tab.key)}
            {tab.key === "tier" && data && data.tier !== "NONE" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={CREATOR_TIER_BADGE[data.tier]}
                alt=""
                width={18}
                height={18}
              />
            )}
          </Link>
        ))}
        <m.span
          className="absolute -bottom-px h-0.5 bg-brand"
          initial={false}
          animate={{ x: rect.left, width: rect.width }}
          transition={SPRING_SNAPPY}
        />
      </nav>
    </header>
  );
};

export default CreatorTabs;
