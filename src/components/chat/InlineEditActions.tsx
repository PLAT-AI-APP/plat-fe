import { Close } from "@/icons";
import Check from "@/icons/Check";

interface InlineEditActionsProps {
  onCancel: () => void;
  onConfirm: () => void;
}

/** 채팅 말풍선 인라인 편집의 취소/확인 아이콘 버튼 쌍. */
const InlineEditActions = ({ onCancel, onConfirm }: InlineEditActionsProps) => {
  return (
    <div className="flex h-fit shrink-0 gap-1 text-font-2">
      <button
        type="button"
        onClick={onCancel}
        className="flex items-center justify-center rounded-lg p-1.5 hover:bg-btn-hover"
      >
        <Close className="size-4" />
      </button>
      <button
        type="button"
        onClick={onConfirm}
        className="flex items-center justify-center rounded-lg p-1.5 hover:bg-btn-hover"
      >
        <Check className="size-4" />
      </button>
    </div>
  );
};

export default InlineEditActions;
