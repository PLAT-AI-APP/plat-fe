import React from "react";
import { splitActionSegments } from "@/lib/chatText";

/**
 * 대사 한 줄. 말하며 하는 동작 `(…)`·`*…*` 은 같은 줄에 두되 한 단계 흐린 색·기울임으로 구분한다.
 * 캐릭터 대사와 사용자 말이 같은 규칙으로 보이도록 두 말풍선이 함께 쓴다.
 * 동작이 없으면 문자열 그대로 둬 다른 말풍선의 모양이 바뀌지 않는다.
 */
const ActionText = ({ text }: { text: string }) => {
  const segments = splitActionSegments(text);
  if (!segments.some((segment) => segment.type === "action")) return text;

  return segments.map((segment, index) => (
    <React.Fragment key={index}>
      {/* 조각 사이는 한 칸 띄운다. 괄호 뒤에 바로 오는 마침표·물음표 같은 문장부호 앞은 띄우지 않는다. */}
      {index > 0 && !/^[.,!?…~。、！？]/.test(segment.value) && " "}
      {segment.type === "action" ? (
        <span className="text-font-2 italic">({segment.value})</span>
      ) : (
        segment.value
      )}
    </React.Fragment>
  ));
};

export default ActionText;
