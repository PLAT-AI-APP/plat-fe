"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCommentRepliesInfiniteQuery } from "@/api/comment/getCommentReplies";
import { usePostCommentReplyMutation } from "@/api/comment/postCommentReply";
import { useAuthStore } from "@/store/useAuthStore";
import type { Comment } from "@/type/comment";
import CommentComposer from "./CommentComposer";
import CommentListItem from "./CommentListItem";

/** 답글은 펼치지 않아도 이 개수까지는 바로 보여줍니다. */
const REPLIES_PREVIEW_COUNT = 2;

interface CommentReplyThreadProps {
  /** 답글이 달리는 최상위 댓글 */
  parentComment: Comment;
  universeId: string;
  creatorId?: string;
  isComposerOpen: boolean;
  /** 답글 등록에 성공해 입력창을 닫을 때 */
  onComposerClose: () => void;
}

/**
 * 최상위 댓글 아래의 답글 영역(답글 입력창 + 답글 목록 + 더보기).
 *
 * 답글에는 다시 답글을 달 수 없으므로 최상위 댓글에만 붙는다. 예전에는 CommentListItem 이
 * isReply 로 갈라 이 기능을 품고 있어서, 답글 하나하나도 답글 조회·등록 훅을 만들어 두었다.
 */
const CommentReplyThread = ({
  parentComment,
  universeId,
  creatorId,
  isComposerOpen,
  onComposerClose,
}: CommentReplyThreadProps) => {
  const t = useTranslations("characterDetail");
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [replyContent, setReplyContent] = useState("");
  // 답글은 열지 않아도 REPLIES_PREVIEW_COUNT개까지는 바로 보여주고, 더보기를 눌러야 전부 받아옵니다.
  const [showAllReplies, setShowAllReplies] = useState(false);

  const hasReplies = parentComment.meta.replyCount > 0;
  const { data, fetchNextPage, hasNextPage } = useCommentRepliesInfiniteQuery(
    parentComment.commentId,
    hasReplies,
  );
  const { mutate: postReply, isPending: isReplying } =
    usePostCommentReplyMutation();

  const replies = data?.pages.flatMap((page) => page.content) ?? [];
  const visibleReplies = showAllReplies
    ? replies
    : replies.slice(0, REPLIES_PREVIEW_COUNT);
  const hasMoreRepliesToShow =
    !showAllReplies && (replies.length > REPLIES_PREVIEW_COUNT || hasNextPage);
  // 입력창이 열린 채로 로그아웃되면 입력창은 거둔다.
  const showComposer = isComposerOpen && isLoggedIn;

  const handleShowMoreReplies = () => {
    setShowAllReplies(true);
    if (hasNextPage) fetchNextPage();
  };

  const handleSubmitReply = () => {
    const content = replyContent.trim();
    if (!content || isReplying) return;

    postReply(
      { commentId: parentComment.commentId, content, universeId },
      {
        // 등록한 답글은 바로 아래 목록에 보이므로 입력창은 닫는다. 실패하면 고쳐 보낼 수 있게 그대로 둔다.
        onSuccess: () => {
          setReplyContent("");
          onComposerClose();
        },
      },
    );
  };

  if (!showComposer && !hasReplies) return null;

  return (
    // article 의 gap-3(12px)에 4px 를 더해 댓글과 답글 사이를 16px 로 둔다.
    // 본문·푸터 사이(12px)까지 넓어지지 않도록 article 의 gap 자체는 건드리지 않는다.
    <div className="mt-1 flex flex-col gap-4">
      {showComposer && (
        <CommentComposer
          value={replyContent}
          onChange={setReplyContent}
          onSubmit={handleSubmitReply}
          canSubmit={!isReplying && Boolean(replyContent.trim())}
          placeholder={t("replyPlaceholder")}
          submitLabel={t("submitComment")}
        />
      )}

      {hasReplies && (
        <div className="flex flex-col gap-5">
          <ul className="flex flex-col gap-3">
            {visibleReplies.map((reply) => (
              <CommentListItem
                key={reply.commentId}
                comment={reply}
                universeId={universeId}
                creatorId={creatorId}
                parentCommentId={parentComment.commentId}
              />
            ))}
          </ul>

          {hasMoreRepliesToShow && (
            <button
              type="button"
              onClick={handleShowMoreReplies}
              className="body-7 w-fit text-font-2 transition-colors hover:text-font-1"
            >
              {t("commentRepliesShowMore")}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentReplyThread;
