import { Fragment, useMemo } from "react";
import InlineEditActions from "@/components/chat/InlineEditActions";
import { useInlineTextEdit } from "@/hooks/form/useInlineTextEdit";
import { Pen, Trash } from "@/icons";
import { splitUserNarration } from "@/lib/platParse";

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

  // *…* 로 감싼 부분은 지문이라 캐릭터 응답의 지문과 같은 톤으로 낮춰 그린다. 수정할 때는
  // 원문을 그대로 고쳐야 하므로 입력란에는 * 를 남겨 둔다.
  const segments = useMemo(() => splitUserNarration(text), [text]);

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

      <span className="body-5 whitespace-pre-wrap rounded-[16px_16px_0px_16px] bg-brand-opacity-2 px-3 py-2 text-font-1">
        {segments.map((segment, index) =>
          segment.isNarration ? (
            <em key={index} className="text-font-2 not-italic">
              {segment.value}
            </em>
          ) : (
            <Fragment key={index}>{segment.value}</Fragment>
          ),
        )}
      </span>
    </div>
  );
};

export default UserChatBubble;
