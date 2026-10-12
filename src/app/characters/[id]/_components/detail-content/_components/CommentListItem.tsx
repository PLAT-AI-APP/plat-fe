"use client";

import Image from "next/image";
import LikeHeart from "@/components/motion/LikeHeart";
import RollText from "@/components/motion/RollText";
import Link from "next/link";
import { m } from "framer-motion";
import { EASE_OUT } from "@/constants/motion";
import { LIST_ITEM_MOTION } from "@/components/motion/ListMotion";
import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { Message, Pin } from "@/icons";
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

/** 내가 방금 쓴 댓글로 보는 시간. 이 안에 처음 나타나면 자리가 열리며 들어온다. */
const FRESH_COMMENT_MS = 20_000;
/** 등장 연출을 이미 튼 댓글. 목록이 다시 그려져도 또 들어오지 않게 모듈에 둔다. */
const enteredCommentIds = new Set<string>();

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
  const replyButtonRef = useRef<HTMLButtonElement>(null);

  const { toggleLike, edit, remove, report, pin, unpin } = useCommentActions({
    comment,
    universeId,
    parentCommentId,
  });

  const isReply = Boolean(parentCommentId);
  const isMine = Boolean(myUserId && myUserId === comment.author.userId);
  // 방금 쓴 내 댓글이면 자리가 열리며 들어오고 배경이 잠깐 옅은 주황으로 빛난다(처음 그릴 때 한 번만 정한다)
  const [isFresh] = useState(() => {
    if (!isMine || enteredCommentIds.has(comment.commentId)) return false;
    const isRecent =
      Date.now() - new Date(comment.meta.createdAt).getTime() <
      FRESH_COMMENT_MS;
    if (isRecent) enteredCommentIds.add(comment.commentId);
    return isRecent;
  });
  // 높이를 여는 동안만 넘친 부분을 자른다. 끝나면 메뉴 팝오버가 잘리지 않게 푼다.
  const [isEntering, setIsEntering] = useState(isFresh);
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
    <m.li
      className={cn(
        "relative isolate flex flex-col gap-1.5",
        isEntering && "overflow-hidden",
      )}
      // 고정하면 위로 미끄러져 올라가고, 지우면 옆으로 밀려나며 접힌다(CommentsPanel 의 ListMotion)
      layout="position"
      initial={isFresh ? { height: 0, opacity: 0 } : false}
      animate={{ height: "auto", opacity: 1 }}
      exit={LIST_ITEM_MOTION.exit}
      transition={{
        layout: LIST_ITEM_MOTION.transition.layout,
        height: { duration: 0.35, ease: EASE_OUT },
        opacity: { duration: 0.3, delay: 0.1 },
        x: LIST_ITEM_MOTION.transition.default,
      }}
      onAnimationComplete={() => setIsEntering(false)}
    >
      {isFresh && (
        <m.span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 rounded-xl bg-brand-opacity"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 0.6, duration: 1.4 }}
        />
      )}
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
              <LikeHeart liked={comment.meta.liked} small />
              <RollText
                value={String(comment.meta.likeCount)}
                up={comment.meta.liked}
                perChar
              />
            </button>

            {!isReply && (
              <>
                <span className="body-7 flex items-center gap-1 text-font-2">
                  <Message className="size-4" />
                  {t("commentReplies", { count: comment.meta.replyCount })}
                </span>

                <button
                  ref={replyButtonRef}
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
              composerTriggerRef={replyButtonRef}
            />
          )}
        </article>
      </div>
    </m.li>
  );
};

export default CommentListItem;
