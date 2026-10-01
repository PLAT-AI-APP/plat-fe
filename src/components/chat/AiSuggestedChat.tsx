import React from "react";
import { useTranslations } from "next-intl";
import ActionText from "@/components/chat/ActionText";
import { Pen } from "@/icons";

interface AiSuggestedChatProps {
  /** 서버가 응답 끝에 함께 보낸 추천 문장. 비어 있으면 아무것도 그리지 않는다. */
  items: string[];
  /** 고른 문장을 입력창에 넣는다. 바로 보내지는 않아 사용자가 고쳐 쓸 수 있다. */
  onSelect: (text: string) => void;
}

const AiSuggestedChat = ({ items, onSelect }: AiSuggestedChatProps) => {
  const t = useTranslations();

  if (items.length === 0) return null;

  return (
    <section className="flex gap-5" aria-label={t("chatUI.suggestedReply")}>
      <Pen size={24} className="size-6 shrink-0 text-font-2" />

      <ul className="flex w-full max-w-[500px] flex-col gap-2">
        {items.map((item, index) => (
          <li key={`${index}-${item}`}>
            <button
              type="button"
              onClick={() => onSelect(item)}
              className="body-5 w-full cursor-pointer rounded-2xl bg-btn-hover px-3 py-4 text-left text-font-1 transition-colors hover:bg-btn-selected"
            >
              {/* 추천 문장도 대사 안에 괄호 동작이 섞여 올 수 있어 말풍선과 같은 규칙으로 그린다. */}
              <ActionText text={item} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AiSuggestedChat;
