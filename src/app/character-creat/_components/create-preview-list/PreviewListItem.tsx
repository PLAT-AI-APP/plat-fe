import { useState } from "react";
import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { ScenarioContentItem } from "@/type/character";
import EditableChatPreview from "./EditableChatPreview";
import EditableScenarioPreview from "./EditableScenarioPreview";
import EditableUserChatPreview from "./EditableUserChatPreview";
import PreviewContentView from "./PreviewContentView";
import PreviewDragHandle from "./PreviewDragHandle";
import PreviewEditControls from "./PreviewEditControls";
import PreviewItemActions from "./PreviewItemActions";
import { PreviewEditLabels } from "./types";

interface PreviewListItemProps {
  item: ScenarioContentItem;
  isDragging: boolean;
  isEditing: boolean;
  characterName: string;
  profileImage: string;
  profileAlt: string;
  assetImageAlt: string;
  isEditable: boolean;
  labels: PreviewEditLabels;
  dragHandleProps: DraggableProvidedDragHandleProps | null;
  onEdit: () => void;
  onCancelEdit: () => void;
  /** 고친 글을 확정한다. */
  onConfirmEdit: (value: string) => void;
  onDelete?: () => void;
}

const PreviewListItem = ({
  item,
  isDragging,
  isEditing,
  characterName,
  profileImage,
  profileAlt,
  assetImageAlt,
  isEditable,
  labels,
  dragHandleProps,
  onEdit,
  onCancelEdit,
  onConfirmEdit,
  onDelete,
}: PreviewListItemProps) => {
  // 고치는 중인 글은 이 항목이 들고 있는다. 목록이 들고 있으면 한 글자마다 목록의 모든 항목
  // (드래그 래퍼·행동 구분 파싱 포함)이 다시 그려져, 대화가 길수록 입력이 무거웠다.
  const [editedValue, setEditedValue] = useState(item.value);
  const [wasEditing, setWasEditing] = useState(isEditing);
  // 편집을 시작하는 순간 지금 글로 초기화한다(렌더 중 조정 — effect 를 쓰면 한 프레임 옛 글이 보인다).
  if (isEditing !== wasEditing) {
    setWasEditing(isEditing);
    if (isEditing) setEditedValue(item.value);
  }
  const onEditValueChange = setEditedValue;
  const handleConfirmEdit = () => onConfirmEdit(editedValue);

  return (
    <div>
      <article
        className={cn(
          "group relative w-full rounded-2xl",
          item.type === "action" && "px-2 pt-0",
          isEditing && "bg-transparent p-0",
        )}
        style={{ background: isDragging ? "var(--bg-card-hover)" : "" }}
      >
        <div className="mb-1 flex justify-center">
          <PreviewDragHandle dragHandleProps={dragHandleProps} />
        </div>

        {isEditing ? (
          <div
            id="edit-form-container"
            className={cn(
              "flex flex-col gap-2 pb-2",
              item.type === "action" && "gap-4",
            )}
          >
            {item.type === "chat" ? (
              <EditableChatPreview
                characterName={characterName}
                profileImage={profileImage}
                profileAlt={profileAlt}
                value={editedValue}
                labels={labels}
                onChange={onEditValueChange}
                onCancel={onCancelEdit}
                onConfirm={handleConfirmEdit}
              />
            ) : item.type === "userChat" ? (
              <EditableUserChatPreview
                value={editedValue}
                labels={labels}
                onChange={onEditValueChange}
                onCancel={onCancelEdit}
                onConfirm={handleConfirmEdit}
              />
            ) : (
              <EditableScenarioPreview
                value={editedValue}
                onChange={onEditValueChange}
                onCancel={onCancelEdit}
                onConfirm={handleConfirmEdit}
              />
            )}
          </div>
        ) : (
          <div
            id="view-content-container"
            className={cn(
              "flex",
              item.type === "action" ? "flex-col pb-2" : "items-end gap-2",
              item.type === "userChat" && "justify-end",
              item.type === "asset" && "justify-center pb-2",
            )}
          >
            <div
              className={cn(
                "max-w-[80%]",
                item.type === "userChat" && "order-2",
              )}
            >
              <PreviewContentView
                item={item}
                assetImageAlt={assetImageAlt}
                characterName={characterName}
                profileImage={profileImage}
              />
            </div>

            {isEditable && (
              <div
                className={cn(
                  "flex shrink-0 gap-1 transition-opacity",
                  item.type === "action" && "mt-2 pl-12",
                  item.type === "userChat" && "order-1",
                )}
              >
                <PreviewItemActions
                  item={item}
                  labels={labels}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </div>
            )}
          </div>
        )}
      </article>

      {item.type === "action" && isEditing && (
        <PreviewEditControls
          className="pt-2 text-font-2"
          cancelLabel={labels.cancelEdit}
          confirmLabel={labels.confirmEdit}
          onCancel={onCancelEdit}
          onConfirm={handleConfirmEdit}
        />
      )}
    </div>
  );
};

export default PreviewListItem;
