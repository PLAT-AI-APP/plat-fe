import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dayjs from "@/lib/dayjs";
import { formatStatCount } from "@/lib/utils";
import { CommentType } from "@/type/comment";
import { useLineOverflow } from "@/hooks/useOverflowText";
import { ModalLayout } from "@/components/ModalLayout";
import { Dots, Edit, Flag, Heart, Message, Pin, Trash } from "@/icons";

interface MyPostItemProps {
  comment: CommentType;
  lineClamp?: number;
}

const MyPostItem = ({ comment, lineClamp = 4 }: MyPostItemProps) => {
  // 상태 및 참조 변수
  const textRef = useRef<HTMLParagraphElement>(null);
  const triggerRef = useRef(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isPostMenu, setIsPostMenu] = useState(false);

  // 로직 및 훅
  const isOverflown = useLineOverflow(textRef, lineClamp, comment.content);

  return (
    <article className="flex flex-col gap-3 p-5 border-b border-border-main">
      <div className="flex gap-2 items-start">
        <aside className="shrink-0">
          <Image
            src={comment.author.profileImage}
            alt={`${comment.author.name}님의 프로필 이미지`}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
        </aside>

        <section className="flex flex-col flex-1 min-w-0">
          <header className="flex justify-between pb-2">
            <div className="flex gap-3 font-medium items-center">
              <Link href={"/profile/1"} className="text-[13px] hover:underline">
                {comment.author.name}
              </Link>
              <time
                className="text-[12px] text-font-2"
                dateTime={comment.createdAt}
              >
                {dayjs(comment.createdAt).fromNow()}
              </time>
            </div>

            <div className="relative" ref={triggerRef}>
              <button
                type="button"
                onClick={() => setIsPostMenu(!isPostMenu)}
                className="cursor-pointer"
                aria-label="메뉴 열기"
              >
                <Dots className="w-5 h-5" />
              </button>

              {isPostMenu && (
                <ModalLayout
                  onClose={() => setIsPostMenu(false)}
                  triggerRef={triggerRef}
                >
                  <menu className="flex flex-col gap-1">
                    <button className="whitespace-nowrap flex gap-2 p-1.5 text-sm font-medium hover:bg-btn-hover rounded-lg">
                      <Flag className="w-5 h-5" /> 신고
                    </button>
                    <button className="whitespace-nowrap flex gap-2 p-1.5 text-sm font-medium hover:bg-btn-hover rounded-lg">
                      <Edit className="w-5 h-5" /> 수정
                    </button>
                    <button className="whitespace-nowrap text-font-accents flex gap-2 p-1.5 text-sm font-medium hover:bg-btn-hover rounded-lg">
                      <Trash className="w-5 h-5" /> 삭제
                    </button>
                  </menu>
                </ModalLayout>
              )}
            </div>
          </header>

          <div
            id="comment-content-wrapper"
            className="flex flex-col text-sm font-medium"
          >
            <p
              ref={textRef}
              style={{
                display: "-webkit-box",
                WebkitLineClamp: !isExpanded ? lineClamp : "unset",
                WebkitBoxOrient: "vertical",
              }}
              className="transition-all font-normal overflow-hidden whitespace-pre-wrap text-font-1"
            >
              {comment.content}
            </p>

            {isOverflown && !isExpanded && (
              <button
                onClick={() => setIsExpanded(true)}
                className="text-font-2 text-xs w-fit mt-1.5 hover:underline font-medium"
              >
                더보기
              </button>
            )}

            <footer className="pt-4 flex gap-2 text-xs text-white">
              <div className="flex px-1.5 py-1 items-center gap-1 cursor-pointer">
                <Heart className="w-4 h-4" />
                <span>{formatStatCount(comment.likes || 0)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Message className="w-4 h-4" />
                <span>{formatStatCount(comment.replies?.length || 0)}</span>
              </div>
            </footer>
          </div>
        </section>
      </div>
    </article>
  );
};

export default MyPostItem;
