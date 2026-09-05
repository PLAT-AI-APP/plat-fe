"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import dayjs from "@/lib/dayjs";
import { cn } from "@/lib/utils";
import { Heart, HeartFill } from "@/icons";
import type { Comment } from "@/type/comment";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { useCommentRepliesInfiniteQuery } from "@/api/comment/getCommentReplies";
import { usePostCommentReplyMutation } from "@/api/comment/postCommentReply";
import {
  useDeleteCommentLikeMutation,
  usePostCommentLikeMutation,
} from "@/api/comment/postCommentLike";
import { usePatchCommentMutation } from "@/api/comment/patchComment";
import { useDeleteCommentMutation } from "@/api/comment/deleteComment";
import CommentExpandableBody from "./CommentExpandableBody";
import CommentMenuButton from "./CommentMenuButton";

const COMMENT_MAX_LENGTH = 1000;
const DEFAULT_PROFILE_IMAGE = "/p1.png";

interface CommentListItemProps {
  comment: Comment;
  universeId: string;
  /** 답글이면 부모 댓글 id. 루트 댓글이면 비웁니다. */
  parentCommentId?: string;
}

const CommentListItem = ({
  comment,
  universeId,
  parentCommentId,
}: CommentListItemProps) => {
  const t = useTranslations("characterDetail");
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const myUserId = useUserStore((state) => state.user?.id);
  const isReply = Boolean(parentCommentId);

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const { data: repliesData, fetchNextPage, hasNextPage } =
    useCommentRepliesInfiniteQuery(comment.commentId, !isReply && isReplyOpen);
  const replies = repliesData?.pages.flatMap((page) => page.content) ?? [];

  const { mutate: like } = usePostCommentLikeMutation();
  const { mutate: unlike } = useDeleteCommentLikeMutation();
  const { mutate: patchComment, isPending: isPatching } =
    usePatchCommentMutation();
  const { mutate: deleteComment } = useDeleteCommentMutation();
  const { mutate: postReply, isPending: isReplying } =
    usePostCommentReplyMutation();

  const scope = { universeId, parentCommentId };
  const isMine = Boolean(myUserId && myUserId === comment.author.userId);

  const handleToggleLike = () => {
    if (!isLoggedIn) return;

    const variables = { commentId: comment.commentId, ...scope };
    if (comment.meta.liked) unlike(variables);
    else like(variables);
  };

  const handleSubmitEdit = () => {
    const content = editedContent.trim();
    if (!content || isPatching) return;

    patchComment(
      { commentId: comment.commentId, content, ...scope },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  const handleSubmitReply = () => {
    const content = replyContent.trim();
    if (!content || isReplying) return;

    postReply(
      { commentId: comment.commentId, content, universeId },
      { onSuccess: () => setReplyContent("") },
    );
  };

  return (
    <li className={cn("flex gap-2", isReply && "pl-11")}>
      <Image
        src={comment.author.profileImageUrl || DEFAULT_PROFILE_IMAGE}
        alt={t("profileAlt", { name: comment.author.nickname })}
        width={36}
        height={36}
        className="size-9 shrink-0 rounded-full object-cover"
      />

      <article className="flex min-w-0 flex-1 flex-col gap-3">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="title-6 text-font-1">
              {comment.author.nickname}
            </span>
            <span className="body-7 text-font-2">
              {dayjs(comment.meta.createdAt).format("YYYY-MM-DD")}
            </span>
            {comment.meta.edited && (
              <span className="body-7 text-font-2">{t("commentEdited")}</span>
            )}
            {comment.meta.pinned && (
              <span className="caption-2 rounded-md bg-brand-opacity px-2 py-1 text-brand">
                {t("commentPinned")}
              </span>
            )}
          </div>
          <CommentMenuButton
            isMine={isMine}
            onEdit={() => {
              setEditedContent(comment.content);
              setIsEditing(true);
            }}
            onDelete={() =>
              deleteComment({ commentId: comment.commentId, ...scope })
            }
          />
        </header>

        {isEditing ? (
          <div className="flex flex-col items-end gap-1 rounded-2xl bg-btn-hover px-3 py-2">
            <textarea
              value={editedContent}
              onChange={(event) => setEditedContent(event.target.value)}
              maxLength={COMMENT_MAX_LENGTH}
              className="body-5 min-h-9 w-full resize-none bg-transparent text-font-1 outline-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="body-5 rounded-xl px-4 py-1.5 text-font-2 transition-colors hover:text-font-1"
              >
                {t("commentEditCancel")}
              </button>
              <button
                type="button"
                onClick={handleSubmitEdit}
                disabled={isPatching || !editedContent.trim()}
                className="body-5 rounded-xl bg-main px-4 py-1.5 text-font-1 transition-colors hover:bg-btn-selected disabled:cursor-not-allowed disabled:text-font-disabled"
              >
                {t("commentEditSave")}
              </button>
            </div>
          </div>
        ) : (
          <CommentExpandableBody content={comment.content} />
        )}

        <footer className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleToggleLike}
            disabled={!isLoggedIn}
            aria-label={
              comment.meta.liked ? t("commentUnlike") : t("commentLike")
            }
            className="body-7 flex items-center gap-1 text-font-2 transition-colors hover:text-font-1 disabled:cursor-default"
          >
            {comment.meta.liked ? (
              <HeartFill className="size-4 text-brand" />
            ) : (
              <Heart className="size-4" />
            )}
            {comment.meta.likeCount}
          </button>

          {!isReply && (
            <button
              type="button"
              onClick={() => setIsReplyOpen((prev) => !prev)}
              className="body-7 text-font-2 transition-colors hover:text-font-1"
            >
              {isReplyOpen
                ? t("commentRepliesCollapse")
                : t("commentReplies", { count: comment.meta.replyCount })}
            </button>
          )}
        </footer>

        {!isReply && isReplyOpen && (
          <div className="flex flex-col gap-4">
            {isLoggedIn && (
              <div className="flex flex-col items-end gap-1 rounded-2xl bg-btn-hover px-3 py-2">
                <textarea
                  value={replyContent}
                  onChange={(event) => setReplyContent(event.target.value)}
                  maxLength={COMMENT_MAX_LENGTH}
                  placeholder={t("replyPlaceholder")}
                  className="body-5 min-h-9 w-full resize-none bg-transparent text-font-1 outline-none placeholder:text-font-disabled"
                />
                <button
                  type="button"
                  onClick={handleSubmitReply}
                  disabled={isReplying || !replyContent.trim()}
                  className="body-5 rounded-xl bg-main px-4 py-1.5 text-font-1 transition-colors hover:bg-btn-selected disabled:cursor-not-allowed disabled:text-font-disabled"
                >
                  {t("submitComment")}
                </button>
              </div>
            )}

            <ul className="flex flex-col gap-5">
              {replies.map((reply) => (
                <CommentListItem
                  key={reply.commentId}
                  comment={reply}
                  universeId={universeId}
                  parentCommentId={comment.commentId}
                />
              ))}
            </ul>

            {hasNextPage && (
              <button
                type="button"
                onClick={() => fetchNextPage()}
                className="body-7 w-fit text-font-2 transition-colors hover:text-font-1"
              >
                {t("commentLoadMore")}
              </button>
            )}
          </div>
        )}
      </article>
    </li>
  );
};

export default CommentListItem;
