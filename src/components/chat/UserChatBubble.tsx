import { Close, Pen, Trash } from "@/icons";
import Check from "@/icons/Check";
import React from "react";

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

  if (isEditing) {
    return (
      <div className="flex gap-2 items-end">
        <div className="flex shrink-0 gap-1 text-font-2 h-fit">
          <button
            onClick={handleCancel}
            className="p-1.5 rounded-lg hover:bg-btn-hover flex items-center justify-center"
          >
            <Close className="w-4 h-4" />
          </button>
          <button
            onClick={handleUpdate}
            className="p-1.5 rounded-lg hover:bg-btn-hover flex items-center justify-center"
          >
            <Check className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-1 gap-2 bg-card p-2.5 rounded-[16px_0px_16px_16px]">
          <textarea
            className="w-full bg-card-hover p-2.5 rounded-[16px_0px_16px_16px] body-4 outline-none"
            rows={2}
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end justify-end gap-1 group">
      {isEditable && (
        <div className="flex gap-1 pl-12 -mt-4">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 rounded-lg hover:bg-btn-hover"
          >
            <Pen className="w-4 h-4 text-font-2" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg hover:bg-btn-hover"
          >
            <Trash className="w-4 h-4 text-font-2" />
          </button>
        </div>
      )}
      <div className="flex justify-end">
        <span className="body-4 bg-[#B25500] px-3 py-2 rounded-[16px_0px_16px_16px]">
          {text}
        </span>
      </div>
    </div>
  );
};

export default UserChatBubble;
