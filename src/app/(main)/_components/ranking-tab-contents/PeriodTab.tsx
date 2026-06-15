"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import dayjs from "@/lib/dayjs";
import { cn } from "@/lib/utils";

const PERIOD_IDS = ["live", "daily", "weekly", "monthly"] as const;

const PeriodTab = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const currentPeriod = searchParams.get("period") || "live";

  const currentSortTime = useMemo(() => {
    if (currentPeriod === "live") {
      return `${dayjs().format("MM-DD HH:mm")} ${t("ranking.liveSuffix")}`;
    }

    const keyMap = {
      daily: "ranking.dailySortTime",
      weekly: "ranking.weeklySortTime",
      monthly: "ranking.monthlySortTime",
    } as const;

    if (currentPeriod in keyMap) {
      return t(keyMap[currentPeriod as keyof typeof keyMap]);
    }

    return "";
  }, [currentPeriod, t]);

  return (
    <header className="flex items-center justify-between">
      <nav>
        <ul className="flex gap-2">
          {PERIOD_IDS.map((id) => {
            const isActive = currentPeriod === id;

            return (
              <li
                key={id}
                className={cn(
                  "cursor-pointer rounded-[100px] bg-card px-3 py-1.5 hover:bg-card-hover",
                  isActive && "bg-card-selected",
                )}
              >
                <Link
                  href={{
                    query: {
                      tab: "ranking",
                      period: id,
                    },
                  }}
                  className={cn(
                    "text-sm text-font-2",
                    isActive && "text-font-1",
                  )}
                >
                  {t(`ranking.${id}`)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <span className="text-xs text-font-disabled">{currentSortTime}</span>
    </header>
  );
};

export default PeriodTab;
