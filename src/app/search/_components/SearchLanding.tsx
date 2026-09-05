"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import CharacterCard from "@/components/character/character-card";
import CardGrid from "@/components/character/character-card/CardGrid";
import { useRecentSearch } from "@/hooks/useRecentSearch";
import dayjs from "@/lib/dayjs";
import { cn, formatStatCount } from "@/lib/utils";
import { useLocaleStore } from "@/store/useLocaleStore";
import { QueryStateBoundary } from "@/components/state";
import {
  usePopularSearchTermsQuery,
  type PopularSearchTerm,
} from "@/api/search/getPopularSearchTerms";
import {
  SEARCH_MIN_KEYWORD_LENGTH,
  isSearchableKeyword,
} from "@/api/search/getSearch";
import { showAppToast } from "@/lib/toast";

/** 실시간 검색어 칸 수. 3열 x 2행 격자에 맞춘다. */
const LIVE_SEARCH_SIZE = 6;
import { DUMMY_SEARCH_CHARACTERS } from "./dummyData";
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
  item: PopularSearchTerm;
  onSelect: (keyword: string) => void;
}

const LiveSearchRankItem = ({ item, onSelect }: LiveSearchRankItemProps) => {
  const locale = useLocaleStore((state) => state.locale);
  const isTopThree = item.rank <= 3;

  return (
    <button
      type="button"
      onClick={() => onSelect(item.keyword)}
      className="flex w-full items-center justify-between rounded-xl bg-darkest p-4 hover:bg-btn-hover"
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
          className={cn("body-3", isTopThree ? "text-font-1" : "text-font-2")}
        >
          {item.keyword}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <span className="body-6 text-font-2">
          {formatStatCount(item.count, locale)}
        </span>
        {/* 새로 올라왔거나 순위가 그대로면 가리킬 방향이 없어 삼각형을 그리지 않습니다. */}
        {(item.trend === "UP" || item.trend === "DOWN") && (
          <TrendTriangle
            direction={item.trend === "UP" ? "up" : "down"}
            className={
              item.trend === "UP" ? "text-success" : "text-font-error"
            }
          />
        )}
      </div>
    </button>
  );
};

const SearchLanding = () => {
  const t = useTranslations();
  const router = useRouter();
  const { addKeyword, keywords, removeKeyword, clearAll } = useRecentSearch();
  const [queryDraft, setQueryDraft] = useState("");
  const {
    data: popularTerms,
    isPending: isTermsPending,
    isError: isTermsError,
    error: termsError,
    refetch: refetchTerms,
  } = usePopularSearchTermsQuery(LIVE_SEARCH_SIZE);

  const updatedAt = `${dayjs().format("YY.MM.DD HH")}시 ${t("ranking.liveSuffix")}`;

  // 실시간 검색어·최근 검색어 클릭과 직접 입력이 모두 이 문을 지납니다.
  const handleSearch = (keyword: string) => {
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) return;

    if (!isSearchableKeyword(trimmedKeyword)) {
      showAppToast(
        "error",
        t("searchResults.minLength", { count: SEARCH_MIN_KEYWORD_LENGTH }),
      );
      return;
    }

    addKeyword(trimmedKeyword);
    router.push(`/search?q=${encodeURIComponent(trimmedKeyword)}`);
  };

  const handleQuerySubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSearch(queryDraft);
  };

  return (
    <section className="@container mx-auto flex w-full max-w-(--content-max-width) flex-col gap-10 pt-5 pb-20">
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
          <span className="body-6 text-font-2">{updatedAt}</span>
        </div>

        <QueryStateBoundary
          isPending={isTermsPending}
          isError={isTermsError}
          error={termsError}
          isEmpty={popularTerms?.length === 0}
          onRetry={() => refetchTerms()}
          pendingFallback={
            <div className="grid grid-cols-1 gap-2 @lg:grid-cols-2 @2xl:grid-cols-3">
              {Array.from({ length: LIVE_SEARCH_SIZE }).map((_, index) => (
                <div
                  key={`term-skeleton-${index}`}
                  className="h-[58px] w-full animate-pulse rounded-xl bg-darkest"
                />
              ))}
            </div>
          }
          emptyMessage={t("searchResults.empty")}
        >
          <div className="grid grid-cols-1 gap-2 @lg:grid-cols-2 @2xl:grid-cols-3">
            {(popularTerms ?? []).map((item) => (
              <LiveSearchRankItem
                key={item.rank}
                item={item}
                onSelect={handleSearch}
              />
            ))}
          </div>
        </QueryStateBoundary>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between whitespace-nowrap">
            <h2 className="title-1 text-font-0">
              {t("searchLanding.popularCharactersTitle")}
            </h2>
            <span className="body-6 text-font-2">{updatedAt}</span>
          </div>

          {/* 예전에는 flex 한 줄이라 카드 6장이 폭을 나눠 갖다 못해 108px 까지 찌그러졌다.
              높이는 245px 로 고정이라 187:245 였던 비율이 화면마다 달라졌다. */}
          <CardGrid size="S">
            {DUMMY_SEARCH_CHARACTERS.slice(0, 6).map((character) => (
              <CharacterCard
                key={character.id}
                size="S"
                fluid
                title={character.title}
                description={character.description}
                creatorName={character.creatorName}
                chatCount={character.chatCount}
                images={character.image}
                isNew={character.isNew}
                isOfficial={character.isOfficial}
              />
            ))}
          </CardGrid>
        </div>

        <button
          type="button"
          onClick={() => router.push("/?tab=ranking")}
          className="flex items-center justify-center gap-1 rounded-xl border border-main bg-dark py-3 hover:bg-btn-hover"
        >
          <span className="body-5 text-font-2">
            {t("searchLanding.viewAllRanking")}
          </span>
        </button>
      </div>
    </section>
  );
};

export default SearchLanding;
