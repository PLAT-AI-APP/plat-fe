import { useCallback } from "react";
import type { FocusEvent, KeyboardEvent } from "react";

interface UseTextareaSubmitShortcutsOptions {
  onSubmit: () => void;
  /** 되돌릴 원래 값이 있는 "수정" 자리에서만 넘깁니다. 새로 작성하는 자리는 취소할 게 없어 생략합니다. */
  onCancel?: () => void;
}

/**
 * textarea의 제출/취소 단축키 공통 동작입니다. 기존 값을 고쳐 쓰는 곳,
 * 새로 작성해 등록하는 곳 모두에 씁니다.
 * Enter는 제출, Shift+Enter는 줄바꿈으로 동작하고, onCancel을 넘긴 경우에만
 * Esc가 취소로 동작합니다. 포커스가 들어오면 기존 값을 전체 선택해 바로
 * 다시 타이핑할 수 있게 합니다(빈 textarea에서는 아무 효과 없음).
 * (Shift+Enter=줄바꿈이 의미 없는 <input>에는 쓰지 않습니다.)
 */
export const useTextareaSubmitShortcuts = ({
  onSubmit,
  onCancel,
}: UseTextareaSubmitShortcutsOptions) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Escape" && onCancel) {
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
        onSubmit();
      }
    },
    [onCancel, onSubmit],
  );

  const handleFocus = useCallback((event: FocusEvent<HTMLTextAreaElement>) => {
    event.target.select();
  }, []);

  return { handleKeyDown, handleFocus };
};
