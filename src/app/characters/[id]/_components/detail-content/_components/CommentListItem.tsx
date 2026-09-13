"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import dayjs from "@/lib/dayjs";
import { resolveApiImageUrl } from "@/lib/file";
import { Heart, HeartFill } from "@/icons";
import type { Comment } from "@/type/comment";
import { useAuthStore } from "@/store/useAuthStore";
import { useDialogStore } from "@/store/useDialogStore";
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
}

const CommentListItem = ({ comment, universeId }: CommentListItemProps) => {
  const t = useTranslations("characterDetail");
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const myUserId = useUserStore((state) => state.user?.id);
  const openDialog = useDialogStore((state) => state.openDialog);
  const closeDialog = useDialogStore((state) => state.closeDialog);

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

  const { handleKeyDown: handleEditKeyDown, handleFocus: handleEditFocus } =
    useTextareaSubmitShortcuts({
      onSubmit: handleSubmitEdit,
      onCancel: handleCancelEdit,
    });

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
            onDelete={handleDeleteComment}
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
