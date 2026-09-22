"use client";

import { useSearchParams } from "next/navigation";
import { buildSearchHref, navigateShallow } from "@/lib/shallowUrl";
import { useTranslations } from "next-intl";
import { useRankingQuery } from "@/api/ranking/getRanking";
import QueryStateBoundary from "@/components/state/QueryStateBoundary";
import { CharacterCardSkeleton } from "@/components/character/character-card/CharacterCardSkeleton";
import CharacterCard from "@/components/character/character-card";
import CardGrid from "@/components/character/character-card/CardGrid";
import NewCharacterHeader from "./_components/NewCharacterHeader";
import {
  RankingSortId,
  SORT_TO_API,
} from "../ranking-tab-contents/_components/rankingFilters";

const PAGE_SIZE = 24;

/** 신작도 결국 신작들 사이의 랭킹이라 랭킹 API 를 scope=NEW 로 부른다. 등락 표시는 없다. */
const NewTabContents = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const sort = (searchParams.get("sort") as RankingSortId) ?? "chats";

  const { data, isPending, isPlaceholderData, isError, error, refetch } = useRankingQuery({
    period: "WEEKLY",
    sort: SORT_TO_API[sort] ?? "CHAT",
    scope: "NEW",
    size: PAGE_SIZE,
  });

  // 주소만 바꾼다(서버 렌더 왕복 없음). 화면은 useSearchParams 로 따라간다.
  const handleSortChange = (next: RankingSortId) => {
    navigateShallow(
      buildSearchHref({ tab: "new", sort: next }, searchParams.toString()),
      "replace",
    );
  };

  const items = data?.content ?? [];

  return (
    <article className="flex w-full flex-col gap-5 pt-5">
      <NewCharacterHeader sort={sort} onSortChange={handleSortChange} />

      <QueryStateBoundary
        isPending={isPending}
        isError={isError}
        error={error}
        isEmpty={items.length === 0}
        emptyMood="peek"
        emptyMessage={t("newPage.empty")}
        onRetry={refetch}
        pendingFallback={
          <CardGrid size="S">
            {Array.from({ length: 8 }).map((_, index) => (
              <CharacterCardSkeleton
                key={`new-skeleton-${index}`}
                size="S"
                fluid
              />
            ))}
          </CardGrid>
        }
      >
        <CardGrid size="S" isStale={isPlaceholderData}>
          {items.map(({ card }) => (
            <CharacterCard
              key={card.universeId}
              size="S"
              fluid
              title={card.title}
              description={card.description}
              creatorName={card.creator.nickname}
              chatCount={card.chatCount}
              images={card.images}
              isNew
              isOfficial={card.isOfficial}
              href={`/characters/${card.universeId}`}
            />
          ))}
        </CardGrid>
      </QueryStateBoundary>
    </article>
  );
};

export default NewTabContents;
