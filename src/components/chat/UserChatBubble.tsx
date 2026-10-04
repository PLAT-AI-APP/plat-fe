import { useTranslations } from "next-intl";
import InlineEditActions from "@/components/chat/InlineEditActions";
import { useUserDisplayName } from "@/hooks/data/useUserDisplayName";
import { useInlineTextEdit } from "@/hooks/form/useInlineTextEdit";
import { Pen, Trash } from "@/icons";
import Scenario from "@/components/chat/Scenario";
import { splitDialogueActions } from "@/lib/chatText";
import { cn } from "@/lib/utils";

interface UserChatBubbleProps {
  text: string;
  isEditable?: boolean;
  onUpdate?: (newContent: string) => void;
  onDelete?: () => void;
  /** 소설로 보기. 말풍선 없이 `이름 | 말` 한 문단으로 그린다. */
  isNovelView?: boolean;
}

const UserChatBubble = ({
  text,
  isEditable = false,
  onUpdate,
  onDelete,
  isNovelView = false,
}: UserChatBubbleProps) => {
  const t = useTranslations();
  const userDisplayName = useUserDisplayName();
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

  // 고치기는 미리보기처럼 글을 직접 바꿀 수 있는 자리에서만, 지우기는 지울 대상(서버 메시지)이 있으면 늘 보인다.
  // 채팅방에서는 내 말을 지우면 그 턴과 뒤 대화가 함께 지워진다.
  const actions = (isEditable || onDelete) && (
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
  );

  // 말 안의 행동 묘사는 캐릭터 대사와 같이 아래 나레이션 박스로 뺀다. 행동만 있는 말은 말풍선을 그리지 않는다.
  const { speech, actions: narrationLines } = splitDialogueActions(text);
  const hasSpeech = speech !== "" || narrationLines.length === 0;

  const bubble = isNovelView ? (
    // 말풍선 없이 캐릭터 대사와 같은 `이름 | 대사` 문단으로 그린다. 버튼은 글 뒤에 둔다.
    <div className="group flex items-end gap-1">
      <p className="body-4 whitespace-pre-wrap text-speech">
        {userDisplayName && `${userDisplayName} | `}
        {speech}
      </p>
      {actions}
    </div>
  ) : (
    <div className="group flex items-end justify-end gap-1">
      {actions}

      <div className="body-4 whitespace-pre-wrap rounded-[16px_16px_0px_16px] bg-brand-opacity-2 px-3 py-2 text-speech">
        {speech}
      </div>
    </div>
  );

  if (narrationLines.length === 0) return bubble;

  return (
    <div className={cn("flex flex-col", isNovelView ? "gap-5" : "gap-6")}>
      {hasSpeech && bubble}
      <Scenario text={narrationLines.join("\n")} isNovelView={isNovelView} />
      {/* 말이 없어 말풍선이 빠져도 지우기·고치기 버튼은 남겨 둔다. */}
      {!hasSpeech && (
        <div className={cn("flex", !isNovelView && "justify-end")}>{actions}</div>
      )}
    </div>
  );
};

export default UserChatBubble;
