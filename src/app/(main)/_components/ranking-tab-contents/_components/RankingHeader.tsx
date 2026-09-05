"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import dayjs from "@/lib/dayjs";
import { cn } from "@/lib/utils";
import FilterDropdown from "../../FilterDropdown";
import {
  RANKING_SORTS,
  RANKING_SORT_LABEL_KEYS,
  RankingSortId,
  PERIOD_IDS,
  PeriodId,
} from "./rankingFilters";

const PeriodPills = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const currentPeriod = searchParams.get("period") || "live";
  const currentSort = searchParams.get("sort") || "chats";

  return (
    <ul className="flex items-center gap-2">
      {PERIOD_IDS.map((id: PeriodId) => {
        const isActive = currentPeriod === id;

        return (
          <li key={id}>
            <Link
              href={{ query: { tab: "ranking", period: id, sort: currentSort } }}
              className={cn(
                "body-5 flex items-center justify-center whitespace-nowrap rounded-2xl px-4 py-2 transition-colors",
                isActive
                  ? "bg-font-1 text-font-4"
                  : "text-font-1 bg-card-selected",
              )}
            >
              {t(`ranking.${id}`)}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

interface RankingHeaderProps {
  sort: RankingSortId;
  onSortChange: (sort: RankingSortId) => void;
}

const RankingHeader = ({ sort, onSortChange }: RankingHeaderProps) => {
  const t = useTranslations();

  const updatedAt = t("rankingPage.updatedAt", {
    date: dayjs().format("YY.MM.DD"),
  });

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-2">
        <h2 className="title-2 text-font-1">{t("rankingPage.title")}</h2>
        <span className="body-6 text-font-disabled">{updatedAt}</span>
      </div>

      <div className="flex w-full items-center justify-between">
        <PeriodPills />

        <FilterDropdown
          value={sort}
          options={RANKING_SORTS}
          labelKeys={RANKING_SORT_LABEL_KEYS}
          onChange={onSortChange}
        />
      </div>
    </div>
  );
};

export default RankingHeader;
