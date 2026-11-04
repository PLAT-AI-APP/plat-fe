"use client";

import { useEffect, useMemo, useState, type UIEvent } from "react";
import { useTranslations } from "next-intl";
import { useDeleteRoomMemoryEntryMutation } from "@/api/room/deleteRoomMemoryEntry";
import { useRoomMemoryInfiniteQuery } from "@/api/room/getRoomMemory";
import { usePatchRoomMemoryEntryMutation } from "@/api/room/patchRoomMemoryEntry";
import { ArrowLeft, Storage } from "@/icons";
import EmptyState from "@/components/state/EmptyState";
import { showAppToast } from "@/lib/toast";
import type { ChatMemoryEntry } from "@/type/chat";
import MemoryItem from "./_components/MemoryItem";

/** 목록 끝에서 이만큼(px) 안쪽으로 내려오면 다음 쪽을 받는다. */
const LOAD_MORE_THRESHOLD = 120;

interface ChattingMemoryViewProps {
  roomId: string;
  onBack: () => void;
  /** 저장하지 않은 수정이 있는지. 사이드바가 이 화면을 벗어나기 전에 물어볼지 정한다. */
  onDirtyChange?: (isDirty: boolean) => void;
}

const ChattingMemoryView = ({
  roomId,
  onBack,
  onDirtyChange,
}: ChattingMemoryViewProps) => {
  const t = useTranslations("chatRoom.sidebar");
  const { data, isSuccess, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useRoomMemoryInfiniteQuery(roomId);
  const { mutate: patchMemoryEntry, isPending: isPatching } =
    usePatchRoomMemoryEntryMutation();
  const { mutate: deleteMemoryEntry } = useDeleteRoomMemoryEntryMutation();
  const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  // 수정·삭제 뒤 목록을 다시 받으면 쪽 경계가 밀려 같은 항목이 두 쪽에 걸칠 수 있어 id 로 한 번만 남긴다.
  const memories = useMemo(() => {
    const seen = new Set<string>();
    return (data?.pages ?? [])
      .flatMap((page) => page.content)
      .filter((memory) => {
        if (seen.has(memory.id)) return false;
        seen.add(memory.id);
        return true;
      });
  }, [data]);

  // 고치던 항목의 원래 내용과 달라졌을 때만 저장하지 않은 수정으로 본다.
  const editingMemory = memories.find((memory) => memory.id === editingMemoryId);
  const isDirty = editingMemory !== undefined && draft !== editingMemory.content;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);
  // 화면이 닫히면 더는 고치던 내용이 없다.
  useEffect(() => () => onDirtyChange?.(false), [onDirtyChange]);

  const handleStartEdit = (memory: ChatMemoryEntry) => {
    // 선택한 항목 내용을 편집 상태로 분리
    setEditingMemoryId(memory.id);
    setDraft(memory.content);
  };

  const handleCancelEdit = () => {
    // 목록 변경 없이 임시 편집 상태 초기화
    setEditingMemoryId(null);
    setDraft("");
  };

  const handleSaveEdit = () => {
    // 서버는 공백뿐인 내용을 받지 않고, 저장 중 다시 누르면 같은 수정이 두 번 나간다.
    if (!editingMemoryId || isPatching || draft.trim() === "") return;

    patchMemoryEntry(
      { roomId, memoryId: editingMemoryId, content: draft },
      {
        onSuccess: () => {
          showAppToast("success", t("memorySavedToast"));
          setEditingMemoryId(null);
          setDraft("");
        },
      },
    );
  };

  const handleDeleteMemory = (memoryId: string) => {
    deleteMemoryEntry(
      { roomId, memoryId },
      {
        onSuccess: () => {
          if (editingMemoryId !== memoryId) return;
          setEditingMemoryId(null);
          setDraft("");
        },
      },
    );
  };

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    const isNearEnd =
      scrollHeight - scrollTop - clientHeight < LOAD_MORE_THRESHOLD;

    if (isNearEnd && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
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

        {isSuccess && memories.length === 0 ? (
          <EmptyState
            size="sm"
            mood="sleep"
            message={t("memoryEmpty")}
            className="flex-1"
          />
        ) : (
          <div
            onScroll={handleScroll}
            className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto"
          >
            {memories.map((memory) => (
              <MemoryItem
                key={memory.id}
                memory={memory}
                isEditing={editingMemoryId === memory.id}
                draft={editingMemoryId === memory.id ? draft : memory.content}
                onChangeDraft={setDraft}
                onStartEdit={() => handleStartEdit(memory)}
                onCancelEdit={handleCancelEdit}
                onSave={handleSaveEdit}
                onDelete={() => handleDeleteMemory(memory.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ChattingMemoryView;
