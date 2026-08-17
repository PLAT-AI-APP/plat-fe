"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import dayjs from "@/lib/dayjs";
import { cn } from "@/lib/utils";
import FilterDropdown from "../../FilterDropdown";

const PERIOD_IDS = ["live", "daily", "monthly", "weekly"] as const;

const PeriodPills = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const currentPeriod = searchParams.get("period") || "live";

  return (
    <ul className="flex items-center gap-2">
      {PERIOD_IDS.map((id) => {
        const isActive = currentPeriod === id;

        return (
          <li key={id}>
            <Link
              href={{ query: { tab: "categories", period: id } }}
              className={cn(
                "flex items-center justify-center whitespace-nowrap rounded-[20px] px-4 py-2 text-base",
                isActive
                  ? "title-3 bg-font-1 text-font-4"
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

type MessageKey = Parameters<ReturnType<typeof useTranslations>>[0];

const CONTENT_TYPES = ["character", "world"] as const;
type ContentType = (typeof CONTENT_TYPES)[number];
const CONTENT_TYPE_LABEL_KEYS: Record<ContentType, MessageKey> = {
  character: "categoriesPage.contentTypeCharacter",
  world: "categoriesPage.contentTypeWorld",
};

const SORT_OPTIONS = ["chats", "recommended", "wish"] as const;
type SortOption = (typeof SORT_OPTIONS)[number];
const SORT_LABEL_KEYS: Record<SortOption, MessageKey> = {
  chats: "categoriesPage.sortChats",
  recommended: "categoriesPage.sortRecommended",
  wish: "categoriesPage.sortWish",
};

const CategoryRankingHeader = () => {
  const t = useTranslations();
  const [contentType, setContentType] = useState<ContentType>("character");
  const [sortOption, setSortOption] = useState<SortOption>("chats");

  const updatedAt = t("categoriesPage.rankingUpdatedAt", {
    date: dayjs().format("YY.MM.DD"),
  });

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-2">
        <h2 className="title-2 text-font-1">{t("categoriesPage.rankingTitle")}</h2>
        <span className="body-5 text-font-disabled">{updatedAt}</span>
      </div>

      <div className="flex w-full items-center justify-between">
        <PeriodPills />

        <div className="flex items-center gap-2">
          <FilterDropdown
            value={contentType}
            options={CONTENT_TYPES}
            labelKeys={CONTENT_TYPE_LABEL_KEYS}
            onChange={setContentType}
          />
          <FilterDropdown
            value={sortOption}
            options={SORT_OPTIONS}
            labelKeys={SORT_LABEL_KEYS}
            onChange={setSortOption}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryRankingHeader;
