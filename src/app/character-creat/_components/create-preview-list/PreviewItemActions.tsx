import { Pen, Trash } from "@/icons";
import { ScenarioContentItem } from "@/type/character";
import { previewActionButtonClass } from "./previewButtonStyles";
import { PreviewEditLabels } from "./types";

interface PreviewItemActionsProps {
  item: ScenarioContentItem;
  labels: Pick<PreviewEditLabels, "editContent" | "deleteContent">;
  onEdit: () => void;
  onDelete?: () => void;
}

const PreviewItemActions = ({
  item,
  labels,
  onEdit,
  onDelete,
}: PreviewItemActionsProps) => {
  return (
    <>
      {item.type !== "asset" && (
        <button
          type="button"
          onClick={onEdit}
          className={previewActionButtonClass}
          aria-label={labels.editContent}
        >
          <Pen className="size-3.5 text-font-2" />
        </button>
      )}

      {item.type !== "chat" && (
        <button
          type="button"
          onClick={onDelete}
          className={previewActionButtonClass}
          aria-label={labels.deleteContent}
        >
          <Trash className="size-3.5 text-font-2" />
        </button>
      )}
    </>
  );
};

export default PreviewItemActions;
