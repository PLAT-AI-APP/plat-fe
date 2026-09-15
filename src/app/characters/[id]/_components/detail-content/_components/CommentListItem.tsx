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
import CommentComposer from "./CommentComposer";
import CommentExpandableBody from "./CommentExpandableBody";
import CommentMenuButton from "./CommentMenuButton";

const DEFAULT_PROFILE_IMAGE = "/p1.png";

interface CommentListItemProps {
  comment: Comment;
  universeId: string;
  /** 이 세계관의 제작자가 보고 있는지. 본인 댓글이 아니어도 자기 상세페이지의 댓글은 지울 수 있다. */
  isCreatorViewer?: boolean;
  /** 이 댓글의 작성자가 세계관 제작자 본인인지. 닉네임을 배지 형태로 다르게 보여준다. */
  isCommentByCreator?: boolean;
}

const CommentListItem = ({
  comment,
  universeId,
  isCreatorViewer,
  isCommentByCreator = false,
}: CommentListItemProps) => {
  const t = useTranslations("characterDetail");
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const myUserId = useUserStore((state) => state.user?.id);
  const openDialog = useDialogStore((state) => state.openDialog);
  const closeDialog = useDialogStore((state) => state.closeDialog);
  const openModal = useModalStore((state) => state.openModal);
  const getRelativeTime = useRelativeTimeLabel();

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const { mutate: like } = usePostCommentLikeMutation();
  const { mutate: unlike } = useDeleteCommentLikeMutation();
  const { mutate: patchComment, isPending: isPatching } =
    usePatchCommentMutation();
  const { mutate: deleteComment } = useDeleteCommentMutation();

  const scope = { universeId };
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
    <li className="flex gap-2">
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
            isCreatorViewer={isCreatorViewer}
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
        </footer>
      </article>
    </li>
  );
};

export default CommentListItem;
