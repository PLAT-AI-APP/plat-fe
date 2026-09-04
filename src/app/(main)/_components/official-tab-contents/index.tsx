"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useOfficialPreviewQuery } from "@/api/home/getOfficialPreview";
import CharacterShowcase from "@/components/character/CharacterShowcase";
import OfficialSortDropdown, {
  type OfficialSortOption,
} from "./_components/OfficialSortDropdown";

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
        <OfficialSortDropdown value={sort} onChange={setSort} />
      </div>

      <CharacterShowcase
        charArray={(officialPreviewList ?? []).map((character) => ({
          name: character.title,
          dec: character.description,
          creatorName: "PLAT",
          chatCount: character.chatCount,
          img: character.images,
          isOfficial: true,
        }))}
        cardSize="S"
        columnGap={16}
        rowGap={28}
        gridFillMode="auto-fill"
        isLoading={isPending}
        isError={isError}
        error={error}
        onRetry={refetch}
      />
    </article>
  );
};

export default OfficialTabContents;
