"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { useRoomDetailQuery } from "@/api/room/getRoomDetail";
import { usePatchRoomMemoryMutation } from "@/api/room/patchRoomMemory";
import { roomQueryKeys } from "@/api/room/queryKeys";
import { ArrowLeft, Storage } from "@/icons";
import { useAutoResizeTextarea } from "@/hooks/form/useAutoResizeTextarea";
import { showAppToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import type { Room } from "@/type/room";

/** 서버 PATCH /rooms/{roomId}/memory 의 최대 길이와 같아야 한다. */
const MEMORY_MAX_LENGTH = 4000;
const MEMORY_MIN_ROWS = 8;
const MEMORY_MAX_ROWS = 18;

interface ChattingMemoryViewProps {
  roomId: string;
  onBack: () => void;
  /** 저장하지 않은 수정이 있는지. 사이드바가 이 화면을 벗어나기 전에 물어볼지 정한다. */
  onDirtyChange?: (isDirty: boolean) => void;
}

/**
 * 지나온 대화(장기기억).
 *
 * 방마다 AI 가 대화를 요약해 쌓은 글 하나다. 사용자가 고치면 다음 턴부터 프롬프트에 들어가고,
 * 이후 요약은 고친 내용 위에 새 대화를 합친다. 비워서 저장하면 기억을 지운다.
 */
const ChattingMemoryView = ({
  roomId,
  onBack,
  onDirtyChange,
}: ChattingMemoryViewProps) => {
  const t = useTranslations("chatRoom.sidebar");
  const queryClient = useQueryClient();
  const {
    data: room,
    isPending: isRoomPending,
    refetch,
  } = useRoomDetailQuery(roomId);
  const savedMemory = room?.memory ?? "";
  // 고치기 전에는 저장된 값을 그대로 보여 준다. 방 정보가 늦게 오거나 요약이 갱신돼도 따라가고,
  // 한 번 고치기 시작하면 사용자가 쓴 값을 덮지 않는다.
  const [editedDraft, setEditedDraft] = useState<string | null>(null);
  const draft = editedDraft ?? savedMemory;
  const { textareaRef } = useAutoResizeTextarea({
    maxRows: MEMORY_MAX_ROWS,
    value: draft,
  });
  const { mutate: patchMemory, isPending } = usePatchRoomMemoryMutation();

  // 요약은 턴마다 서버에서 바뀌므로 화면을 열 때마다 새로 받는다.
  useEffect(() => {
    refetch();
  }, [refetch]);

  const trimmed = draft.trim();
  const isUnchanged = trimmed === savedMemory.trim();
  // maxLength 는 타이핑·붙여넣기만 막는다. 그 밖의 경로로 넘친 값은 서버가 400 으로 거절하므로 여기서 먼저 막는다.
  const isOverLimit = trimmed.length > MEMORY_MAX_LENGTH;
  const isDirty = editedDraft !== null && !isUnchanged;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);
  // 화면이 닫히면 더는 고치던 내용이 없다.
  useEffect(() => () => onDirtyChange?.(false), [onDirtyChange]);

  const handleSave = () => {
    if (isPending || isUnchanged || isOverLimit) return;

    patchMemory(
      { roomId, memory: trimmed },
      {
        onSuccess: () => {
          queryClient.setQueryData<Room>(roomQueryKeys.detail(roomId), (prev) =>
            prev ? { ...prev, memory: trimmed } : prev,
          );
          setEditedDraft(null);
          showAppToast("success", t("memorySavedToast"));
        },
      },
    );
  };

  return (
    <div className="flex h-full flex-col gap-5 overflow-hidden bg-dark p-5">
      <button
        type="button"
        onClick={onBack}
        className="flex size-5 items-center justify-center text-font-2 transition-colors hover:text-font-1"
        aria-label={t("backToSettings")}
      >
        <ArrowLeft className="size-5" />
      </button>

      <section className="flex min-h-0 flex-1 flex-col gap-5">
        <header className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Storage className="size-6 text-font-2" />
            <h2 className="body-3 text-font-1">{t("pastConversations")}</h2>
          </div>
          <p className="body-6 text-font-2">{t("memoryDescription")}</p>
        </header>

        <div className="flex min-h-0 flex-col gap-3">
          <div className="flex min-h-0 rounded-lg border border-main bg-darkest px-2 py-3 transition-colors focus-within:field-focus!">
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(event) => setEditedDraft(event.target.value)}
              rows={MEMORY_MIN_ROWS}
              maxLength={MEMORY_MAX_LENGTH}
              disabled={isRoomPending}
              placeholder={
                savedMemory ? t("memoryPlaceholder") : t("memoryEmpty")
              }
              aria-label={t("editMemory")}
              className="focus-ring-none body-6 custom-scrollbar w-full resize-none bg-transparent text-font-1 outline-none placeholder:text-font-disabled"
            />
          </div>

          <div className="flex items-center justify-between">
            <span
              className={cn(
                "body-7",
                isOverLimit ? "text-font-accents" : "text-font-2",
              )}
            >
              {draft.length}/{MEMORY_MAX_LENGTH}
            </span>

            <button
              type="button"
              onClick={handleSave}
              disabled={isPending || isUnchanged || isOverLimit}
              className="body-7 rounded border border-main bg-btn-hover px-3 py-1 text-font-1 transition-colors hover:bg-card-selected disabled:cursor-default disabled:opacity-50"
            >
              {t("memorySaveButton")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChattingMemoryView;
