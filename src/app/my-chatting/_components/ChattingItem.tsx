"use client";

import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import { useTranslations } from "next-intl";
import { useDeleteRoomMutation } from "@/api/room/deleteRoom";
import { usePinRoomMutation, useUnpinRoomMutation } from "@/api/room/patchRoomPin";
import { usePrefetchRoom } from "@/api/room/usePrefetchRoom";
import MyChattingMenuPopover from "@/components/popover/MyChattingMenuPopover";
import useToggle from "@/hooks/common/useToggle";
import { useRelativeTimeLabel } from "@/hooks/i18n/useRelativeTimeLabel";
import { Dots, LockLine, PinLine, User } from "@/icons";
import { toChatPreviewText } from "@/lib/chatText";
import { useDialogStore } from "@/store/useDialogStore";
import { useModalStore } from "@/store/useModalStore";
import type { RoomLockReason } from "@/type/room";

const DEFAULT_THUMBNAIL = "/images/sample.png";

interface ChattingItemProps {
  roomId: string;
  /** 잠긴 방(locked)이면 null. */
  title: string | null;
  thumbnailUrl: string | null;
  personaName: string;
  /** 아직 대화가 없으면 null. */
  lastMessage: string | null;
  lastUsedAt: string | null;
  isPinned: boolean;
  /** 캐릭터가 지워진 방. 대화는 볼 수 있고 새 대화만 막힌다. */
  isClosed: boolean;
  /** 성인인증이 만료돼 내용을 가린 방. 들어가지 못하고 재인증만 권한다. */
  locked?: RoomLockReason | null;
}

const ChattingItem = ({
  roomId,
  title,
  thumbnailUrl,
  personaName,
  lastMessage,
  lastUsedAt,
  isPinned,
  isClosed,
  locked = null,
}: ChattingItemProps) => {
  const t = useTranslations("myChatting");
  const lockT = useTranslations("adultVerification.room");
  const openModal = useModalStore((state) => state.openModal);
  const isLocked = locked !== null;
  const displayTitle = isLocked ? lockT("lockedTitle") : (title ?? "");
  const getRelativeTime = useRelativeTimeLabel();
  const { close, isOpen, toggle } = useToggle();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const openDialog = useDialogStore((state) => state.openDialog);
  const { mutate: deleteRoom } = useDeleteRoomMutation();
  const { mutate: pinRoom, isPending: isPinning } = usePinRoomMutation();
  const { mutate: unpinRoom, isPending: isUnpinning } = useUnpinRoomMutation();
  const isPinPending = isPinning || isUnpinning;
  const prefetchRoom = usePrefetchRoom();
  const previewText = toChatPreviewText(lastMessage);

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
      {/* 잠긴 방은 들어가도 서버가 막는다(403). 링크를 두지 않고 재인증 버튼만 둔다. */}
      {!isLocked && (
        <Link
          href={`/chatting-room?roomId=${roomId}`}
          aria-label={displayTitle}
          onPointerEnter={() => prefetchRoom(roomId)}
          onFocus={() => prefetchRoom(roomId)}
          className="absolute inset-0 rounded-lg"
        />
      )}
      {isLocked ? (
        // 서버가 이미지를 비워 보낸다. 모자이크 느낌의 흐린 자리에 자물쇠만 둔다.
        <div
          aria-hidden="true"
          className="relative flex size-[84px] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-card-hover"
        >
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-60 blur-[2px]">
            {Array.from({ length: 16 }, (_, index) => (
              <span
                key={index}
                className={(index + Math.floor(index / 4)) % 2 === 0 ? "bg-card" : "bg-darkest"}
              />
            ))}
          </div>
          <LockLine className="relative size-7 text-font-2" />
        </div>
      ) : (
        <Image
          src={thumbnailUrl || DEFAULT_THUMBNAIL}
          width={84}
          height={84}
          alt={displayTitle}
          className="size-[84px] shrink-0 rounded-2xl bg-card-hover object-cover"
        />
      )}

      <article
        id="chat-item-content"
        className="flex min-w-0 flex-1 items-center"
      >
        <div className="flex h-full min-w-0 flex-1 flex-col justify-center gap-3">
          <div className="flex min-h-0 flex-1 items-start justify-between gap-3">
            <div className="flex h-full min-w-0 flex-1 flex-col gap-1.5 overflow-hidden">
              <div className="flex items-center gap-1.5">
                <h3
                  className={
                    isLocked
                      ? "title-3 flex items-center gap-1 truncate text-font-2"
                      : "title-3 truncate text-font-1"
                  }
                >
                  {isLocked && <LockLine className="size-4 shrink-0" aria-hidden />}
                  {displayTitle}
                </h3>
                {isClosed && (
                  <span className="body-8 shrink-0 rounded-md bg-card-hover px-1.5 py-0.5 text-font-2">
                    {t("closedBadge")}
                  </span>
                )}
                {isPinned && (
                  <PinLine
                    className="size-4 shrink-0 text-font-1"
                    aria-hidden
                  />
                )}
              </div>

              {isLocked ? (
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="skeleton h-4 w-24 shrink rounded-full blur-[1px]"
                  />
                  <p className="body-6 min-w-0 truncate text-font-2">
                    {lockT("lockedPreview")}
                  </p>
                </div>
              ) : (
                <p className="body-4 w-full min-w-0 truncate text-font-2">
                  {previewText}
                </p>
              )}
            </div>

            <span ref={triggerRef} className="relative z-10 flex shrink-0 items-center gap-1">
              {isLocked && (
                <button
                  type="button"
                  onClick={() => openModal("IDENTITY_VERIFICATION")}
                  className="body-7 h-7 rounded-lg bg-brand-opacity px-2.5 text-brand-dark hover:bg-brand-opacity-2"
                >
                  {lockT("reverify")}
                </button>
              )}
              <button
                type="button"
                onClick={toggle}
                aria-label={t("openMenu")}
                aria-expanded={isOpen}
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
