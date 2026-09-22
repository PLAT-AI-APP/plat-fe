"use client";

import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import { useDeleteRoomMutation } from "@/api/room/deleteRoom";
import { usePinRoomMutation, useUnpinRoomMutation } from "@/api/room/patchRoomPin";
import MyChattingMenuPopover from "@/components/popover/MyChattingMenuPopover";
import useToggle from "@/hooks/common/useToggle";
import { useRelativeTimeLabel } from "@/hooks/i18n/useRelativeTimeLabel";
import { Dots, PinLine, User } from "@/icons";
import { useDialogStore } from "@/store/useDialogStore";

const DEFAULT_THUMBNAIL = "/images/sample.png";

interface ChattingItemProps {
  roomId: string;
  title: string;
  thumbnailUrl: string | null;
  personaName: string;
  lastMessage: string;
  lastUsedAt: string | null;
  isPinned: boolean;
}

const ChattingItem = ({
  roomId,
  title,
  thumbnailUrl,
  personaName,
  lastMessage,
  lastUsedAt,
  isPinned,
}: ChattingItemProps) => {
  const getRelativeTime = useRelativeTimeLabel();
  const { close, isOpen, toggle } = useToggle();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const openDialog = useDialogStore((state) => state.openDialog);
  const { mutate: deleteRoom } = useDeleteRoomMutation();
  const { mutate: pinRoom, isPending: isPinning } = usePinRoomMutation();
  const { mutate: unpinRoom, isPending: isUnpinning } = useUnpinRoomMutation();
  const isPinPending = isPinning || isUnpinning;

  const handleDeleteClick = () => {
    // 채팅 기록은 복구할 수 없으므로 삭제 전 확인을 거친다.
    openDialog("CHAT_DELETE", {
      onConfirm: () => deleteRoom(roomId),
    });
  };

  const handlePinToggle = () => {
    if (isPinPending) return;

    if (isPinned) unpinRoom(roomId);
    else pinRoom(roomId);
  };

  return (
    <li
      data-chat-id={roomId}
      className="relative flex gap-3 rounded-lg px-4 py-3 transition-colors duration-200 hover:bg-btn-hover"
    >
      {/*
        항목 전체를 덮는 링크. 예전에는 li 의 onClick 에서 router.push 를 불러 미리 받기(prefetch)가
        없었고, 누른 뒤에야 채팅방을 받기 시작했다. 메뉴 버튼은 링크 위(z-10)에 따로 둔다 —
        a 안에 button 을 넣으면 올바르지 않은 마크업이 된다.
      */}
      <Link
        href={`/chatting-room?roomId=${roomId}`}
        aria-label={title}
        className="absolute inset-0 rounded-lg"
      />
      <Image
        src={thumbnailUrl || DEFAULT_THUMBNAIL}
        width={84}
        height={84}
        alt={title}
        className="size-[84px] shrink-0 rounded-2xl bg-card-hover object-cover"
      />

      <article
        id="chat-item-content"
        className="flex min-w-0 flex-1 items-center"
      >
        <div className="flex h-full min-w-0 flex-1 flex-col justify-center gap-3">
          <div className="flex min-h-0 flex-1 items-start justify-between gap-3">
            <div className="flex h-full min-w-0 flex-1 flex-col gap-1.5 overflow-hidden">
              <div className="flex items-center gap-1.5">
                <h3 className="title-3 truncate text-font-1">{title}</h3>
                {isPinned && (
                  <PinLine
                    className="size-4 shrink-0 text-font-1"
                    aria-hidden
                  />
                )}
              </div>

              <p className="body-4 w-full min-w-0 truncate text-font-2">
                {lastMessage}
              </p>
            </div>

            <span ref={triggerRef} className="relative z-10 flex shrink-0">
              <button
                type="button"
                onClick={toggle}
                className="flex size-7 items-center justify-center rounded-lg text-font-2 transition-colors duration-200 hover:text-font-1"
              >
                <Dots className="size-5" />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <MyChattingMenuPopover
                    triggerRef={triggerRef}
                    onClose={close}
                    onDelete={handleDeleteClick}
                    onEdit={() => null}
                    onPin={handlePinToggle}
                    isPinned={isPinned}
                  />
                )}
              </AnimatePresence>
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-1.5">
              <User className="size-4 shrink-0 text-font-2" />
              <p className="body-5 truncate text-font-2">{personaName}</p>
            </div>

            {lastUsedAt && (
              <p className="body-6 shrink-0 text-font-disabled">
                {getRelativeTime(lastUsedAt)}
              </p>
            )}
          </div>
        </div>
      </article>
    </li>
  );
};

export default ChattingItem;
