import { useMemo } from "react";
import InlineEditActions from "@/components/chat/InlineEditActions";
import { useInlineTextEdit } from "@/hooks/form/useInlineTextEdit";
import { Pen, Trash } from "@/icons";
import { splitActionSegments } from "@/lib/chatText";
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

  // 사용자 말에서도 *행동* 을 캐릭터 대사와 똑같이 갈라 그린다(같은 규칙을 두 번 쓰지 않도록 공용 함수를 쓴다).
  const segments = useMemo(() => splitActionSegments(text), [text]);
  // 행동이 있을 때만 줄을 나눈다. 없으면 예전처럼 문자열 하나로 둬 다른 말풍선의 모양이 바뀌지 않는다.
  const hasAction = segments.some((segment) => segment.type === "action");

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

      <div
        className={cn(
          "body-5 whitespace-pre-wrap rounded-[16px_16px_0px_16px] bg-brand-opacity-2 px-3 py-2 text-font-1",
          hasAction && "flex flex-col gap-2",
        )}
      >
        {hasAction
          ? segments.map((segment, index) => (
              <p
                key={index}
                // 행동은 대사보다 한 단계 흐린 색으로 구분한다.
                className={cn(segment.type === "action" && "text-font-2")}
              >
                {segment.value}
              </p>
            ))
          : text}
      </div>
    </div>
  );
};

export default UserChatBubble;
