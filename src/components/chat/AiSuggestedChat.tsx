import React from "react";
import { useTranslations } from "next-intl";
import { Pen } from "@/icons";

const MOCK_AI_RESPONSES = [
  {
    id: "resp-01",
    quote: "응, 바로 닫을게. 괜찮아, 아무도 못 봐.",
    narration: "나는 재빨리 문을 닫고 잠금장치를 다시 걸었다.",
  },
  {
    id: "resp-02",
    quote: "잠깐만, 지금은 여기 있는 게 더 안전해.",
    narration: "작게 숨을 고른 뒤 상대의 팔목을 조심스럽게 잡았다.",
  },
  {
    id: "resp-03",
    quote: "미안해. 이런 식으로 마주치게 될 줄은 몰랐어.",
    narration: "시선을 피한 채 낮은 목소리로 말을 이었다.",
  },
];

const AiSuggestedChat = () => {
  const t = useTranslations();

  return (
    <section className="flex gap-5">
      <Pen size={24} className="size-6 shrink-0 text-font-2" />

      <ul className="flex w-full max-w-[500px] flex-col gap-[9px]">
        {MOCK_AI_RESPONSES.map((res, index) => (
          <li
            key={res.id}
            className="body-4 cursor-pointer rounded-2xl bg-btn-hover px-3 py-4 text-font-1 transition-colors hover:bg-btn-selected"
          >
            <span>{`"${res.quote}"`}</span>{" "}
            <span className="text-font-2">{res.narration}</span>
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
