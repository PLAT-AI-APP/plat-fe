import { useTranslations } from "next-intl";
import InlineEditActions from "@/components/chat/InlineEditActions";
import { useInlineTextEdit } from "@/hooks/form/useInlineTextEdit";
import { Pen, Trash } from "@/icons";
import ActionText from "@/components/chat/ActionText";

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
  const t = useTranslations();
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
      {/* 고치기는 미리보기처럼 글을 직접 바꿀 수 있는 자리에서만, 지우기는 지울 대상(서버 메시지)이 있으면 늘 보인다.
          채팅방에서는 내 말을 지우면 그 턴과 뒤 대화가 함께 지워진다. */}
      {(isEditable || onDelete) && (
        <div className="flex gap-1">
          {isEditable && (
            <button
              type="button"
              onClick={startEditing}
              className="rounded-lg p-1.5 hover:bg-btn-hover"
              aria-label={t("chatUI.editMessage")}
            >
              <Pen className="size-4 text-font-2" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-lg p-1.5 hover:bg-btn-hover"
              aria-label={t("chatUI.deleteMessage")}
            >
              <Trash className="size-4 text-font-2" />
            </button>
          )}
        </div>
      )}

      {/* 사용자 말의 동작도 캐릭터 대사와 같은 모양(같은 줄·흐린 기울임)으로 그린다. */}
      <div className="body-5 whitespace-pre-wrap rounded-[16px_16px_0px_16px] bg-brand-opacity-2 px-3 py-2 text-font-1">
        <ActionText text={text} />
      </div>
    </div>
  );
};

export default UserChatBubble;
