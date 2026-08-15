"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import CharacterCard from "@/app/(main)/_components/character-card";
import { useRecentSearch } from "@/hooks/useRecentSearch";
import { Close, CloseLine, Search } from "@/icons";
import { cn } from "@/lib/utils";
import {
  DUMMY_SEARCH_CHARACTERS,
  DUMMY_SEARCH_USERS,
  DUMMY_SEARCH_WORLDS,
} from "./dummyData";
import UserResultCard from "./UserResultCard";

type SearchTab = "all" | "character" | "world" | "user";

interface ResultSectionProps {
  title: string;
  count: number;
  children: React.ReactNode;
}

const ResultSection = ({ title, count, children }: ResultSectionProps) => {
  const t = useTranslations();

  return (
    <section className="flex w-full flex-col gap-4.5">
      <header className="flex items-end justify-between whitespace-nowrap">
        <div className="flex items-end gap-1">
          <h2 className="title-1 text-white">{title}</h2>
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
    if (!trimmedQuery) return;

    addKeyword(trimmedQuery);
    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    // 카드 6개(186.67px) + 간격 5개(16px) ≈ 1200px가 한 줄에 들어가도록
    // 좌우 패딩(px-9=72px)을 더한 폭으로 컨테이너를 잡습니다.
    <section className="mx-auto flex w-full max-w-[1280px] flex-col gap-6.5 px-9 pt-5">
      <div className="flex flex-col gap-2.5">
        <form
          onSubmit={handleQuerySubmit}
          className="flex items-center justify-between rounded-2xl border border-main bg-darkest px-4 py-3"
        >
          <div className="flex flex-1 items-center gap-3">
            <Search className="size-7 shrink-0 text-font-disabled" />
            <span className="text-lg text-font-disabled">|</span>
            <input
              value={queryDraft}
              onChange={(event) => setQueryDraft(event.target.value)}
              placeholder={t("searchBar.placeholder")}
              aria-label={t("searchBar.placeholder")}
              className="body-2 w-full bg-transparent text-font-1 outline-none placeholder:text-font-disabled"
            />
          </div>

          <button
            type="button"
            aria-label={t("searchResults.close")}
            onClick={() => setQueryDraft("")}
            className="flex size-7 shrink-0 items-center justify-center opacity-24 transition-opacity hover:opacity-60"
          >
            <Close className="size-4 text-font-2" />
          </button>
        </form>

        {keywords.length > 0 && (
          <div className="flex items-center justify-between px-0.5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="body-4 text-font-2">
                {t("searchBar.recentTitle")}
              </span>
              <span className="body-4 text-font-disabled">|</span>

              <ul className="flex flex-wrap items-center gap-2">
                {keywords.map((keyword) => (
                  <li
                    key={keyword}
                    onClick={() => setQueryDraft(keyword)}
                    className="body-4 flex cursor-pointer items-center gap-1 rounded-lg bg-card py-2 pl-3 pr-2 text-font-2"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        removeKeyword(keyword);
                      }}
                      className="flex size-[18px] items-center justify-center"
                    >
                      <CloseLine className="size-[18px] text-font-2" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={clearAll}
              className="body-4 text-font-disabled underline decoration-from-font hover:text-font-2"
            >
              {t("searchBar.clearAll")}
            </button>
          </div>
        )}
      </div>

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
                "title-3",
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
          <span className="title-3 text-font-2">
            {t("searchResults.tabCategory")}
          </span>
        </button>
      </div>

      <div className="flex w-full flex-col gap-18 pb-20">
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
