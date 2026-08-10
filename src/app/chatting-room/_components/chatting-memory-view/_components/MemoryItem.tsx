"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import PastConversationPopover from "@/components/popover/PastConversationPopover";
import useToggle from "@/hooks/useToggle";
import { Dots } from "@/icons";
import { cn } from "@/lib/utils";
import type { ChatMemoryEntry } from "@/type/chat";

interface MemoryItemProps {
  draft: string;
  isEditing: boolean;
  memory: ChatMemoryEntry;
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
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { isOpen: isPopoverOpen, toggle, close: closePopover } = useToggle();

  return (
    <article
      className={cn(
        "flex w-full flex-col gap-3 rounded-xl bg-card p-3",
        isEditing && "border border-card-selected",
      )}
    >
      <header className="flex w-full items-center justify-between gap-3">
        <span
          className={cn(
            "body-6 whitespace-nowrap",
            isEditing ? "text-font-2" : "text-font-1",
          )}
        >
          {t("memoryTurn", { turn: memory.turn })}
        </span>

        {isEditing ? (
          <span className="size-[19px]" aria-hidden="true" />
        ) : (
          <div className="relative shrink-0">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={toggle}
              className="flex size-[18px] items-center justify-center text-font-1 transition-colors hover:text-font-2"
              aria-label={t("editMemory")}
              aria-haspopup="menu"
              aria-expanded={isPopoverOpen}
            >
              <Dots className="size-[18px]" />
            </button>

            {isPopoverOpen && (
              <PastConversationPopover
                triggerRef={menuButtonRef}
                onClose={closePopover}
                onEdit={onStartEdit}
                onDelete={onDelete}
              />
            )}
          </div>
        )}
      </header>

      {isEditing ? (
        <>
          <div className="flex w-full rounded-lg border border-main bg-darkest px-2 py-3">
            <textarea
              value={draft}
              onChange={(event) => onChangeDraft(event.target.value)}
              className="body-4 min-h-[153px] w-full resize-none bg-transparent text-font-0 outline-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancelEdit}
              className="body-6 rounded border border-main bg-btn-hover px-3 py-1 text-font-1 transition-colors hover:bg-card-selected"
            >
              {t("memoryCancelButton")}
            </button>
            <button
              type="button"
              onClick={onSave}
              className="body-6 rounded border border-main bg-btn-hover px-3 py-1 text-font-1 transition-colors hover:bg-card-selected"
            >
              {t("memorySaveButton")}
            </button>
          </div>
        </>
      ) : (
        // 패딩이 클램프된 요소에 있으면 잘린 다음 줄이 하단 여백에 비치므로 패딩은 바깥에 둡니다.
        <div className="rounded-lg px-2 py-3">
          <p className="body-5 line-clamp-[20] text-font-1">{memory.content}</p>
        </div>
      )}
    </article>
  );
};

export default MemoryItem;
