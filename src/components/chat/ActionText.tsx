import React from "react";
import { splitActionSegments } from "@/lib/chatText";

/**
 * 대사 한 줄. 말하며 하는 동작 `(…)`·`*…*` 은 같은 줄에 두되 나레이션 글자 색으로 구분한다.
 * 말풍선 안의 동작은 나레이션 박스로 따로 빼므로(splitDialogueActions), 이 컴포넌트는 한 덩어리로 보여 줘야 하는
 * 추천 답변 버튼에서만 쓴다. 동작이 없으면 문자열 그대로 둔다.
 */
const ActionText = ({ text }: { text: string }) => {
  const segments = splitActionSegments(text);
  if (!segments.some((segment) => segment.type === "action")) return text;

  // 대사 조각은 원문의 공백·줄바꿈을 그대로 들고 있어 따로 띄우지 않는다.
  return segments.map((segment, index) =>
    segment.type === "action" ? (
      <span key={index} className="text-narration">
        ({segment.value})
      </span>
    ) : (
      <React.Fragment key={index}>{segment.value}</React.Fragment>
    ),
  );
};

export default ActionText;
