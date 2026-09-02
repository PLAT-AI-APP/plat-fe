"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import CharacterShowcase from "@/components/character/CharacterShowcase";
import { useRecentSearch } from "@/hooks/useRecentSearch";
import dayjs from "@/lib/dayjs";
import { cn, formatStatCount } from "@/lib/utils";
import { useLocaleStore } from "@/store/useLocaleStore";
import {
  DUMMY_LIVE_SEARCH_KEYWORDS,
  DUMMY_SEARCH_CHARACTERS,
} from "./dummyData";
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
      className="group flex w-full items-center justify-between rounded-xl bg-darkest p-4 transition-all duration-200 hover:scale-[1.02] hover:bg-btn-hover active:scale-[0.98]"
    >
      <div className="relative flex min-w-0 flex-1 items-center gap-2">
        <p
          className={cn(
            "title-2 w-4 shrink-0 text-left whitespace-pre-line",
            isTopThree ? "text-brand" : "text-font-disabled",
          )}
        >
          {item.rank}
        </p>
        {/* 기본은 말줄임, hover 시 카드 위로 배경을 깔고 전체 문장을 보여줍니다.
            position/overflow는 transition이 안 먹어 static→absolute로 바로 전환하면
            뚝 끊겨 보인다. 그래서 오버레이는 항상 absolute로 고정해두고 opacity만
            움직여, 자리 이동 없이 페이드로만 부드럽게 나타나게 한다. */}
        <span
          className={cn(
            "body-2 truncate",
            isTopThree ? "text-font-1" : "text-font-2",
          )}
        >
          {item.keyword}
        </span>
        <span
          className={cn(
            "body-2 pointer-events-none absolute left-6 z-10 w-max max-w-[calc(100%+2rem)] rounded-lg bg-btn-hover px-2 py-1 text-left whitespace-normal opacity-0 transition-opacity duration-200 group-hover:opacity-100",
            isTopThree ? "text-font-1" : "text-font-2",
          )}
        >
          {item.keyword}
        </span>
      </div>

      {/* 순위 변동(카운트+화살표)은 hover 시 뜨는 전체 문장 오버레이(z-10)가 폭 계산상
          이 영역까지 덮을 수 있어, z-20으로 항상 그 위에 보이게 고정한다. */}
      <div className="relative z-20 flex shrink-0 items-center gap-1">
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

  // x축 여백(content-x)은 ClientLayout의 #page-content가 이미 지고 있어서,
  // 여기서는 순수 콘텐츠 폭만 다른 화면과 동일하게 1200px로 잡습니다.
  return (
    <section className="mx-auto flex w-full max-w-300 flex-col gap-10 pt-5 pb-20">
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

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between whitespace-nowrap">
          <h2 className="title-1 text-font-0">
            {t("searchLanding.liveSearchTitle")}
          </h2>
          <span className="body-5 text-font-2">{updatedAt}</span>
        </div>

        <div className="grid grid-cols-2 grid-rows-5 grid-flow-col gap-2">
          {DUMMY_LIVE_SEARCH_KEYWORDS.map((item) => (
            <LiveSearchRankItem
              key={item.rank}
              item={item}
              onSelect={handleSearch}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between whitespace-nowrap">
            <h2 className="title-1 text-font-0">
              {t("searchLanding.popularCharactersTitle")}
            </h2>
            <span className="body-5 text-font-2">{updatedAt}</span>
          </div>

          <CharacterShowcase
            charArray={DUMMY_SEARCH_CHARACTERS.slice(0, 6).map((character) => ({
              name: character.title,
              dec: character.description,
              creatorName: character.creatorName,
              chatCount: character.chatCount,
              img: character.image,
              isNew: character.isNew,
              isOfficial: character.isOfficial,
            }))}
            cardSize="S"
            columnGap={16}
            rowGap={28}
          />
        </div>

        <button
          type="button"
          onClick={() => router.push("/?tab=ranking")}
          className="flex items-center justify-center gap-1 rounded-xl border border-main bg-dark py-3 hover:bg-btn-hover"
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
