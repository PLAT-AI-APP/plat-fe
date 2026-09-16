"use client";

import Image from "next/image";
import { useState } from "react";
import type { KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { resolveApiImageUrl } from "@/lib/file";
import { cn } from "@/lib/utils";
import { Heart, HeartFill } from "@/icons";
import type { Comment } from "@/type/comment";
import { useRelativeTimeLabel } from "@/hooks/i18n/useRelativeTimeLabel";
import { useAuthStore } from "@/store/useAuthStore";
import { useDialogStore } from "@/store/useDialogStore";
import { useModalStore } from "@/store/useModalStore";
import { useUserStore } from "@/store/useUserStore";
import { useTextareaSubmitShortcuts } from "@/hooks/form/useTextareaSubmitShortcuts";
import {
  useDeleteCommentLikeMutation,
  usePostCommentLikeMutation,
} from "@/api/comment/postCommentLike";
import { usePatchCommentMutation } from "@/api/comment/patchComment";
import { useDeleteCommentMutation } from "@/api/comment/deleteComment";
import { useCommentRepliesInfiniteQuery } from "@/api/comment/getCommentReplies";
import { usePostCommentReplyMutation } from "@/api/comment/postCommentReply";
import CommentComposer from "./CommentComposer";
import CommentExpandableBody from "./CommentExpandableBody";
import CommentMenuButton from "./CommentMenuButton";

const DEFAULT_PROFILE_IMAGE = "/p1.png";

interface CommentListItemProps {
  comment: Comment;
  universeId: string;
  /** 이 댓글의 작성자가 세계관 제작자 본인인지. 닉네임을 배지 형태로 다르게 보여준다. */
  isCommentByCreator?: boolean;
  /** 답글이면 부모 댓글 id. 루트 댓글이면 비웁니다. */
  parentCommentId?: string;
}

const CommentListItem = ({
  comment,
  universeId,
  isCommentByCreator = false,
  parentCommentId,
}: CommentListItemProps) => {
  const t = useTranslations("characterDetail");
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const myUserId = useUserStore((state) => state.user?.id);
  const openDialog = useDialogStore((state) => state.openDialog);
  const closeDialog = useDialogStore((state) => state.closeDialog);
  const openModal = useModalStore((state) => state.openModal);
  const getRelativeTime = useRelativeTimeLabel();
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

  const handleCancelEdit = () => {
    setEditedContent(comment.content);
    setIsEditing(false);
  };

  // 수정 중 Enter로 바로 등록되지 않도록, 취소(Esc)만 남기고 제출 단축키는 쓰지 않습니다.
  const { handleFocus: handleEditFocus } = useTextareaSubmitShortcuts({
    onSubmit: handleSubmitEdit,
    onCancel: handleCancelEdit,
  });

  const handleEditKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      handleCancelEdit();
    }
  };

  const handleSubmitReply = () => {
    const content = replyContent.trim();
    if (!content || isReplying) return;

    postReply(
      { commentId: comment.commentId, content, universeId },
      { onSuccess: () => setReplyContent("") },
    );
  };

  const handleDeleteComment = () => {
    openDialog("COMMENT_DELETE", {
      onConfirm: () => {
        deleteComment(
          { commentId: comment.commentId, ...scope },
          { onSettled: closeDialog },
        );
      },
    });
  };

  const handleReportComment = () => {
    openModal("COMMENT_REPORT", { commentId: comment.commentId });
  };

  return (
    <li className={cn("flex gap-2", isReply && "pl-11")}>
      <Image
        src={
          resolveApiImageUrl(comment.author.profileImageUrl) ||
          DEFAULT_PROFILE_IMAGE
        }
        alt={t("profileAlt", { name: comment.author.nickname })}
        width={36}
        height={36}
        className="size-9 shrink-0 rounded-full object-cover"
      />

      <article className="flex min-w-0 flex-1 flex-col gap-3">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                isCommentByCreator
                  ? "title-5 rounded-[4px] bg-font-1 px-1.5 py-0.5 text-dark"
                  : "title-6 text-font-1",
              )}
            >
              {comment.author.nickname}
            </span>
            <div className="flex items-center gap-1">
              <span className="body-7 text-font-2">
                {getRelativeTime(comment.meta.createdAt)}
              </span>
              {comment.meta.edited && (
                <span className="body-7 text-font-2">
                  {t("commentEdited")}
                </span>
              )}
            </div>
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
            onDelete={handleDeleteComment}
            onReport={handleReportComment}
          />
        </header>

        {isEditing ? (
          <CommentComposer
            autoFocus
            value={editedContent}
            onChange={setEditedContent}
            onKeyDown={handleEditKeyDown}
            onFocus={handleEditFocus}
            onSubmit={handleSubmitEdit}
            onCancel={handleCancelEdit}
            canSubmit={!isPatching && Boolean(editedContent.trim())}
            submitLabel={t("commentEditSave")}
            cancelLabel={t("commentEditCancel")}
          />
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
              <CommentComposer
                value={replyContent}
                onChange={setReplyContent}
                onSubmit={handleSubmitReply}
                canSubmit={!isReplying && Boolean(replyContent.trim())}
                placeholder={t("replyPlaceholder")}
                submitLabel={t("submitComment")}
              />
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
