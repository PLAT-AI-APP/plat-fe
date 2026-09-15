import { useEffect, useState } from "react";
import { useTextareaSubmitShortcuts } from "./useTextareaSubmitShortcuts";

interface UseInlineTextEditOptions {
  /** 편집 대상 원본 값. 바뀌면(다른 항목으로 교체 등) 편집 중인 값도 함께 동기화합니다. */
  value: string;
  onSubmit?: (value: string) => void;
}

/**
 * 말풍선/미리보기 항목을 그 자리에서 바로 고치는 인라인 편집 상태.
 * isEditing 토글, 편집 중인 값, 취소 시 원본 복원, Enter 제출/Esc 취소 단축키를
 * 한 곳에서 관리합니다.
 */
export const useInlineTextEdit = ({
  value,
  onSubmit,
}: UseInlineTextEditOptions) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const startEditing = () => setIsEditing(true);

  const handleSubmit = () => {
    onSubmit?.(draft);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(value);
    setIsEditing(false);
  };

  const { handleKeyDown, handleFocus } = useTextareaSubmitShortcuts({
    onSubmit: handleSubmit,
    onCancel: handleCancel,
  });

  return {
    isEditing,
    draft,
    setDraft,
    startEditing,
    handleSubmit,
    handleCancel,
    handleKeyDown,
    handleFocus,
  };
};
