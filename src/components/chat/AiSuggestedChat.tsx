import React from "react";
import { useTranslations } from "next-intl";
import { Pen } from "@/icons";

/** 추천 답변 API 연동 전 임시 문구. 문장은 언어별 메시지(chatUI.sampleReply*)에서 가져온다. */
const MOCK_AI_RESPONSES = [
  {
    id: "resp-01",
    quoteKey: "chatUI.sampleReply1Quote",
    narrationKey: "chatUI.sampleReply1Narration",
  },
  {
    id: "resp-02",
    quoteKey: "chatUI.sampleReply2Quote",
    narrationKey: "chatUI.sampleReply2Narration",
  },
  {
    id: "resp-03",
    quoteKey: "chatUI.sampleReply3Quote",
    narrationKey: "chatUI.sampleReply3Narration",
  },
] as const;

const AiSuggestedChat = () => {
  const t = useTranslations();

  return (
    <section className="flex gap-5">
      <Pen size={24} className="size-6 shrink-0 text-font-2" />

      <ul className="flex w-full max-w-[500px] flex-col gap-2">
        {MOCK_AI_RESPONSES.map((res, index) => (
          <li
            key={res.id}
            className="body-5 cursor-pointer rounded-2xl bg-btn-hover px-3 py-4 text-font-1 transition-colors hover:bg-btn-selected"
          >
            <span>{`"${t(res.quoteKey)}"`}</span>{" "}
            <span className="text-font-2">{t(res.narrationKey)}</span>
            {index === 0 && (
              <span className="sr-only">
                {t("chatUI.selectedSuggestedReply")}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AiSuggestedChat;
