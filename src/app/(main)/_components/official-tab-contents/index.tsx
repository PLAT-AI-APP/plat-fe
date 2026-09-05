"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useOfficialPreviewQuery } from "@/api/home/getOfficialPreview";
import CharacterShowcase from "@/components/character/CharacterShowcase";
import FilterDropdown from "../FilterDropdown";

/**
 * 서버가 줄 세울 수 있는 기준만 둡니다 — universes 가 세고 있는 대화 수와 찜 수 둘입니다.
 * "추천"은 이 섹션에 대응하는 근거가 서버에 없어 뺐습니다.
 */
const OFFICIAL_SORTS = ["chats", "wish"] as const;
type OfficialSortOption = (typeof OFFICIAL_SORTS)[number];

const OFFICIAL_SORT_LABEL_KEYS = {
  chats: "officialPage.sortByChats",
  wish: "officialPage.sortWish",
} as const;

/** 화면의 정렬 pill 을 서버 기준으로 옮깁니다. */
const SORT_TO_API = { chats: "CHAT", wish: "LIKE" } as const;

const OfficialTabContents = () => {
  const t = useTranslations("officialPage");
  const [sort, setSort] = useState<OfficialSortOption>("chats");
  const {
    data: officialPreviewList,
    isPending,
    isError,
    error,
    refetch,
  } = useOfficialPreviewQuery({ sort: SORT_TO_API[sort] });

  return (
    <article className="flex w-full flex-col gap-5 pt-5">
      <div className="flex w-full items-center justify-between">
        <h2 className="title-2 text-font-1">{t("title")}</h2>
        <FilterDropdown
          value={sort}
          options={OFFICIAL_SORTS}
          labelKeys={OFFICIAL_SORT_LABEL_KEYS}
          onChange={setSort}
        />
      </div>

      <CharacterShowcase
        charArray={(officialPreviewList ?? []).map((character) => ({
          id: character.universeId,
          name: character.title,
          dec: character.description,
          creatorName: "PLAT",
          chatCount: character.chatCount,
          img: character.images,
          isOfficial: true,
        }))}
        cardSize="S"
        isLoading={isPending}
        isError={isError}
        error={error}
        onRetry={refetch}
      />
    </article>
  );
};

export default OfficialTabContents;
