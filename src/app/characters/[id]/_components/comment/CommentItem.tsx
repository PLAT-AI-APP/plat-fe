"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import dayjs from "@/lib/dayjs";
import { cn } from "@/lib/utils";
import { CommentType } from "@/type/comment";
import { useLineOverflow } from "@/hooks/useOverflowText";
// import { CommentInput } from "./CommentInput";
import ReplyLine from "@/icons/ReplyLine";
// import PinFill from "@/icons/PinFill";
import { Dots } from "@/icons";
import CommentMenuPopover from "@/components/popover/CommentMenuPopover";
import useToggle from "@/hooks/useToggle";

interface Props {
  comment: CommentType;
}

const CommentItem = ({ comment }: Props) => {
  const t = useTranslations("characterDetail");
  const textRef = useRef<HTMLParagraphElement>(null);
  const triggerRef = useRef(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const { isOpen, toggle } = useToggle();
  // const [isCommentMenu, setIsCommentMenu] = useState(false);
  // const [isCommentInput, setIsCommentInput] = useState(false);
  // const [isReply, setIsReply] = useState(false);

  const isOverflown = useLineOverflow(textRef, 4, comment.content);

  // const toggleIsCommentInput = () => {
  //   setIsCommentInput(!isCommentInput);
  // };

  // const toggleIsReply = () => {
  //   setIsReply(!isReply);
  // };

  return (
    <article className="flex flex-col gap-3">
      {/* 댓글 메인 영역 */}
      <div className="flex gap-2 items-stretch" id="comment-main-layout">
        <aside className="flex flex-col items-center w-9 shrink-0">
          <Image
            src={comment.author.profileImage}
            alt={t("commentAuthorProfileAlt", { name: comment.author.name })}
            width={36}
            height={36}
            className="w-9 h-9 rounded-full shrink-0"
          />
          <ReplyLine />
        </aside>

        <section className="flex flex-col flex-1 h-fit">
          {/* {comment.isPinned && (
            <p className="flex gap-1 pb-1.5 text-font-2 text-[12px]">
              <PinFill className="w-3.5 h-3.5 fill-font-2" />
              크리에이터님이 고정함
            </p>
          )} */}

          <header className="flex justify-between pb-3">
            <div className="flex gap-3 items-center">
              <Link href={"/"} className={cn("title-6 hover:underline")}>
                {comment.author.name}
              </Link>
              <time className="body-6 text-font-2">
                {dayjs(comment.createdAt).fromNow()}
              </time>
            </div>

            <div className="relative cursor-pointer" ref={triggerRef}>
              <Dots onClick={toggle} className="w-6 h-6 p-1" />
              {isOpen && (
                <CommentMenuPopover
                  onClose={toggle}
                  triggerRef={triggerRef}
                  isMine
                  onDelete={() => null}
                  onEdit={() => null}
                  onReport={() => null}
                />
              )}
            </div>
          </header>

          <div className="flex flex-col h-fit" id="comment-text-container">
            <p
              ref={textRef}
              className={`transition-all body-4 ${
                !isExpanded ? "line-clamp-4" : ""
              } overflow-hidden whitespace-pre-wrap`}
            >
              {comment.content}
            </p>

            {isOverflown && !isExpanded && (
              <button
                onClick={() => setIsExpanded(true)}
                className="text-font-2 body-6 w-fit mt-1 hover:underline"
              >
                {t("viewMore")}
              </button>
            )}

            {/* <footer className="pt-3 flex gap-2.5 text-font-2 text-sm">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4 cursor-pointer" />
                {formatStatCount(3789)}
              </div>
              <div className="flex items-center gap-1">
                <ChatFill className="w-4 h-4" />
                {formatStatCount(39)}개
              </div>
              <button
                type="button"
                onClick={toggleIsCommentInput}
                className="relative text-font-1 hover:underline"
              >
                답글
              </button>
            </footer> */}
          </div>
        </section>
      </div>

      {/* 답글 입력창 영역 */}
      {/* {isCommentInput && (
        <CommentInput
          profileImage="/public/p1.png"
          formClassName="pl-9"
          isReplyMode
          toggleIsCommentInput={toggleIsCommentInput}
        />
      )} */}

      {/* 답글 리스트 영역 */}
      {/* {comment.replies && comment.replies.length > 0 && (
        <section className="flex flex-col gap-3" id="reply-list-area">
          {(isReply ? comment.replies : comment.replies.slice(0, 2)).map(
            (reply) => (
            ),
          )}

          {comment.replies.length > 2 && (
            <button
              onClick={toggleIsReply}
              type="button"
              className="w-fit pl-9 text-sm font-medium text-font-1 hover:underline"
            >
              {isReply ? "답글 접기" : "답글 더보기"}
            </button>
          )}
        </section>
      )} */}
    </article>
  );
};

export default CommentItem;
