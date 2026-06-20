import Check from "@/icons/Check";
import { Close } from "@/icons";
import {
  previewCancelButtonClass,
  previewConfirmButtonClass,
} from "./previewButtonStyles";

interface PreviewEditControlsProps {
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  className?: string;
}

const PreviewEditControls = ({
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  className = "",
}: PreviewEditControlsProps) => {
  return (
    <div className={`flex h-fit shrink-0 gap-1 ${className}`}>
      <button
        type="button"
        onClick={onCancel}
        className={previewCancelButtonClass}
        aria-label={cancelLabel}
      >
        <Close className="size-3.5" />
      </button>
      <button
        type="button"
        onClick={onConfirm}
        className={previewConfirmButtonClass}
        aria-label={confirmLabel}
      >
        <Check className="size-3.5" />
      </button>
    </div>
  );
};

export default PreviewEditControls;
