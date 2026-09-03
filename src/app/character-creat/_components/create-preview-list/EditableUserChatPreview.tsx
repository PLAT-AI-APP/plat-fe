import type { KeyboardEvent } from "react";
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

  // 엔터는 확정, esc는 취소, 쉬프트+엔터는 줄바꿈으로 동작합니다.
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onCancel();
      return;
    }

    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      onConfirm();
    }
  };

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
          className="focus-ring-none body-4 min-h-11 w-full resize-none overflow-hidden rounded-xl border border-main bg-darker px-4 py-3 text-font-1 outline-none transition-colors focus:field-focus!"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={(e) => e.target.select()}
        />
      </div>
    </div>
  );
};

export default EditableUserChatPreview;
