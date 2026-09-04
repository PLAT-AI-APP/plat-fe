"use client";

import { useTranslations } from "next-intl";
import dayjs from "@/lib/dayjs";
import FilterDropdown from "../../FilterDropdown";
import {
  RANKING_SORTS,
  RANKING_SORT_LABEL_KEYS,
  RankingSortId,
} from "../../ranking-tab-contents/_components/rankingFilters";

interface NewCharacterHeaderProps {
  sort: RankingSortId;
  onSortChange: (sort: RankingSortId) => void;
}

const NewCharacterHeader = ({ sort, onSortChange }: NewCharacterHeaderProps) => {
  const t = useTranslations();

  const updatedAt = t("newPage.updatedAt", {
    date: dayjs().format("YY.MM.DD"),
  });

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="title-2 text-font-1">{t("newPage.title")}</h2>
        <span className="body-5 text-font-disabled">{updatedAt}</span>
      </div>

      <FilterDropdown
        value={sort}
        options={RANKING_SORTS}
        labelKeys={RANKING_SORT_LABEL_KEYS}
        onChange={onSortChange}
      />
    </div>
  );
};

export default NewCharacterHeader;
