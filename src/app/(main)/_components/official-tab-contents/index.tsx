"use client";

import { useTranslations } from "next-intl";
import { useOfficialPreviewQuery } from "@/api/home/getOfficialPreview";
import CharacterShowcase from "@/components/character/CharacterShowcase";
import OfficialSortDropdown from "./_components/OfficialSortDropdown";

const OfficialTabContents = () => {
  const t = useTranslations("officialPage");
  const { data: officialPreviewList } = useOfficialPreviewQuery();

  return (
    <article className="flex w-full flex-col gap-5 pt-5">
      <div className="flex w-full items-center justify-between">
        <h2 className="title-2 text-font-1">{t("title")}</h2>
        <OfficialSortDropdown />
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
      />
    </article>
  );
};

export default OfficialTabContents;
