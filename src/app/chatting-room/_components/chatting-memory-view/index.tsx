"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useChatMemoryListQuery } from "@/api/chat/getChatMemoryList";
import { ArrowLeft, Storage } from "@/icons";
import type { ChatMemoryEntry } from "@/type/chat";
import MemoryItem from "./_components/MemoryItem";

interface ChattingMemoryViewProps {
  onBack: () => void;
}

/** 실제 채팅방 id 연결 전 임시 room id */
const MOCK_CHAT_ROOM_ID = "mock-room";

const ChattingMemoryView = ({ onBack }: ChattingMemoryViewProps) => {
  const t = useTranslations("chatRoom.sidebar");
  const { data: fetchedMemories = [] } =
    useChatMemoryListQuery(MOCK_CHAT_ROOM_ID);
  const [memories, setMemories] = useState<ChatMemoryEntry[]>([]);
  const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    // API/MSW 장기기억 목록을 사이드바 편집용 로컬 상태로 복사
    setMemories(fetchedMemories);
  }, [fetchedMemories]);

  const handleStartEdit = (memory: ChatMemoryEntry) => {
    // 선택한 장기기억 내용을 편집 상태로 분리
    setEditingMemoryId(memory.id);
    setDraft(memory.content);
  };

  const handleCancelEdit = () => {
    // 목록 변경 없이 임시 편집 상태 초기화
    setEditingMemoryId(null);
    setDraft("");
  };

  const handleSaveEdit = () => {
    // 저장 API 연결 전까지 현재 입력값을 로컬 목록에 반영
    if (!editingMemoryId) return;

    setMemories((prevMemories) =>
      prevMemories.map((memory) =>
        memory.id === editingMemoryId ? { ...memory, content: draft } : memory,
      ),
    );
    setEditingMemoryId(null);
    setDraft("");
  };

  const handleDeleteMemory = (memoryId: string) => {
    // 삭제 API 연결 전까지 선택한 장기기억을 로컬 목록에서 제거
    setMemories((prevMemories) =>
      prevMemories.filter((memory) => memory.id !== memoryId),
    );

    if (editingMemoryId === memoryId) {
      setEditingMemoryId(null);
      setDraft("");
    }
  };

  return (
    <div className="flex h-full flex-col gap-5 overflow-hidden bg-bg-dark p-5">
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
            <h2 className="body-2 text-font-1">
              {t("pastConversations")}
            </h2>
          </div>
          <p className="body-5 text-font-2">{t("memoryDescription")}</p>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
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
      </section>
    </div>
  );
};

export default ChattingMemoryView;
