"use client";

import { useTranslations } from "next-intl";
import { useUniverseCommentsInfiniteQuery } from "@/api/comment/getUniverseComments";
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
  } = useUniverseCommentsInfiniteQuery(universeId);

  const comments = data?.pages.flatMap((page) => page.content) ?? [];
  // 총 개수는 첫 페이지의 페이지 정보에 실려 옵니다.
  const totalCount = data?.pages[0]?.page.totalElements ?? 0;

  return (
    <section className="flex flex-col gap-6">
      <h2 className="body-2 text-font-1">
        {t("commentsCount", { count: totalCount })}
      </h2>

      <CommentInputBox universeId={universeId} />

      {comments.length === 0 ? (
        <p className="body-4 text-font-2">{t("commentEmpty")}</p>
      ) : (
        <ul className="flex flex-col gap-5">
          {comments.map((comment) => (
            <CommentListItem
              key={comment.commentId}
              comment={comment}
              universeId={universeId}
            />
          ))}
        </ul>
      )}

      {hasNextPage && (
        <button
          type="button"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="body-4 w-fit text-font-2 transition-colors hover:text-font-1"
        >
          {t("commentLoadMore")}
        </button>
      )}
    </section>
  );
};

export default CommentsPanel;
