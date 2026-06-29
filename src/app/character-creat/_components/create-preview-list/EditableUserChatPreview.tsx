import { useEffect, useRef } from "react";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // 사용자 대사 수정 영역은 입력 길이에 맞춰 늘어나 내부 스크롤을 만들지 않습니다.
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  return (
    <div className="flex items-end justify-end gap-3">
      <PreviewEditControls
        cancelLabel={labels.cancelEdit}
        confirmLabel={labels.confirmEdit}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />

      <div className="flex min-w-0 max-w-[80%] items-center rounded-[16px_0px_16px_16px] bg-[#B25500] p-2.5">
        <textarea
          ref={textareaRef}
          autoFocus
          rows={1}
          className="body-4 min-h-11 w-full resize-none overflow-hidden rounded-xl border border-border-main bg-bg-darker px-4 py-3 text-font-1 outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default EditableUserChatPreview;
