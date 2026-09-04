"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRankingQuery } from "@/api/ranking/getRanking";
import QueryStateBoundary from "@/components/state/QueryStateBoundary";
import { CharacterCardSkeleton } from "../CharacterCardSkeleton";
import CharacterCard from "../character-card";
import NewCharacterHeader from "./_components/NewCharacterHeader";
import {
  RankingSortId,
  SORT_TO_API,
} from "../ranking-tab-contents/_components/rankingFilters";

const PAGE_SIZE = 24;

/** 신작도 결국 신작들 사이의 랭킹이라 랭킹 API 를 scope=NEW 로 부른다. 등락 표시는 없다. */
const NewTabContents = () => {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = (searchParams.get("sort") as RankingSortId) ?? "chats";

  const { data, isPending, isError, error, refetch } = useRankingQuery({
    period: "WEEKLY",
    sort: SORT_TO_API[sort] ?? "CHAT",
    scope: "NEW",
    size: PAGE_SIZE,
  });

  const handleSortChange = (next: RankingSortId) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", "new");
    params.set("sort", next);
    router.replace(`?${params.toString()}`, { scroll: false });
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
        emptyMessage={t("newPage.empty")}
        onRetry={refetch}
        pendingFallback={
          <div className="flex w-full flex-wrap gap-x-4 gap-y-7">
            {Array.from({ length: 8 }).map((_, index) => (
              <CharacterCardSkeleton key={`new-skeleton-${index}`} size="S" />
            ))}
          </div>
        }
      >
        <div className="flex w-full flex-wrap gap-x-4 gap-y-7">
          {items.map(({ card }) => (
            <CharacterCard
              key={card.universeId}
              size="S"
              title={card.title}
              description={card.description}
              creatorName={card.creator.nickname}
              chatCount={card.chatCount}
              images={card.images}
              isNew
              isOfficial={card.isOfficial}
            />
          ))}
        </div>
      </QueryStateBoundary>
    </article>
  );
};

export default NewTabContents;
