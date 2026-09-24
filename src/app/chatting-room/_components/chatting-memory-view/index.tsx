"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, Storage } from "@/icons";
import type { ChatMemoryEntry } from "@/type/chat";
import MemoryItem from "./_components/MemoryItem";

/**
 * 지나온 대화 목 목록.
 *
 * 백엔드에는 방마다 memory 문자열 하나를 통째로 덮어쓰는 PATCH /rooms/{roomId}/memory 만 있고
 * 턴별 목록을 주는 조회 API 가 없다. 목록 API 가 생기기 전까지 화면 구성을 확인할 수 있도록 목 데이터로 둔다.
 */
const MOCK_MEMORIES: ChatMemoryEntry[] = [
  {
    id: "memory-1",
    turn: 12,
    createdAt: "26.7.18 오후 3:33",
    content:
      "사용자는 짧고 자연스러운 답변을 선호한다. 감정 표현은 과하지 않게, 상황에 맞춰 담백하게 이어가는 편이 좋다.",
  },
  {
    id: "memory-2",
    turn: 10,
    createdAt: "26.7.18 오후 3:21",
    content:
      "사용자는 판타지 세계관과 일상적인 대화를 섞는 설정을 좋아한다. 갑작스러운 전개보다 관계가 천천히 가까워지는 흐름을 선호한다.",
  },
  {
    id: "memory-3",
    turn: 8,
    createdAt: "26.7.18 오후 3:08",
    content:
      "캐릭터는 사용자가 피곤하다고 말하면 먼저 상태를 묻고, 바로 조언하기보다 잠깐 쉬어도 괜찮다는 식으로 반응한다.",
  },
  {
    id: "memory-4",
    turn: 5,
    createdAt: "26.7.18 오후 2:54",
    content:
      "사용자는 대화 중 이름을 자주 부르는 것보다 중요한 순간에만 불러주는 방식을 더 자연스럽게 느낀다.",
  },
  {
    id: "memory-5",
    turn: 2,
    createdAt: "26.7.18 오후 2:40",
    content:
      "캐릭터는 처음에는 무심한 말투지만, 사용자가 먼저 다가오면 짧게 웃거나 솔직한 감정을 조금씩 드러낸다.",
  },
];

interface ChattingMemoryViewProps {
  onBack: () => void;
}

const ChattingMemoryView = ({ onBack }: ChattingMemoryViewProps) => {
  const t = useTranslations("chatRoom.sidebar");
  const [memories, setMemories] = useState<ChatMemoryEntry[]>(MOCK_MEMORIES);
  const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

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

  // 수정·삭제 API 가 없어 현재 입력값을 목록에만 반영한다.
  const handleSaveEdit = () => {
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
    setMemories((prevMemories) =>
      prevMemories.filter((memory) => memory.id !== memoryId),
    );

    if (editingMemoryId === memoryId) {
      setEditingMemoryId(null);
      setDraft("");
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

        {memories.length === 0 ? (
          <p className="body-6 flex flex-1 items-center justify-center text-font-disabled">
            {t("memoryEmpty")}
          </p>
        ) : (
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
        )}
      </section>
    </div>
  );
};

export default ChattingMemoryView;
