"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePatchRoomMemoryMutation } from "@/api/room/patchRoomContext";
import { ArrowLeft, Storage } from "@/icons";
import { showAppToast } from "@/lib/toast";

/** 백엔드 PatchRoomMemoryRequest.MAX_LENGTH */
const MEMORY_MAX_LENGTH = 4000;

interface ChattingMemoryViewProps {
  roomId: string;
  onBack: () => void;
}

const ChattingMemoryView = ({ roomId, onBack }: ChattingMemoryViewProps) => {
  const t = useTranslations("chatRoom.sidebar");
  const [draft, setDraft] = useState("");
  const { mutate: patchMemory, isPending } = usePatchRoomMemoryMutation();

  const handleSave = () => {
    if (isPending) return;

    patchMemory(
      { roomId, memory: draft },
      {
        onSuccess: () => showAppToast("success", t("memorySavedToast")),
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

        <div className="flex min-h-0 flex-1 flex-col gap-3">
          {/* 백엔드는 방마다 memory 문자열 하나만 통째로 덮어쓴다 — 조회 API가 없어
              항목별 목록이 아니라 매번 새로 입력하는 단일 텍스트로 다룬다. */}
          <div className="flex min-h-0 flex-1 rounded-lg border border-main bg-darkest px-2 py-3 transition-colors focus-within:field-focus!">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={MEMORY_MAX_LENGTH}
              placeholder={t("memoryPlaceholder")}
              className="focus-ring-none body-6 min-h-0 w-full flex-1 resize-none bg-transparent text-font-1 outline-none placeholder:text-font-disabled"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="body-7 text-font-2">
              {draft.length}/{MEMORY_MAX_LENGTH}
            </span>

            <button
              type="button"
              onClick={handleSave}
              disabled={isPending || !draft.trim()}
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
