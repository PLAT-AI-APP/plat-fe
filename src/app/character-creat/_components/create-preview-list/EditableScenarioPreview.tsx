import type { KeyboardEvent } from "react";

interface EditableScenarioPreviewProps {
  value: string;
  onChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

const EditableScenarioPreview = ({
  value,
  onChange,
  onCancel,
  onConfirm,
}: EditableScenarioPreviewProps) => {
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
    // Scenario text is edited as a full-width block to match the preview canvas.
    <div className="flex flex-1 gap-2 rounded-2xl bg-card p-3">
      <textarea
        autoFocus
        rows={5}
        className="focus-ring-none body-4 min-h-[152px] w-full resize-none rounded-xl border border-main bg-darker px-4 py-3 text-font-1 outline-none transition-colors focus:field-focus!"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={(e) => e.target.select()}
      />
    </div>
  );
};

export default EditableScenarioPreview;
