"use client";

import { Dots, User } from "@/icons";
import React, { useRef } from "react";
import dayjs from "@/lib/dayjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MyChattingMenuPopover from "@/components/popover/MyChattingMenuPopover";
import useToggle from "@/hooks/useToggle";

interface ChattingItemProps {
  creator: string;
  description: string;
  id: string;
  thumbnail: string;
  title: string;
  updatedAt: string;
}

const ChattingItem = ({
  creator,
  description,
  id,
  thumbnail,
  title,
  updatedAt,
}: ChattingItemProps) => {
  const router = useRouter();

  const { isOpen, toggle } = useToggle();
  const triggerRef = useRef(null);

  // 비즈니스 로직 및 이벤트 핸들러
  const chattingItemOnClick = () => {
    console.log("채팅방 이동");
    router.push(`/chatting-room`);
  };

  return (
    <li
      onClick={chattingItemOnClick}
      key={id}
      className="cursor-pointer flex gap-2 px-4 py-3 rounded-lg hover:bg-btn-hover"
    >
      <Image
        src={thumbnail}
        width={60}
        height={60}
        alt=""
        className="w-15 h-15 rounded-full"
      />

      <article id="chat-item-content" className="flex flex-1 justify-between">
        <div className="flex-1 pr-3 ">
          <h3 className="font-medium">{title}</h3>
          <p className="mb-2 mt-1.5 text-sm text-font-2 line-clamp-1 whitespace-break-spaces">
            {description}
          </p>
          <footer className="flex gap-1.5 text-font-2">
            <User className="w-4 h-4" />
            <span className="text-[13px]">{creator}</span>
          </footer>
        </div>

        <div className="flex flex-col justify-between items-end">
          <span ref={triggerRef} className="relative flex">
            <button onClick={toggle} type="button" className=" p-1 rounded-lg">
              <Dots className="w-5 h-5 text-font-2" />
            </button>

            {isOpen && (
              <MyChattingMenuPopover
                triggerRef={triggerRef}
                onClose={toggle}
                onDelete={() => null}
                onEdit={() => null}
              />
            )}
          </span>

          <time className="text-xs text-font-2 text-nowrap">
            {dayjs(updatedAt).fromNow()}
          </time>
        </div>
      </article>
    </li>
  );
};

export default ChattingItem;
