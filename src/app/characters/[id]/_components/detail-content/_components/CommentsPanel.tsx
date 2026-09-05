"use client";

import { useTranslations } from "next-intl";
import { useUniverseCommentsInfiniteQuery } from "@/api/comment/getUniverseComments";
import { InfiniteQueryBoundary } from "@/components/state";
import CommentInputBox from "./CommentInputBox";
import CommentListItem from "./CommentListItem";

interface CommentsPanelProps {
  universeId: string;
}

const CommentsPanel = ({ universeId }: CommentsPanelProps) => {
  const t = useTranslations("characterDetail");
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
    error,
    refetch,
  } = useUniverseCommentsInfiniteQuery(universeId);

  const comments = data?.pages.flatMap((page) => page.content) ?? [];
  // 총 개수는 첫 페이지의 페이지 정보에 실려 옵니다.
  const totalCount = data?.pages[0]?.page.totalElements ?? 0;

  return (
    <section className="flex flex-col gap-6">
      <h2 className="body-3 text-font-1">
        {t("commentsCount", { count: totalCount })}
      </h2>

      <CommentInputBox universeId={universeId} />

      {/*
        예전에는 실패해도 "아직 댓글이 없어요" 가 떴다. 서버가 죽은 것과
        아무도 쓰지 않은 것은 사용자에게 정반대의 사실인데 화면이 같았다.
      */}
      <InfiniteQueryBoundary
        isPending={isPending}
        isError={isError}
        error={error}
        hasItems={comments.length > 0}
        isEmpty={comments.length === 0}
        isFetchingNextPage={isFetchingNextPage}
        onRetry={refetch}
        onRetryNextPage={fetchNextPage}
        emptyFallback={<p className="body-5 text-font-2">{t("commentEmpty")}</p>}
      >
        <ul className="flex flex-col gap-5">
          {comments.map((comment) => (
            <CommentListItem
              key={comment.commentId}
              comment={comment}
              universeId={universeId}
            />
          ))}
        </ul>

        {hasNextPage && (
          <button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="body-5 mt-5 w-fit text-font-2 transition-colors hover:text-font-1"
          >
            {t("commentLoadMore")}
          </button>
        )}
      </InfiniteQueryBoundary>
    </section>
  );
};

export default CommentsPanel;
