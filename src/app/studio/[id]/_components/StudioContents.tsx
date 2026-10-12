"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React from "react";
import CharacterShowcase from "@/components/character/CharacterShowcase";
import SortFilter from "@/components/character/SortFilter";
import EmptyState from "@/components/state/EmptyState";
import { useChangeQueryString } from "@/hooks/navigation/useChangeQueryString";
import CharacterCreateBanner from "./CharacterCreateBanner";
import EarningsBanner from "./EarningsBanner";
import CharacterList from "./character-list";
import { DUMMY_CHARACTERS as charArray } from "./dummyData";
import Header from "./Header";
import StudioStats from "./StudioStats";
import ViewToggle from "./ViewToggle";

interface StudioContentsProps {
  id: string;
}

const StudioContents = ({ id }: StudioContentsProps) => {
  const t = useTranslations("studio");
  const searchParams = useSearchParams();
  const viewMode: "list" | "grid" =
    searchParams.get("view") === "grid" ? "grid" : "list";
  const sort: "latest" | "chats" =
    searchParams.get("sort") === "chats" ? "chats" : "latest";
  const changeQueryString = useChangeQueryString();

  const handleSortChange = (nextSort: "latest" | "chats") => {
    changeQueryString({ updateKey: "sort", updateValue: nextSort });
  };

  return (
    <section className="@container mx-auto w-full max-w-175 pt-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 rounded-3xl border border-main bg-darker p-5">
            <Header id={id} />
            <hr className="text-main" />
            <StudioStats />
          </div>

          <EarningsBanner />
          <CharacterCreateBanner />
        </div>

        <div className="flex flex-col gap-2">
          <header className="flex items-center justify-between px-2.5 py-1.5">
            <span className="title-5 text-font-2">
              {t("worksCount", { count: charArray.length })}
            </span>

            <div className="flex items-center gap-1">
              <ViewToggle viewMode={viewMode} />
              <SortFilter currentSort={sort} onChange={handleSortChange} />
            </div>
          </header>

          {charArray.length <= 0 ? (
            <EmptyState mood="peek" message={t("emptyTitle")}>
              <span className="body-7 -mt-2 text-font-disabled">
                {t("emptyDescription")}
              </span>
            </EmptyState>
          ) : viewMode === "list" ? (
            <CharacterList char={charArray} />
          ) : (
            <CharacterShowcase
              charArray={charArray}
              cardSize="S"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default StudioContents;
