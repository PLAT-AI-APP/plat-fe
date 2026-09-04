"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import CharacterCard from "@/components/character/character-card";
import { CharacterCardSkeleton } from "@/components/character/character-card/CharacterCardSkeleton";
import { QueryStateBoundary } from "@/components/state";
import {
  SEARCH_MIN_KEYWORD_LENGTH,
  isSearchableKeyword,
  useSearchQuery,
} from "@/api/search/getSearch";
import type { SearchCardItem } from "@/api/search/getSearch";
import { showAppToast } from "@/lib/toast";
import { useRecentSearch } from "@/hooks/useRecentSearch";
import { cn, formatStatCount } from "@/lib/utils";
import { useLocaleStore } from "@/store/useLocaleStore";
import SearchQueryBar from "./SearchQueryBar";
import UserResultCard from "./UserResultCard";
import PageTitle from "@/components/PageTitle";

interface CardGridProps {
  items: SearchCardItem[];
  isLoading: boolean;
}

/** 캐릭터·세계관 결과가 같은 격자를 쓰므로 한곳에 둡니다. */
const CardGrid = ({ items, isLoading }: CardGridProps) => (
  <div className="flex flex-wrap gap-x-4 gap-y-7">
    {isLoading
      ? Array.from({ length: 6 }).map((_, index) => (
          <CharacterCardSkeleton key={`card-skeleton-${index}`} size="S" />
        ))
      : items.map((item) => (
          <CharacterCard
            key={item.universeId}
            size="S"
            title={item.title}
            description={item.description}
            creatorName={item.creator.nickname}
            chatCount={item.chatCount}
            images={item.images}
            isNew={item.isNew}
            isOfficial={item.isOfficial}
          />
        ))}
  </div>
);

type SearchTab = "all" | "character" | "world" | "user";

interface ResultSectionProps {
  title: string;
  count?: number;
  children: React.ReactNode;
}

const ResultSection = ({ title, count, children }: ResultSectionProps) => {
  const t = useTranslations();

  return (
    <section className="flex w-full flex-col gap-4">
      <header className="flex items-end justify-between whitespace-nowrap">
        <div className="flex items-end gap-1">
          <h2 className="title-1 text-font-0">{title}</h2>
          {/* 개수는 서버가 센 총계입니다. 아직 못 받았으면 0건이라 단정하지 않고 비워 둡니다. */}
          {count !== undefined && (
            <span className="body-4 text-font-2">
              {t("categoriesPage.resultCount", { count })}
            </span>
          )}
        </div>

        <button
          type="button"
          className="body-4 text-font-2 transition-colors hover:text-font-1"
        >
          {t("characterShowcase.allView")}
        </button>
      </header>

      {children}
    </section>
  );
};

interface SearchResultsContentsProps {
  initialQuery: string;
}

const SearchResultsContents = ({
  initialQuery,
}: SearchResultsContentsProps) => {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocaleStore((state) => state.locale);
  const { addKeyword, keywords, removeKeyword, clearAll } = useRecentSearch();
  const [activeTab, setActiveTab] = useState<SearchTab>("all");
  const [queryDraft, setQueryDraft] = useState(initialQuery);

  // 검색어가 바뀔 때만 다시 부릅니다. 탭 전환은 받아 둔 결과를 거르기만 하므로
  // 같은 검색이 여러 번 집계되지 않습니다.
  const { data, isPending, isError, error, refetch } = useSearchQuery({
    q: initialQuery,
  });

  // 주소창에 직접 짧은 검색어를 넣고 들어올 수 있습니다. 그때는 요청이 나가지 않으므로
  // 로딩 스켈레톤에 갇히지 않도록 여기서 따로 안내합니다.
  const isTooShort = !isSearchableKeyword(initialQuery);

  const characters = data?.characters;
  const universes = data?.universes;
  const users = data?.users;
  const isEmpty =
    !!data &&
    characters!.page.totalElements === 0 &&
    universes!.page.totalElements === 0 &&
    users!.page.totalElements === 0;

  // 다른 검색어로 다시 진입했을 때(뒤로가기 등) 입력창도 함께 갱신합니다.
  useEffect(() => {
    setQueryDraft(initialQuery);
  }, [initialQuery]);

  const tabs: { key: SearchTab; label: string }[] = [
    { key: "all", label: t("searchResults.tabAll") },
    { key: "character", label: t("searchResults.tabCharacter") },
    { key: "world", label: t("searchResults.tabWorld") },
    { key: "user", label: t("searchResults.tabUser") },
  ];

  const showCharacters = activeTab === "all" || activeTab === "character";
  const showWorlds = activeTab === "all" || activeTab === "world";
  const showUsers = activeTab === "all" || activeTab === "user";

  const handleQuerySubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedQuery = queryDraft.trim();

    if (!trimmedQuery) {
      router.push("/search");
      return;
    }

    if (!isSearchableKeyword(trimmedQuery)) {
      showAppToast(
        "error",
        t("searchResults.minLength", { count: SEARCH_MIN_KEYWORD_LENGTH }),
      );
      return;
    }

    addKeyword(trimmedQuery);
    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    // 카드 6개(186.67px) + 간격 5개(16px) ≈ 1200px가 한 줄에 들어가도록
    // 좌우 패딩(px-9=72px)을 더한 폭으로 컨테이너를 잡습니다.
    <section className="mx-auto flex w-full max-w-[1272px] flex-col gap-6 pt-5">
      <PageTitle messageKey="pageTitles.search" />

      <SearchQueryBar
        queryDraft={queryDraft}
        onQueryDraftChange={setQueryDraft}
        onSubmit={handleQuerySubmit}
        keywords={keywords}
        onKeywordClick={setQueryDraft}
        onKeywordRemove={removeKeyword}
        onClearAll={clearAll}
      />

      <div className="flex items-center gap-1 border-b border-main">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex w-21 flex-col items-center justify-center border-b-2 border-transparent p-2.5",
              activeTab === tab.key && "border-brand",
            )}
          >
            <span
              className={cn(
                "body-4 transition-colors",
                activeTab === tab.key ? "text-font-1" : "text-font-2",
              )}
            >
              {tab.label}
            </span>
          </button>
        ))}

        {/* 카테고리는 검색 결과 내 중첩 렌더링 대신 이미지가 있는 카테고리 페이지로 이동 */}
        <button
          type="button"
          onClick={() => router.push("/?tab=categories")}
          className="flex w-21 flex-col items-center justify-center border-b-2 border-transparent p-2.5"
        >
          <span className="body-4 text-font-2">
            {t("searchResults.tabCategory")}
          </span>
        </button>
      </div>

      <div className="flex w-full flex-col gap-12 pb-20">
        <QueryStateBoundary
          isPending={false}
          isEmpty={isTooShort || isEmpty}
          emptyMessage={
            isTooShort
              ? t("searchResults.minLength", {
                  count: SEARCH_MIN_KEYWORD_LENGTH,
                })
              : t("searchResults.empty")
          }
          isError={isError}
          error={error}
          onRetry={() => refetch()}
        >
          {showCharacters && (
            <ResultSection
              title={t("searchResults.tabCharacter")}
              count={characters?.page.totalElements}
            >
              <CardGrid
                items={characters?.content ?? []}
                isLoading={isPending}
              />
            </ResultSection>
          )}

          {showWorlds && (
            <ResultSection
              title={t("searchResults.tabWorld")}
              count={universes?.page.totalElements}
            >
              <CardGrid items={universes?.content ?? []} isLoading={isPending} />
            </ResultSection>
          )}

          {showUsers && (
            <ResultSection
              title={t("searchResults.tabUser")}
              count={users?.page.totalElements}
            >
              <div className="flex flex-wrap gap-4">
                {(users?.content ?? []).map((user) => (
                  <UserResultCard
                    key={user.userId}
                    user={{
                      userId: user.userId,
                      nickname: user.nickname,
                      profileImageUrl: user.profileImageUrl,
                      followerCount: user.followerCount,
                      chatVolumeLabel: formatStatCount(user.chatCount, locale),
                      isFollowing: user.following,
                    }}
                  />
                ))}
              </div>
            </ResultSection>
          )}
        </QueryStateBoundary>
      </div>
    </section>
  );
};

export default SearchResultsContents;
