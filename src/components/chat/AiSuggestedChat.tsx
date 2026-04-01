import { Pen } from "@/icons";
import React from "react";
const MOCK_AI_RESPONSES = [
  {
    id: "resp-01",
    quote: "조금만 참아, 거의 다 왔어. 절대 손 놓지 마.",
    narration: "나는 빗줄기를 뚫고 거칠게 숨을 내쉬며 그녀를 등에 업고 달렸다.",
    fullText: '"조금만 참아, 거의 다 왔어. 절대 손 놓지 마."',
  },
  {
    id: "resp-02",
    quote: "창문은 다 잠갔어? 아까부터 밖에서 누가 지켜보고 있는 것 같아.",
    narration: "나는 떨리는 손으로 커튼을 굳게 치고 숨죽여 창밖을 응시했다.",
    fullText: '"창문은 다 잠갔어? 아까부터 밖에서 누가 지켜보고 있는 것 같아."',
  },
  {
    id: "resp-03",
    quote: "미안해, 이렇게 될 줄 알았으면서도... 널 놓칠 수가 없었어.",
    narration:
      "나는 고개를 숙인 채 차마 그녀의 얼굴을 보지 못하고 젖은 입술만 깨물었다.",
    fullText: '"미안해, 이렇게 될 줄 알았으면서도... 널 놓칠 수가 없었어."',
  },
];
const AiSuggestedChat = () => {
  return (
    <section className="flex gap-5">
      <Pen className="text-font-2 w-7 h-7 shrink-0" />
      <ul className="flex flex-col gap-2.25">
        {MOCK_AI_RESPONSES.map((res) => (
          <li
            key={res.id}
            className="cursor-pointer rounded-2xl text-sm font-medium px-3 py-4 bg-btn-hover hover:bg-btn-selected"
          >
            <span>{res.fullText}</span>{" "}
            <span className="text-font-2"> {`${res.narration}`}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AiSuggestedChat;
