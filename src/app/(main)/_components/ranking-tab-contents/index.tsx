"use client";

import { useSearchParams } from "next/navigation";
import { buildSearchHref, navigateShallow } from "@/lib/shallowUrl";
import { useTranslations } from "next-intl";
import { useRankingQuery } from "@/api/ranking/getRanking";
import { CharacterCardSkeleton } from "@/components/character/character-card/CharacterCardSkeleton";
import QueryStateBoundary from "@/components/state/QueryStateBoundary";
import CharacterCard from "@/components/character/character-card";
import CardGrid from "@/components/character/character-card/CardGrid";
import RankingHeader from "./_components/RankingHeader";
import {
  RankingSortId,
  SORT_TO_API,
  toPeriod,
} from "./_components/rankingFilters";

const PAGE_SIZE = 24;

const RankingTabContents = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();

  // 기간·정렬 둘 다 URL 에 둔다 — 새로고침해도, 링크를 넘겨도 같은 화면이 나와야 한다.
  const period = toPeriod(searchParams.get("period"));
  const sort = (searchParams.get("sort") as RankingSortId) ?? "chats";

  const { data, isPending, isPlaceholderData, isError, error, refetch } = useRankingQuery({
    period,
    sort: SORT_TO_API[sort] ?? "CHAT",
    scope: "ALL",
    size: PAGE_SIZE,
  });

  // 주소만 바꾼다(서버 렌더 왕복 없음). 화면은 useSearchParams 로 따라간다.
  const handleSortChange = (next: RankingSortId) => {
    navigateShallow(
      buildSearchHref({ tab: "ranking", sort: next }, searchParams.toString()),
      "replace",
    );
  };

  const items = data?.content ?? [];

  return (
    <article className="flex w-full flex-col gap-5 pt-5">
      <RankingHeader sort={sort} onSortChange={handleSortChange} />

      <QueryStateBoundary
        isPending={isPending}
        isError={isError}
        error={error}
        isEmpty={items.length === 0}
        emptyMood="peek"
        emptyMessage={t("rankingPage.empty")}
        onRetry={refetch}
        pendingFallback={
          <CardGrid size="S">
            {Array.from({ length: 8 }).map((_, index) => (
              <CharacterCardSkeleton
                key={`rank-skeleton-${index}`}
                size="S"
                fluid
              />
            ))}
          </CardGrid>
        }
      >
        <CardGrid size="S" isStale={isPlaceholderData}>
          {items.map(({ rank, card }) => (
            <CharacterCard
              key={card.universeId}
              size="S"
              fluid
              rank={rank}
              title={card.title}
              description={card.description}
              creatorName={card.creator.nickname}
              chatCount={card.chatCount}
              images={card.images}
              isNew={card.isNew}
              isOfficial={card.isOfficial}
              href={`/characters/${card.universeId}`}
            />
          ))}
        </CardGrid>
      </QueryStateBoundary>
    </article>
  );
};

export default RankingTabContents;
