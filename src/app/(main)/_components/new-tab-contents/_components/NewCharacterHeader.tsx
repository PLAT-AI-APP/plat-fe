"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import dayjs from "@/lib/dayjs";
import FilterDropdown from "../../FilterDropdown";

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

const NewCharacterHeader = () => {
  const t = useTranslations();
  const [contentType, setContentType] = useState<ContentType>("character");
  const [sortOption, setSortOption] = useState<SortOption>("chats");

  const updatedAt = t("newPage.updatedAt", {
    date: dayjs().format("YY.MM.DD"),
  });

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="title-2 text-font-1">{t("newPage.title")}</h2>
        <span className="body-5 text-font-disabled">{updatedAt}</span>
      </div>

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
  );
};

export default NewCharacterHeader;
