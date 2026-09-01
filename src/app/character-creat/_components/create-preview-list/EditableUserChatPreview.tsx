import { useAutoResizeTextarea } from "@/hooks/useAutoResizeTextarea";
import PreviewEditControls from "./PreviewEditControls";
import { PreviewEditLabels } from "./types";

interface EditableUserChatPreviewProps {
  value: string;
  labels: Pick<PreviewEditLabels, "cancelEdit" | "confirmEdit">;
  onChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

const EditableUserChatPreview = ({
  value,
  labels,
  onChange,
  onCancel,
  onConfirm,
}: EditableUserChatPreviewProps) => {
  const { textareaRef } = useAutoResizeTextarea({ value });

  return (
    <div className="flex items-end justify-end gap-3">
      <PreviewEditControls
        cancelLabel={labels.cancelEdit}
        confirmLabel={labels.confirmEdit}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />

      <div className="flex min-w-0 max-w-[80%] items-center rounded-[16px_0px_16px_16px] bg-brand-opacity-2 p-2.5">
        <textarea
          ref={textareaRef}
          autoFocus
          rows={1}
          className="body-4 min-h-11 w-full resize-none overflow-hidden rounded-xl border border-main bg-darker px-4 py-3 text-font-1 outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default EditableUserChatPreview;
