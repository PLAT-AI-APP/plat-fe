import React from "react";
import { Close, Pen, Trash } from "@/icons";
import Check from "@/icons/Check";

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
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedText, setEditedText] = React.useState(text);

  React.useEffect(() => {
    setEditedText(text);
  }, [text]);

  const handleUpdate = () => {
    onUpdate?.(editedText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedText(text);
    setIsEditing(false);
  };

  // 엔터는 확정, esc는 취소, 쉬프트+엔터는 줄바꿈으로 동작합니다.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      handleCancel();
      return;
    }

    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      handleUpdate();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-end justify-end gap-2">
        <div className="flex h-fit shrink-0 gap-1 text-font-2">
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center justify-center rounded-lg p-1.5 hover:bg-btn-hover"
          >
            <Close className="size-4" />
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            className="flex items-center justify-center rounded-lg p-1.5 hover:bg-btn-hover"
          >
            <Check className="size-4" />
          </button>
        </div>

        <div className="flex flex-1 justify-end">
          <div className="flex w-full max-w-[520px] items-center rounded-[16px_16px_0px_16px] bg-brand-opacity-2 p-2.5">
            <textarea
              className="body-4 w-full resize-none rounded-[16px_16px_0px_16px] border border-transparent bg-card-hover p-2.5 text-font-1 outline-none transition-colors focus:field-focus!"
              rows={2}
              value={editedText}
              onChange={(event) => setEditedText(event.target.value)}
              onKeyDown={handleKeyDown}
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
            onClick={() => setIsEditing(true)}
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

      <span className="body-4 rounded-[16px_16px_0px_16px] bg-brand-opacity-2 px-3 py-2 text-font-1">
        {text}
      </span>
    </div>
  );
};

export default UserChatBubble;
