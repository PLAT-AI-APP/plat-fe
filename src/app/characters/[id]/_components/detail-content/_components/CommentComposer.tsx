"use client";

import type {
  FocusEvent,
  KeyboardEvent,
} from "react";
import { cn } from "@/lib/utils";
import { COMMENT_MAX_LENGTH } from "@/constants/comment";

interface CommentComposerProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onFocus?: (event: FocusEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  submitLabel: string;
  cancelLabel?: string;
  canSubmit: boolean;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  textareaClassName?: string;
}

/** 댓글 작성/수정/답글 입력창. 셋 다 같은 테두리 박스 + textarea + 제출 버튼 구조를 공유합니다. */
const CommentComposer = ({
  value,
  onChange,
  onKeyDown,
  onFocus,
  onSubmit,
  onCancel,
  submitLabel,
  cancelLabel,
  canSubmit,
  placeholder,
  disabled = false,
  autoFocus = false,
  className,
  textareaClassName,
}: CommentComposerProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-end gap-1 rounded-2xl border border-main bg-btn-hover px-3 py-2 transition-colors focus-within:field-focus!",
        className,
      )}
    >
      <textarea
        autoFocus={autoFocus}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        disabled={disabled}
        maxLength={COMMENT_MAX_LENGTH}
        placeholder={placeholder}
        className={cn(
          "focus-ring-none body-5 min-h-9 w-full resize-none bg-transparent text-font-1 outline-none placeholder:text-font-disabled disabled:cursor-default",
          textareaClassName,
        )}
      />

      <div className="flex gap-2">
        {onCancel && cancelLabel && (
          <button
            type="button"
            onClick={onCancel}
            className="body-5 rounded-xl px-4 py-1.5 text-font-2 transition-colors hover:text-font-1"
          >
            {cancelLabel}
          </button>
        )}
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="body-5 rounded-xl bg-main px-4 py-1.5 text-font-1 transition-colors hover:bg-btn-selected disabled:cursor-not-allowed disabled:text-font-disabled"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
};

export default CommentComposer;
