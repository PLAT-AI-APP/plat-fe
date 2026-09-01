"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import CharacterCard from "@/app/(main)/_components/character-card";
import { useRecentSearch } from "@/hooks/useRecentSearch";
import dayjs from "@/lib/dayjs";
import { cn, formatStatCount } from "@/lib/utils";
import { useLocaleStore } from "@/store/useLocaleStore";
import { DUMMY_LIVE_SEARCH_KEYWORDS, DUMMY_SEARCH_CHARACTERS } from "./dummyData";
import type { LiveSearchKeyword } from "./dummyData";
import SearchQueryBar from "./SearchQueryBar";
import PageTitle from "@/components/PageTitle";

interface TrendTriangleProps {
  direction: "up" | "down";
  className?: string;
}

// 프로젝트 아이콘 세트에 삼각형 글리프가 없어 랭킹 등락 표시용으로 직접 그립니다. (가로 11.67 x 세로 10.5)
const TrendTriangle = ({ direction, className }: TrendTriangleProps) => (
  <svg
    viewBox="0 0 11.67 10.5"
    fill="currentColor"
    className={cn("h-[10.5px] w-[11.67px]", className)}
  >
    <polygon
      points={
        direction === "up"
          ? "5.835,0 11.67,10.5 0,10.5"
          : "0,0 11.67,0 5.835,10.5"
      }
    />
  </svg>
);

interface LiveSearchRankItemProps {
  item: LiveSearchKeyword;
  onSelect: (keyword: string) => void;
}

const LiveSearchRankItem = ({ item, onSelect }: LiveSearchRankItemProps) => {
  const locale = useLocaleStore((state) => state.locale);
  const isTopThree = item.rank <= 3;

  return (
    <button
      type="button"
      onClick={() => onSelect(item.keyword)}
      className="flex w-full items-center justify-between rounded-xl bg-darkest p-4"
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "title-2 w-4 text-left",
            isTopThree ? "text-brand" : "text-font-disabled",
          )}
        >
          {item.rank}
        </span>
        <span
          className={cn("body-2", isTopThree ? "text-font-1" : "text-font-2")}
        >
          {item.keyword}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <span className="body-5 text-font-2">
          {formatStatCount(item.count, locale)}
        </span>
        <TrendTriangle
          direction={item.trend}
          className={item.trend === "up" ? "text-success" : "text-font-error"}
        />
      </div>
    </button>
  );
};

const SearchLanding = () => {
  const t = useTranslations();
  const router = useRouter();
  const { addKeyword, keywords, removeKeyword, clearAll } = useRecentSearch();
  const [queryDraft, setQueryDraft] = useState("");

  const updatedAt = `${dayjs().format("YY.MM.DD HH")}시 ${t("ranking.liveSuffix")}`;

  const handleSearch = (keyword: string) => {
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) return;

    addKeyword(trimmedKeyword);
    router.push(`/search?q=${encodeURIComponent(trimmedKeyword)}`);
  };

  const handleQuerySubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSearch(queryDraft);
  };

  return (
    <section className="mx-auto flex w-full max-w-[1272px] flex-col gap-14 px-9 pt-5 pb-20">
      <PageTitle messageKey="pageTitles.search" />

      <SearchQueryBar
        queryDraft={queryDraft}
        onQueryDraftChange={setQueryDraft}
        onSubmit={handleQuerySubmit}
        keywords={keywords}
        onKeywordClick={handleSearch}
        onKeywordRemove={removeKeyword}
        onClearAll={clearAll}
      />

      <div className="flex flex-col gap-4.5">
        <div className="flex items-center justify-between whitespace-nowrap">
          <h2 className="title-1 text-font-0">{t("searchLanding.liveSearchTitle")}</h2>
          <span className="body-5 text-font-2">{updatedAt}</span>
        </div>

        <div className="grid grid-cols-3 grid-rows-2 gap-2">
          {DUMMY_LIVE_SEARCH_KEYWORDS.map((item) => (
            <LiveSearchRankItem key={item.rank} item={item} onSelect={handleSearch} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-5.75">
        <div className="flex flex-col gap-4.5">
          <div className="flex items-center justify-between whitespace-nowrap">
            <h2 className="title-1 text-font-0">
              {t("searchLanding.popularCharactersTitle")}
            </h2>
            <span className="body-5 text-font-2">{updatedAt}</span>
          </div>

          <div className="flex items-center gap-4">
            {DUMMY_SEARCH_CHARACTERS.slice(0, 6).map((character) => (
              <CharacterCard
                key={character.id}
                size="S"
                title={character.title}
                description={character.description}
                creatorName={character.creatorName}
                chatCount={character.chatCount}
                images={character.image}
                isNew={character.isNew}
                isOfficial={character.isOfficial}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/?tab=ranking")}
          className="flex items-center justify-center gap-1 rounded-xl border border-main bg-dark py-3"
        >
          <span className="body-4 text-font-2">
            {t("searchLanding.viewAllRanking")}
          </span>
        </button>
      </div>
    </section>
  );
};

export default SearchLanding;
