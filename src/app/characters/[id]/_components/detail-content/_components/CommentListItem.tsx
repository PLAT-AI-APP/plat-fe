"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { Heart, HeartFill, Message, Pin } from "@/icons";
import { resolveApiImageUrl } from "@/lib/file";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/useUserStore";
import { useCommentActions } from "@/hooks/comment/useCommentActions";
import { useRequireLogin } from "@/hooks/common/useRequireLogin";
import { useTextareaSubmitShortcuts } from "@/hooks/form/useTextareaSubmitShortcuts";
import { useRelativeTimeLabel } from "@/hooks/i18n/useRelativeTimeLabel";
import type { Comment } from "@/type/comment";
import CommentComposer from "./CommentComposer";
import CommentExpandableBody from "./CommentExpandableBody";
import CommentMenuButton from "./CommentMenuButton";
import CommentReplyThread from "./CommentReplyThread";

const DEFAULT_PROFILE_IMAGE = "/p1.png";

interface CommentListItemProps {
  comment: Comment;
  universeId: string;
  /** 이 세계관의 제작자 id. 제작자 닉네임 배지와 댓글 고정 권한 판단에 씁니다. */
  creatorId?: string;
  /** 답글이면 부모 댓글 id. 루트 댓글이면 비웁니다. */
  parentCommentId?: string;
}

/**
 * 댓글(또는 답글) 한 줄. 작성자·본문·좋아요·메뉴를 그린다.
 *
 * 동작은 useCommentActions 가, 답글 영역은 CommentReplyThread 가 맡고 여기서는 화면만 조합한다.
 */
const CommentListItem = ({
  comment,
  universeId,
  creatorId,
  parentCommentId,
}: CommentListItemProps) => {
  const t = useTranslations("characterDetail");
  const myUserId = useUserStore((state) => state.user?.id);
  const getRelativeTime = useRelativeTimeLabel();
  const requireLogin = useRequireLogin();
  const [isReplyComposerOpen, setIsReplyComposerOpen] = useState(false);

  const { toggleLike, edit, remove, report, pin, unpin } = useCommentActions({
    comment,
    universeId,
    parentCommentId,
  });

  const isReply = Boolean(parentCommentId);
  const isMine = Boolean(myUserId && myUserId === comment.author.userId);
  // 배지 여부를 부모가 계산해 넘기면 답글처럼 한 단계 건너 그릴 때 빠뜨리기 쉽다. 각 줄이 직접 판단한다.
  const isByCreator = Boolean(creatorId) && comment.author.userId === creatorId;
  // 답글은 백엔드 규칙상 고정할 수 없어, 루트 댓글일 때만 제작자에게 고정 메뉴를 보여준다.
  const canManagePin = Boolean(
    myUserId && creatorId && myUserId === creatorId && !isReply,
  );

  // 입력창에 들어가면 기존 내용을 전체 선택해 바로 고쳐 쓰기 쉽게 한다.
  // 수정 중에는 Enter 로 바로 등록되지 않도록 제출 단축키(handleKeyDown)는 쓰지 않는다.
  const { handleFocus: handleEditFocus } = useTextareaSubmitShortcuts({
    onSubmit: edit.submit,
  });

  const handleEditKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      edit.cancel();
    }
  };

  const handleToggleReplyComposer = () => {
    if (!requireLogin()) return;

    setIsReplyComposerOpen((prev) => !prev);
  };

  const handleCloseReplyComposer = () => {
    setIsReplyComposerOpen(false);
  };

  return (
    <li className="flex flex-col gap-1.5">
      {comment.meta.pinned && (
        <div className="flex items-center gap-1">
          <Pin className="size-3.5 text-font-2" />
          <span className="body-7 tracking-[-0.3px] text-font-2">
            {t("commentPinned")}
          </span>
        </div>
      )}

      <div className="flex gap-2">
        <Link href={`/profile/${comment.author.userId}`} className="shrink-0">
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
        </Link>

        <article className="flex min-w-0 flex-1 flex-col gap-3">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href={`/profile/${comment.author.userId}`}
                className={cn(
                  "hover:underline",
                  isByCreator
                    ? "title-5 rounded-[4px] bg-font-1 px-1.5 py-0.5 text-dark"
                    : "title-6 text-font-1",
                )}
              >
                {comment.author.nickname}
              </Link>
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
            </div>
            <CommentMenuButton
              isMine={isMine}
              canPin={canManagePin}
              isPinned={comment.meta.pinned}
              onEdit={edit.start}
              onDelete={remove}
              onReport={report}
              onPin={pin}
              onUnpin={unpin}
            />
          </header>

          {edit.isEditing ? (
            <CommentComposer
              autoFocus
              value={edit.content}
              onChange={edit.setContent}
              onKeyDown={handleEditKeyDown}
              onFocus={handleEditFocus}
              onSubmit={edit.submit}
              onCancel={edit.cancel}
              canSubmit={edit.canSubmit}
              submitLabel={t("commentEditSave")}
              cancelLabel={t("commentEditCancel")}
            />
          ) : (
            <CommentExpandableBody content={comment.content} />
          )}

          <footer className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleLike}
              aria-label={
                comment.meta.liked ? t("commentUnlike") : t("commentLike")
              }
              className="body-7 flex items-center gap-1 text-font-2 transition-colors hover:text-font-1"
            >
              {comment.meta.liked ? (
                <HeartFill className="size-4 text-brand" />
              ) : (
                <Heart className="size-4" />
              )}
              {comment.meta.likeCount}
            </button>

            {!isReply && (
              <>
                <span className="body-7 flex items-center gap-1 text-font-2">
                  <Message className="size-4" />
                  {t("commentReplies", { count: comment.meta.replyCount })}
                </span>

                <button
                  type="button"
                  onClick={handleToggleReplyComposer}
                  className="body-7 text-font-2 transition-colors hover:text-font-1"
                >
                  {t("commentReply")}
                </button>
              </>
            )}
          </footer>

          {/* 답글에는 다시 답글을 달 수 없어 최상위 댓글에만 붙인다. */}
          {!isReply && (
            <CommentReplyThread
              parentComment={comment}
              universeId={universeId}
              creatorId={creatorId}
              isComposerOpen={isReplyComposerOpen}
              onComposerClose={handleCloseReplyComposer}
            />
          )}
        </article>
      </div>
    </li>
  );
};

export default CommentListItem;
