"use client";

import React from "react";
import dayjs from "@/lib/dayjs";
import { ChatListItemType } from "@/type/chat";
import { cn } from "@/lib/utils";
import Image from "next/image";
import ChattingItemInfo from "./ChattingItemInfo";
import ChattingItemMenu from "./ChattingItemMenu";

interface ChattingItemProps {
  chat: ChatListItemType;
  currentChat: ChatListItemType;
  handleCurrentChat: (chat: ChatListItemType) => void;
}

const ChattingItem = ({
  chat,
  currentChat,
  handleCurrentChat,
}: ChattingItemProps) => {
  return (
    <li
      onClick={() => handleCurrentChat(chat)}
      className={cn(
        "px-2 py-4 rounded-xl cursor-pointer",
        currentChat.id === chat.id ? "bg-card-selected" : "hover:bg-btn-hover",
      )}
    >
      <div id="chat-item-body" className="flex gap-3">
        <Image
          src={chat.profileImage}
          alt="캐릭터 프로필 이미지"
          width={46}
          height={46}
          className="w-11.5 h-11.5 rounded-full object-cover"
        />
        <div
          id="chat-item-main"
          className="flex flex-1 gap-2 justify-between min-w-0"
        >
          <ChattingItemInfo title={chat.title} lastMessage={chat.lastMessage} />

          <aside className="flex flex-col justify-between items-end shrink-0 text-font-disabled">
            <ChattingItemMenu />
            <span className="text-[12px] whitespace-nowrap">
              {dayjs(chat.time).fromNow()}
            </span>
          </aside>
        </div>
      </div>
    </li>
  );
};

export default ChattingItem;
