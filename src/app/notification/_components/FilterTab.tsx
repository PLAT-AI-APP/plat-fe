"use client";

import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const FILTER_TAB_IDS = ["ALL", "NOTICE", "UPDATE", "EVENT"] as const;

interface FilterTabProps {
  currentFilter: "NOTICE" | "UPDATE" | "EVENT" | null | undefined;
}

const FilterTab = ({ currentFilter }: FilterTabProps) => {
  const t = useTranslations();

  const filterLabelMap = {
    ALL: t("notification.filters.all"),
    NOTICE: t("notification.filters.notice"),
    UPDATE: t("notification.filters.update"),
    EVENT: t("notification.filters.event"),
  } as const;

  return (
    <nav>
      <ul className="flex gap-2">
        {FILTER_TAB_IDS.map((id) => {
          const isActive =
            currentFilter === id || (id === "ALL" && !currentFilter);

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
                  query: id === "ALL" ? {} : { filter: id },
                }}
                className={cn(
                  "body-4 text-font-2 transition-colors",
                  isActive && "text-font-1",
                )}
              >
                {filterLabelMap[id]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default FilterTab;
