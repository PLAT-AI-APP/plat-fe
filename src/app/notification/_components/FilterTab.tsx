"use client";

import ShallowLink from "@/components/navigation/ShallowLink";
import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { NoticeCategory } from "@/type/notice";

const FILTER_TAB_IDS = [
  "ALL",
  "SERVICE",
  "UPDATE",
  "EVENT",
  "MAINTENANCE",
  "POLICY",
] as const;

interface FilterTabProps {
  currentFilter: NoticeCategory | null | undefined;
}

const FilterTab = ({ currentFilter }: FilterTabProps) => {
  const t = useTranslations();

  const filterLabelMap = {
    ALL: t("notification.filters.all"),
    SERVICE: t("notification.filters.service"),
    UPDATE: t("notification.filters.update"),
    EVENT: t("notification.filters.event"),
    MAINTENANCE: t("notification.filters.maintenance"),
    POLICY: t("notification.filters.policy"),
  } as const;

  return (
    <nav>
      <ul className="flex gap-2">
        {FILTER_TAB_IDS.map((id) => {
          const isActive =
            currentFilter === id || (id === "ALL" && !currentFilter);

          return (
            <li key={id}>
              {/* 같은 페이지 안의 전환이라 서버에 다시 묻지 않는다(ShallowLink). */}
              <ShallowLink
                href={id === "ALL" ? "/notification" : `/notification?filter=${id}`}
                // 배경·여백을 링크에 둔다. li 에 두면 글자 부분만 눌려 알약의 여백을 눌러도 반응이 없다.
                className={cn(
                  "body-5 block rounded-full bg-card px-3 py-1.5 text-font-2 transition-colors hover:bg-card-hover",
                  isActive && "bg-card-selected text-font-1",
                )}
              >
                {filterLabelMap[id]}
              </ShallowLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default FilterTab;
