import Image from "next/image";
import type { KeyboardEvent } from "react";
import { useAutoResizeTextarea } from "@/hooks/useAutoResizeTextarea";
import PreviewEditControls from "./PreviewEditControls";
import { PreviewEditLabels } from "./types";

interface EditableChatPreviewProps {
  characterName: string;
  profileImage: string;
  profileAlt: string;
  value: string;
  labels: Pick<PreviewEditLabels, "cancelEdit" | "confirmEdit">;
  onChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

const EditableChatPreview = ({
  characterName,
  profileImage,
  profileAlt,
  value,
  labels,
  onChange,
  onCancel,
  onConfirm,
}: EditableChatPreviewProps) => {
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
    <div className="flex items-end gap-3">
      <Image
        src={profileImage}
        alt={profileAlt}
        width={40}
        height={40}
        className="h-10 w-10 self-start rounded-full"
      />
      <div className="body-4 min-w-0 flex-1">
        <span className="body-4 block text-font-1">{characterName}</span>
        <div className="mt-1.5 flex items-center rounded-[0px_16px_16px_16px] bg-card p-2.5">
          <textarea
            ref={textareaRef}
            autoFocus
            rows={1}
            className="focus-ring-none body-4 min-h-11 w-full resize-none overflow-hidden rounded-xl border border-main bg-darker px-4 py-3 text-font-1 outline-none transition-colors focus:field-focus!"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      <PreviewEditControls
        cancelLabel={labels.cancelEdit}
        confirmLabel={labels.confirmEdit}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    </div>
  );
};

export default EditableChatPreview;
