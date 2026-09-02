"use client";

import { useTranslations } from "next-intl";
import { useOfficialPreviewQuery } from "@/api/home/getOfficialPreview";
import CharacterCard from "../character-card";
import { getCardGridTemplateColumns } from "../character-card/constants";
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

      <div
        className="grid w-full gap-x-4 gap-y-7"
        style={{
          gridTemplateColumns: getCardGridTemplateColumns("S"),
        }}
      >
        {(officialPreviewList ?? []).map((character) => (
          <CharacterCard
            key={character.universeId}
            size="S"
            title={character.title}
            description={character.description}
            creatorName="PLAT"
            chatCount={character.chatCount}
            images={character.images}
            isOfficial
            fluid
          />
        ))}
      </div>
    </article>
  );
};

export default OfficialTabContents;
