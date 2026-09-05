"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  CategorySort,
  useCategorySearchQuery,
} from "@/api/search/getCategorySearch";
import Tag from "@/icons/Tag";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { TABLET_MAX_WIDTH_QUERY } from "@/constants/layout";
import CharacterCard from "@/components/character/character-card";
import CardGrid from "@/components/character/character-card/CardGrid";
import { CharacterCardSkeleton } from "@/components/character/character-card/CharacterCardSkeleton";
import QueryStateBoundary from "@/components/state/QueryStateBoundary";
import SearchResultSort from "./_components/SearchResultSort";
import TagSidebar from "./_components/tag-sidebar";
import CharacterCreatePrompt from "./_components/CharacterCreatePrompt";

const PAGE_SIZE = 24;

const CategoriesTabContents = () => {
  const t = useTranslations("categoriesPage");
  // 고른 태그는 서버가 받는 id 로 들고 다닙니다 — 라벨은 언어에 따라 바뀝니다.
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [sort, setSort] = useState<CategorySort>("CHAT");
  const [isHydrated, setIsHydrated] = useState(false);
  // 태블릿 폭에서는 300px 고정폭 사이드바가 카드 그리드를 압박하므로 인라인
  // 배치 대신 토글로 열고 닫는 오버레이 패널로 전환합니다.
  const isTablet = useMediaQuery(TABLET_MAX_WIDTH_QUERY);
  const [isTagSidebarOpen, setIsTagSidebarOpen] = useState(false);

  // 고른 태그를 전부 가진 세계관만 내려옵니다. 태그를 하나도 안 고르면 전체가 내려옵니다.
  const { data, isPending, isError, error, refetch } = useCategorySearchQuery({
    tagIds: selectedTagIds,
    sort,
    size: PAGE_SIZE,
  });

  const items = data?.content ?? [];
  const totalCount = data?.page.totalElements ?? 0;

  useEffect(() => {
    // 포털 렌더링은 hydration 이후로 미뤄 서버/클라이언트 초기 HTML을 맞춥니다.
    const frameId = requestAnimationFrame(() => setIsHydrated(true));

    return () => cancelAnimationFrame(frameId);
  }, []);

  const sidebarRoot = isHydrated
    ? document.getElementById("categories-tag-sidebar-root")
    : null;

  return (
    <>
      <article className="flex flex-col gap-12 w-full mt-6 bg-darker">
        {/* 검색결과 */}
        <div className="flex-1 flex flex-col gap-7 justify-start">
          {/* 제목 + 태그 버튼 + 정렬 4개가 한 줄이라, 좁은 화면에서는 제목이
              "검 / 색 / 결 / 과" 로 한 글자씩 쪼개지고 정렬은 화면 밖으로 나갔다. */}
          <header className="heading-3R flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="shrink-0">
              {t("searchResults")}{" "}
              <span className="heading-3">
                {t("resultCount", { count: totalCount })}
              </span>
            </p>

            <div className="flex w-full min-w-0 items-center gap-3 sm:w-auto">
              {isTablet && (
                <button
                  type="button"
                  onClick={() => setIsTagSidebarOpen(true)}
                  className="body-5 flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-main px-3 py-2 text-font-1 transition-colors hover:bg-btn-hover"
                >
                  <Tag className="size-4 shrink-0" />
                  {t("tagFilter")}
                </button>
              )}
              <SearchResultSort value={sort} onChange={setSort} />
            </div>
          </header>

          <QueryStateBoundary
            isPending={isPending}
            isError={isError}
            error={error}
            isEmpty={items.length === 0}
            emptyMessage={t("empty")}
            onRetry={refetch}
            pendingFallback={
              <CardGrid size="S">
                {Array.from({ length: 8 }).map((_, index) => (
                  <CharacterCardSkeleton
                    key={`category-skeleton-${index}`}
                    size="S"
                    fluid
                  />
                ))}
              </CardGrid>
            }
          >
            <CardGrid size="S">
              {items.map((card) => (
                <CharacterCard
                  key={card.universeId}
                  size="S"
                  fluid
                  title={card.title}
                  description={card.description}
                  creatorName={card.creator.nickname}
                  chatCount={card.chatCount}
                  images={card.images}
                  isNew={card.isNew}
                  isOfficial={card.isOfficial}
                />
              ))}
            </CardGrid>
          </QueryStateBoundary>
        </div>

        <CharacterCreatePrompt />
      </article>

      {sidebarRoot &&
        createPortal(
          <TagSidebar
            selectedTagIds={selectedTagIds}
            onSelectedTagIdsChange={setSelectedTagIds}
            isOverlay={isTablet}
            isOpen={isTagSidebarOpen}
            onClose={() => setIsTagSidebarOpen(false)}
          />,
          sidebarRoot,
        )}
    </>
  );
};

export default CategoriesTabContents;
