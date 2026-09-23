import { useMemo } from "react";
import InlineEditActions from "@/components/chat/InlineEditActions";
import { useInlineTextEdit } from "@/hooks/form/useInlineTextEdit";
import { Pen, Trash } from "@/icons";
import { splitUserNarration } from "@/lib/platParse";
import { cn } from "@/lib/utils";

interface UserChatBubbleProps {
  text: string;
  isEditable?: boolean;
  onUpdate?: (newContent: string) => void;
  onDelete?: () => void;
}

const UserChatBubble = ({
  text,
  isEditable = false,
  onUpdate,
  onDelete,
}: UserChatBubbleProps) => {
  const {
    isEditing,
    draft: editedText,
    setDraft: setEditedText,
    startEditing,
    handleCancel,
    handleSubmit: handleUpdate,
    handleKeyDown,
    handleFocus,
  } = useInlineTextEdit({ value: text, onSubmit: onUpdate });

  /*
   * *…* 로 감싼 부분은 지문이라 캐릭터 응답의 지문처럼 자기 줄을 차지하고 톤도 낮춰 그린다.
   * 줄이 나뉘면 지문과 맞닿아 있던 공백이 줄 앞뒤에 남아 들여쓰기처럼 보이므로 다듬는다
   * (지문이 없으면 사용자가 친 그대로 둔다). 수정할 때는 원문을 고쳐야 하니 입력란에는 * 를 남긴다.
   */
  const segments = useMemo(() => {
    const parsed = splitUserNarration(text);
    if (parsed.length === 1) return parsed;

    return parsed
      .map((segment) => ({ ...segment, value: segment.value.trim() }))
      .filter((segment) => segment.value !== "");
  }, [text]);

  if (isEditing) {
    return (
      <div className="flex items-end justify-end gap-2">
        <InlineEditActions onCancel={handleCancel} onConfirm={handleUpdate} />

        <div className="flex flex-1 justify-end">
          <div className="flex w-full max-w-[520px] items-center rounded-[16px_16px_0px_16px] bg-brand-opacity-2 p-2.5">
            <textarea
              autoFocus
              className="body-5 w-full resize-none rounded-[16px_16px_0px_16px] border border-transparent bg-card-hover p-2.5 text-font-1 outline-none transition-colors focus:field-focus!"
              rows={2}
              value={editedText}
              onChange={(event) => setEditedText(event.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-end justify-end gap-1">
      {isEditable && (
        <div className="flex gap-1">
          <button
            type="button"
            onClick={startEditing}
            className="rounded-lg p-1.5 hover:bg-btn-hover"
          >
            <Pen className="size-4 text-font-2" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg p-1.5 hover:bg-btn-hover"
          >
            <Trash className="size-4 text-font-2" />
          </button>
        </div>
      )}

      <div className="body-5 whitespace-pre-wrap rounded-[16px_16px_0px_16px] bg-brand-opacity-2 px-3 py-2 text-font-1">
        {segments.map((segment, index) => (
          <span
            key={index}
            className={cn("block", segment.isNarration && "text-font-2")}
          >
            {segment.value}
          </span>
        ))}
      </div>
    </div>
  );
};

export default UserChatBubble;
