import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChatFill, Dots, Edit, Flag, Heart, Pin, Trash } from "@/icons";
import { CommentType } from "@/type/comment";
import { formatStatCount } from "@/lib/utils";
import { ModalLayout } from "@/components/ModalLayout";
import { useLineOverflow } from "@/hooks/useOverflowText";
import ReplyLine from "@/icons/ReplyLine";
import dayjs from "@/lib/dayjs";

const ReplyItem = ({ reply }: { reply: CommentType }) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // 훅을 사용해 4줄(line-clamp-4 기준)이 넘었는지 감지
  const isOverflown = useLineOverflow(textRef, 4, reply.content);

  const triggerRef = useRef(null);

  const [isCommentMenu, setIsCommentMenu] = useState(false);
  return (
    <article className="flex gap-2 pl-9 items-stretch">
      <div
        className="flex flex-col items-center w-9 shrink-0"
        id="reply-author-aside"
      >
        <Image
          src={reply.author.profileImage}
          alt={`${reply.author.name}님의 프로필 이미지`}
          width={36}
          height={36}
          className="w-9 h-9 rounded-full shrink-0"
        />

        <ReplyLine />
      </div>
      <div className="flex flex-col flex-1 h-fit" id="reply-content-body">
        <header className="flex justify-between pb-3">
          <div className="flex gap-3 font-medium items-center">
            <Link href={"/"} className="text-sm hover:underline">
              {reply.author.name}
            </Link>
            <time className="text-[12px] text-font-2">
              {dayjs(reply.createdAt).fromNow()}
            </time>
          </div>
          <div className="relative cursor-pointer" ref={triggerRef}>
            <Dots
              onClick={() => setIsCommentMenu(!isCommentMenu)}
              className="w-6 h-6 p-1"
            />
            {isCommentMenu && (
              <ModalLayout
                onClose={() => setIsCommentMenu(!isCommentMenu)}
                triggerRef={triggerRef}
              >
                <menu className="flex flex-col gap-1">
                  <button className="whitespace-nowrap flex gap-2 p-1.5 text-sm font-medium hover:bg-btn-hover rounded-lg">
                    <Flag className="w-5 h-5" />
                    신고
                  </button>
                  <button className="whitespace-nowrap flex gap-2 p-1.5 text-sm font-medium hover:bg-btn-hover rounded-lg">
                    <Pin className="w-5 h-5" />
                    댓글 고정
                  </button>
                  <button className="whitespace-nowrap flex gap-2 p-1.5 text-sm font-medium hover:bg-btn-hover rounded-lg">
                    <Edit className="w-5 h-5" />
                    수정
                  </button>
                  <button className="whitespace-nowrap text-font-accents flex gap-2 p-1.5 text-sm font-medium hover:bg-btn-hover rounded-lg">
                    <Trash className="w-5 h-5 " />
                    삭제
                  </button>
                </menu>
              </ModalLayout>
            )}
          </div>
        </header>

        <div className="flex flex-col h-fit text-sm font-medium">
          <p
            ref={textRef}
            className={`transition-all ${
              !isExpanded ? "line-clamp-4" : ""
            } overflow-hidden whitespace-pre-wrap`}
          >
            {reply.content}
          </p>

          {isOverflown && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-font-2 w-fit mt-1 hover:underline"
            >
              자세히 보기
            </button>
          )}

          <footer className="pt-3 flex gap-2.5 text-font-2 text-sm">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {formatStatCount(3789)}
            </div>
            <div className="flex items-center gap-1">
              <ChatFill className="w-4 h-4" />
              {formatStatCount(39)}개
            </div>
            {/* <button className="relative text-font-1">답글</button> */}
          </footer>
        </div>
      </div>
    </article>
  );
};

export default ReplyItem;
