"use client";

import { FormEvent, Ref, memo, useCallback, useImperativeHandle, useState } from "react";
import { useTranslations } from "next-intl";
import { Asterisk, MoveUp } from "@/icons";
import { useAutoResizeTextarea } from "@/hooks/form/useAutoResizeTextarea";
import { useTextareaSubmitShortcuts } from "@/hooks/form/useTextareaSubmitShortcuts";
import { cn } from "@/lib/utils";
import ActiveButton from "../ActiveButton";

/** 서버 POST /chat 의 message 최대 길이와 같아야 한다. */
const CHAT_MESSAGE_MAX_LENGTH = 4000;
/** 이만큼 쓰면 남은 글자 수를 보여 준다. 짧은 대화 중에는 숫자가 거슬리지 않게 숨긴다. */
const CHAT_MESSAGE_COUNTER_FROM = 3500;

export interface ChatFormHandle {
  /** 보내지 못한 글을 입력창에 되돌린다. 그 사이 새로 쓴 글이 있으면 덮어쓰지 않는다. */
  restore: (message: string) => void;
}

interface ChatFormProps {
  ref?: Ref<ChatFormHandle>;
  /** 전송을 받아들이지 않으면(false) 입력한 글을 지우지 않고 그대로 둡니다. */
  onSendMessage: (message: string) => boolean | void;
  /** 응답을 받는 중처럼 지금은 보낼 수 없을 때. 글은 계속 쓸 수 있습니다. */
  disabled?: boolean;
  /** 방 정보·모델을 아직 받는 중이라 보낼 수 없을 때. 버튼에 대기 표시를 한다. */
  isPreparing?: boolean;
}

const ChatForm = ({
  ref,
  onSendMessage,
  disabled = false,
  isPreparing = false,
}: ChatFormProps) => {
  const t = useTranslations();
  const [msg, setMsg] = useState("");
  const hasMessage = msg.trim().length > 0;
  const { textareaRef, resizeTextarea } = useAutoResizeTextarea({
    maxRows: 5,
    value: msg,
  });

  useImperativeHandle(
    ref,
    () => ({
      restore: (message) => {
        setMsg((current) => (current.trim() ? current : message));
        requestAnimationFrame(resizeTextarea);
      },
    }),
    [resizeTextarea],
  );

  const submitMessage = useCallback(() => {
    if (!hasMessage || disabled) return;

    if (onSendMessage(msg) === false) return;

    setMsg("");
    requestAnimationFrame(resizeTextarea);
  }, [hasMessage, disabled, msg, onSendMessage, resizeTextarea]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitMessage();
  };

  const { handleKeyDown: handleTextareaKeyDown } = useTextareaSubmitShortcuts({
    onSubmit: submitMessage,
    newlineOnTouch: true,
  });

  const handleSituationInsert = () => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const selectedText = msg.slice(selectionStart, selectionEnd);
    const hasSelectedText = selectedText.length > 0;
    const nextMessage = hasSelectedText
      ? `${msg.slice(0, selectionStart)}*${selectedText}*${msg.slice(selectionEnd)}`
      : `${msg.slice(0, selectionStart)}**${msg.slice(selectionEnd)}`;
    const nextSelectionStart = selectionStart + 1;
    const nextSelectionEnd = hasSelectedText
      ? nextSelectionStart + selectedText.length
      : nextSelectionStart;

    setMsg(nextMessage);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(nextSelectionStart, nextSelectionEnd);
      resizeTextarea();
    });
  };

  return (
    <form className="shrink-0" onSubmit={handleSubmit}>
      <fieldset
        id="chat-input-container"
        className="flex items-end gap-3 rounded-3xl border border-dark bg-darker px-4 py-3 transition-colors focus-within:field-focus!"
      >
        <legend className="sr-only">{t("chatUI.messageForm")}</legend>

        <textarea
          ref={textareaRef}
          value={msg}
          onChange={(event) => setMsg(event.target.value)}
          onKeyDown={handleTextareaKeyDown}
          maxLength={CHAT_MESSAGE_MAX_LENGTH}
          placeholder={t("chatUI.messagePlaceholder")}
          rows={1}
          className="focus-ring-none body-5 custom-scrollbar min-h-[21px] flex-1 resize-none bg-transparent py-1.5 text-font-1 outline-none placeholder:text-font-disabled"
        />

        <footer className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={handleSituationInsert}
            className="body-5 flex h-8 items-center justify-center gap-1.5 rounded-full border border-main bg-card/50 py-1.5 pl-2.5 pr-3 text-font-2 transition-colors hover:bg-btn-hover"
          >
            <Asterisk className="size-4" />
            {t("chatUI.situation")}
          </button>

          <ActiveButton
            // 쓴 글이 없거나 응답을 받는 중이면 눌러도 소용이 없으니 활성처럼 보이지 않게 한다.
            isActive={hasMessage && !disabled && !isPreparing}
            isPending={isPreparing}
            aria-label={t("chatUI.send")}
            text=""
            type="submit"
            className="flex size-8.5 items-center justify-center rounded-full p-0"
          >
            <MoveUp className="size-6" />
          </ActiveButton>
        </footer>
      </fieldset>
      {msg.length >= CHAT_MESSAGE_COUNTER_FROM && (
        <p
          aria-live="polite"
          className={cn(
            "body-8 mt-2 text-right",
            msg.length >= CHAT_MESSAGE_MAX_LENGTH
              ? "text-font-accents"
              : "text-font-2",
          )}
        >
          {msg.length}/{CHAT_MESSAGE_MAX_LENGTH}
        </p>
      )}
      {/* AI 기본법 제31조: 생성형 AI 결과물임을 이용자가 알 수 있게 대화 화면에 늘 표시한다. */}
      <p className="body-8 mt-2 text-center text-font-disabled">
        {t("chatUI.aiGeneratedNotice")}
      </p>
    </form>
  );
};

// 스트리밍 중 방 화면이 프레임마다 다시 그려져도 입력창은 props 가 같으면 건너뛴다.
export default memo(ChatForm);
