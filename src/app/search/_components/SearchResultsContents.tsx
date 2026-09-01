"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import CharacterCard from "@/app/(main)/_components/character-card";
import { useRecentSearch } from "@/hooks/useRecentSearch";
import { cn } from "@/lib/utils";
import {
  DUMMY_SEARCH_CHARACTERS,
  DUMMY_SEARCH_USERS,
  DUMMY_SEARCH_WORLDS,
} from "./dummyData";
import SearchQueryBar from "./SearchQueryBar";
import UserResultCard from "./UserResultCard";
import PageTitle from "@/components/PageTitle";

type SearchTab = "all" | "character" | "world" | "user";

interface ResultSectionProps {
  title: string;
  count: number;
  children: React.ReactNode;
}

const ResultSection = ({ title, count, children }: ResultSectionProps) => {
  const t = useTranslations();

  return (
    <section className="flex w-full flex-col gap-4">
      <header className="flex items-end justify-between whitespace-nowrap">
        <div className="flex items-end gap-1">
          <h2 className="title-1 text-font-0">{title}</h2>
          <span className="body-4 text-font-2">
            {t("categoriesPage.resultCount", { count })}
          </span>
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
  const { addKeyword, keywords, removeKeyword, clearAll } = useRecentSearch();
  const [activeTab, setActiveTab] = useState<SearchTab>("all");
  const [queryDraft, setQueryDraft] = useState(initialQuery);

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
        {showCharacters && (
          <ResultSection
            title={t("searchResults.tabCharacter")}
            count={DUMMY_SEARCH_CHARACTERS.length}
          >
            <div className="flex flex-wrap gap-x-4 gap-y-7">
              {DUMMY_SEARCH_CHARACTERS.map((character) => (
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
          </ResultSection>
        )}

        {showWorlds && (
          <ResultSection
            title={t("searchResults.tabWorld")}
            count={DUMMY_SEARCH_WORLDS.length}
          >
            <div className="flex flex-wrap gap-x-4 gap-y-7">
              {DUMMY_SEARCH_WORLDS.map((world) => (
                <CharacterCard
                  key={world.id}
                  size="S"
                  title={world.title}
                  description={world.description}
                  creatorName={world.creatorName}
                  chatCount={world.chatCount}
                  images={world.image}
                  isNew={world.isNew}
                  isOfficial={world.isOfficial}
                />
              ))}
            </div>
          </ResultSection>
        )}

        {showUsers && (
          <ResultSection
            title={t("searchResults.tabUser")}
            count={DUMMY_SEARCH_USERS.length}
          >
            <div className="flex flex-wrap gap-4">
              {DUMMY_SEARCH_USERS.map((user) => (
                <UserResultCard key={user.userId} user={user} />
              ))}
            </div>
          </ResultSection>
        )}
      </div>
    </section>
  );
};

export default SearchResultsContents;
