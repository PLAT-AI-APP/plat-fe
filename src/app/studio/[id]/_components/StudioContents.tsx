"use client";

import { useTranslations } from "next-intl";
import React from "react";
import CharacterShowcase from "@/app/(main)/_components/CharacterShowcase";
import CharacterCreateBanner from "./CharacterCreateBanner";
import CharacterList from "./character-list";
import { DUMMY_CHARACTERS as charArray } from "./dummyData";
import Header from "./Header";
import SortFilter from "./SortFilter";
import StudioStats from "./StudioStats";
import ViewToggle from "./ViewToggle";

interface StudioContentsProps {
  id: string;
  sort: "latest" | "chats";
  viewMode: "list" | "grid";
}

const StudioContents = ({ id, sort, viewMode }: StudioContentsProps) => {
  const t = useTranslations("studio");

  return (
    <section className="@container mx-auto w-full max-w-175 pt-7.5">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 rounded-3xl border border-border-main bg-bg-darker p-5">
            <Header id={id} />
            <hr className="text-border-main" />
            <StudioStats />
          </div>

          <CharacterCreateBanner />
        </div>

        <div className="flex flex-col gap-2">
          <header className="flex items-center justify-between px-2.5 py-1.5">
            <span className="title-5 text-font-2">
              {t("worksCount", { count: charArray.length })}
            </span>

            <div className="flex items-center gap-1">
              <ViewToggle viewMode={viewMode} />
              <SortFilter currentSort={sort} />
            </div>
          </header>

          {charArray.length <= 0 ? (
            <div className="flex h-50 w-full items-center justify-center">
              <div className="flex flex-col gap-1 text-center">
                <span className="text-font-2">{t("emptyTitle")}</span>
                <span className="text-xs text-font-disabled">
                  {t("emptyDescription")}
                </span>
              </div>
            </div>
          ) : viewMode === "list" ? (
            <CharacterList char={charArray} />
          ) : (
            <CharacterShowcase
              charArray={charArray}
              cardSize="S"
              rowGap={12}
              columnGap={12}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default StudioContents;
