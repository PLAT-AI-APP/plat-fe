"use client";

import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import { useDeleteRoomMutation } from "@/api/room/deleteRoom";
import { usePinRoomMutation, useUnpinRoomMutation } from "@/api/room/patchRoomPin";
import MyChattingMenuPopover from "@/components/popover/MyChattingMenuPopover";
import useToggle from "@/hooks/common/useToggle";
import { Dots, Pin } from "@/icons";
import { useDialogStore } from "@/store/useDialogStore";

const DEFAULT_THUMBNAIL = "/images/sample.png";

interface ChattingItemProps {
  roomId: string;
  title: string;
  thumbnailUrl: string | null;
  lastMessage: string;
  isPinned: boolean;
}

const ChattingItem = ({
  roomId,
  title,
  thumbnailUrl,
  lastMessage,
  isPinned,
}: ChattingItemProps) => {
  const router = useRouter();
  const { close, isOpen, toggle } = useToggle();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const openDialog = useDialogStore((state) => state.openDialog);
  const { mutate: deleteRoom } = useDeleteRoomMutation();
  const { mutate: pinRoom, isPending: isPinning } = usePinRoomMutation();
  const { mutate: unpinRoom, isPending: isUnpinning } = useUnpinRoomMutation();
  const isPinPending = isPinning || isUnpinning;

  const chattingItemOnClick = () => {
    router.push(`/chatting-room?roomId=${roomId}`);
  };

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
      onClick={chattingItemOnClick}
      data-chat-id={roomId}
      className="flex cursor-pointer gap-3 rounded-lg px-4 py-3 transition-colors duration-200 hover:bg-btn-hover"
    >
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
        <div className="flex h-full min-w-0 flex-1 flex-col gap-1.5 justify-center">
          <div className="flex min-h-0 flex-1 items-start justify-between gap-3">
            <div className="flex h-full min-w-0 flex-1 flex-col gap-1.5 overflow-hidden">
              <div className="flex items-center gap-1.5">
                <h3 className="title-3 truncate text-font-1">{title}</h3>
                {isPinned && (
                  <Pin className="size-4 shrink-0 text-font-2" aria-hidden />
                )}
              </div>

              <p className="body-4 w-full min-w-0 truncate text-font-2">
                {lastMessage}
              </p>
            </div>

            <span ref={triggerRef} className="relative flex shrink-0">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  toggle();
                }}
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
        </div>
      </article>
    </li>
  );
};

export default ChattingItem;
