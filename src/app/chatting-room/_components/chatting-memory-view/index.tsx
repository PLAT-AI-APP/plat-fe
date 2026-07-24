"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, Storage } from "@/icons";
import MemoryItem, { MemoryEntry } from "./_components/MemoryItem";

interface ChattingMemoryViewProps {
  onBack: () => void;
}

// 장기기억 카드 높이와 줄바꿈 확인용 문장
const MEMORY_CONTENT =
  "내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용";

// API 연결 전 장기기억 뎁스 확인용 데이터
const INITIAL_MEMORY_ENTRIES: MemoryEntry[] = Array.from(
  { length: 5 },
  (_, index) => ({
    id: `memory-${index + 1}`,
    turn: 5 - index,
    createdAt: "26.7.18 오후 3:33",
    content: MEMORY_CONTENT,
  }),
);

const ChattingMemoryView = ({ onBack }: ChattingMemoryViewProps) => {
  const t = useTranslations("chatRoom.sidebar");
  const [memories, setMemories] = useState(INITIAL_MEMORY_ENTRIES);
  const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const handleStartEdit = (memory: MemoryEntry) => {
    // 선택한 장기기억을 수정 상태로 전환
    setEditingMemoryId(memory.id);
    setDraft(memory.content);
  };

  const handleCancelEdit = () => {
    // 수정 중인 장기기억 원복
    setEditingMemoryId(null);
    setDraft("");
  };

  const handleSaveEdit = () => {
    // 현재 입력값을 장기기억 목록에 반영
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
    // 선택한 장기기억 항목 제거
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
            <h2 className="body-2 text-font-1">{t("memory")}</h2>
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
