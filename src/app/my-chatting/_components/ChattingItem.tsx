"use client";

import { Dots, Message, Pin, User } from "@/icons";
import React, { useRef } from "react";
import dayjs from "@/lib/dayjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MyChattingMenuPopover from "@/components/popover/MyChattingMenuPopover";
import useToggle from "@/hooks/useToggle";

interface ChattingItemProps {
  chatCount: number;
  creator: string;
  description: string;
  id: string;
  isPinned?: boolean;
  thumbnail: string;
  title: string;
  updatedAt: string;
}

const ChattingItem = ({
  chatCount,
  creator,
  description,
  id,
  isPinned = false,
  thumbnail,
  title,
  updatedAt,
}: ChattingItemProps) => {
  const router = useRouter();

  const { close, isOpen, toggle } = useToggle();
  const triggerRef = useRef<HTMLSpanElement>(null);

  // 채팅방 상세 화면 이동
  const chattingItemOnClick = () => {
    router.push(`/chatting-room`);
  };

  return (
    <li
      onClick={chattingItemOnClick}
      data-chat-id={id}
      className="flex cursor-pointer gap-3 rounded-lg px-4 py-3 transition-colors duration-200 hover:bg-btn-hover"
    >
      <Image
        src={thumbnail}
        width={84}
        height={84}
        alt=""
        className="size-[84px] shrink-0 rounded-2xl bg-[#d9d9d9] object-cover"
      />

      <article
        id="chat-item-content"
        className="flex min-w-0 flex-1 items-center"
      >
        <div className="flex h-full min-w-0 flex-1 flex-col gap-3">
          <div className="flex min-h-0 flex-1 items-start justify-between gap-3">
            <div className="flex h-full min-w-0 flex-1 flex-col gap-1.5 overflow-hidden">
              <div className="flex items-center gap-1.5">
                <h3 className="title-3 truncate text-font-1">{title}</h3>
                {isPinned && (
                  <Pin className="size-4 shrink-0 text-font-2" aria-hidden />
                )}
              </div>

              <p className="body-3 line-clamp-1 min-w-full whitespace-nowrap text-font-2">
                {description}
              </p>
            </div>

            <span ref={triggerRef} className="relative flex shrink-0">
              <button
                onClick={toggle}
                type="button"
                className="flex size-7 items-center justify-center rounded-lg text-font-2 transition-colors duration-200 hover:text-font-1"
              >
                <Dots className="size-5" />
              </button>

              {isOpen && (
                <MyChattingMenuPopover
                  triggerRef={triggerRef}
                  onClose={close}
                  onDelete={() => null}
                  onEdit={() => null}
                  onPin={() => null}
                />
              )}
            </span>
          </div>

          <footer className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-1.5 text-font-2">
              <User className="size-4 shrink-0" />
              <span className="body-5 truncate">{creator}</span>
              <span className="body-5 text-font-disabled">·</span>
              <Message className="size-4 shrink-0" />
              <span className="body-5">{chatCount}</span>
            </div>

            <time className="body-6 shrink-0 text-nowrap text-font-disabled">
              {dayjs(updatedAt).fromNow()}
            </time>
          </footer>
        </div>
      </article>
    </li>
  );
};

export default ChattingItem;
