"use client";

import { useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();
  const searchParams = useSearchParams();

  // 기간·정렬 둘 다 URL 에 둔다 — 새로고침해도, 링크를 넘겨도 같은 화면이 나와야 한다.
  const period = toPeriod(searchParams.get("period"));
  const sort = (searchParams.get("sort") as RankingSortId) ?? "chats";

  const { data, isPending, isError, error, refetch } = useRankingQuery({
    period,
    sort: SORT_TO_API[sort] ?? "CHAT",
    scope: "ALL",
    size: PAGE_SIZE,
  });

  const handleSortChange = (next: RankingSortId) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", "ranking");
    params.set("sort", next);
    router.replace(`?${params.toString()}`, { scroll: false });
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
        <CardGrid size="S">
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
            />
          ))}
        </CardGrid>
      </QueryStateBoundary>
    </article>
  );
};

export default RankingTabContents;
