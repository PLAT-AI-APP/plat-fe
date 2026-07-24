"use client";

import { useTranslations } from "next-intl";
import { Close, Pen, Save, Trash } from "@/icons";
import { cn } from "@/lib/utils";

export interface MemoryEntry {
  content: string;
  createdAt: string;
  id: string;
  turn: number;
}

interface MemoryItemProps {
  draft: string;
  isEditing: boolean;
  memory: MemoryEntry;
  onCancelEdit: () => void;
  onChangeDraft: (value: string) => void;
  onDelete: () => void;
  onSave: () => void;
  onStartEdit: () => void;
}

const MemoryItem = ({
  draft,
  isEditing,
  memory,
  onCancelEdit,
  onChangeDraft,
  onDelete,
  onSave,
  onStartEdit,
}: MemoryItemProps) => {
  const t = useTranslations("chatRoom.sidebar");

  return (
    <article
      className={cn(
        "flex w-full flex-col gap-3 rounded-xl bg-card p-3",
        isEditing && "border border-card-selected",
      )}
    >
      <header className="flex w-full items-center justify-between gap-3">
        <div className="body-6 flex min-w-0 items-center gap-[7px] whitespace-nowrap">
          <span className={cn(isEditing ? "text-font-2" : "text-font-1")}>
            {t("memoryTurn", { turn: memory.turn })}
          </span>
          <time className="text-font-2">{memory.createdAt}</time>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={onSave}
                className="flex size-[19px] items-center justify-center text-brand-dark transition-colors hover:text-brand"
                aria-label={t("saveMemory")}
              >
                <Save className="size-[19px]" />
              </button>
              <button
                type="button"
                onClick={onCancelEdit}
                className="flex size-[19px] items-center justify-center text-font-2 transition-colors hover:text-font-1"
                aria-label={t("cancelMemory")}
              >
                <Close className="size-[19px]" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onStartEdit}
                className="flex size-[19px] items-center justify-center text-font-1 transition-colors hover:text-font-2"
                aria-label={t("editMemory")}
              >
                <Pen className="size-[19px]" />
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="flex size-[19px] items-center justify-center text-font-error transition-colors hover:text-font-accents"
                aria-label={t("deleteMemory")}
              >
                <Trash className="size-[19px]" />
              </button>
            </>
          )}
        </div>
      </header>

      {isEditing ? (
        <textarea
          value={draft}
          onChange={(event) => onChangeDraft(event.target.value)}
          className="body-5 min-h-[153px] w-full resize-none rounded-lg border border-border-main bg-bg-darkest px-2 py-3 text-font-0 outline-none"
        />
      ) : (
        <p className="body-6 rounded-lg px-2 py-3 text-font-1">
          {memory.content}
        </p>
      )}
    </article>
  );
};

export default MemoryItem;
