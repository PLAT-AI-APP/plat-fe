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

/** Temporary room id until the real chat room route id is connected */
const MOCK_CHAT_ROOM_ID = "mock-room";

const ChattingMemoryView = ({ onBack }: ChattingMemoryViewProps) => {
  const t = useTranslations("chatRoom.sidebar");
  const { data: fetchedMemories = [] } =
    useChatMemoryListQuery(MOCK_CHAT_ROOM_ID);
  const [memories, setMemories] = useState<ChatMemoryEntry[]>([]);
  const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    // Copy API/MSW data into local state for sidebar-only edit/delete interactions.
    setMemories(fetchedMemories);
  }, [fetchedMemories]);

  const handleStartEdit = (memory: ChatMemoryEntry) => {
    // Keep the selected memory content isolated while editing.
    setEditingMemoryId(memory.id);
    setDraft(memory.content);
  };

  const handleCancelEdit = () => {
    // Clear temporary edit state without changing the memory list.
    setEditingMemoryId(null);
    setDraft("");
  };

  const handleSaveEdit = () => {
    // Apply the current draft to the local memory list until a save API exists.
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
    // Remove the selected memory from the local list until a delete API exists.
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
