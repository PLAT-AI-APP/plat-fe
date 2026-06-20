import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { ScenarioContentItem } from "@/type/character";
import EditableChatPreview from "./EditableChatPreview";
import EditableScenarioPreview from "./EditableScenarioPreview";
import PreviewContentView from "./PreviewContentView";
import PreviewDragHandle from "./PreviewDragHandle";
import PreviewEditControls from "./PreviewEditControls";
import PreviewItemActions from "./PreviewItemActions";
import { PreviewEditLabels } from "./types";

interface PreviewListItemProps {
  item: ScenarioContentItem;
  isDragging: boolean;
  isEditing: boolean;
  editedValue: string;
  characterName: string;
  profileImage: string;
  profileAlt: string;
  assetImageAlt: string;
  isEditable: boolean;
  labels: PreviewEditLabels;
  dragHandleProps: DraggableProvidedDragHandleProps | null;
  onEdit: () => void;
  onEditValueChange: (value: string) => void;
  onCancelEdit: () => void;
  onConfirmEdit: () => void;
  onDelete?: () => void;
}

const PreviewListItem = ({
  item,
  isDragging,
  isEditing,
  editedValue,
  characterName,
  profileImage,
  profileAlt,
  assetImageAlt,
  isEditable,
  labels,
  dragHandleProps,
  onEdit,
  onEditValueChange,
  onCancelEdit,
  onConfirmEdit,
  onDelete,
}: PreviewListItemProps) => {
  return (
    <div>
      <article
        className={cn(
          "group relative w-full rounded-2xl",
          item.type === "action" && "px-2 pt-0",
          isEditing && "bg-transparent p-0",
        )}
        style={{ background: isDragging ? "#181C2E" : "" }}
      >
        <div className="mb-1 flex justify-center">
          <PreviewDragHandle dragHandleProps={dragHandleProps} />
        </div>

        {isEditing ? (
          <div
            id="edit-form-container"
            className={cn(
              "flex flex-col gap-2",
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
                onConfirm={onConfirmEdit}
              />
            ) : (
              <EditableScenarioPreview
                value={editedValue}
                onChange={onEditValueChange}
              />
            )}
          </div>
        ) : (
          <div
            id="view-content-container"
            className={cn(
              "flex pb-2",
              item.type === "action" ? "flex-col" : "items-end gap-2",
              item.type === "asset" && "justify-center",
            )}
          >
            <div className="max-w-[80%]">
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
          onConfirm={onConfirmEdit}
        />
      )}
    </div>
  );
};

export default PreviewListItem;
