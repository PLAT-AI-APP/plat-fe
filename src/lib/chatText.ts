export interface ChatTextSegment {
  type: "text" | "action";
  value: string;
}

/**
 * 캐릭터 대사 안에서 말하며 하는 짧은 동작·표정. 예: 비가 많이 오네요 (젖은 어깨를 털어내며)
 *
 * - 괄호 `(…)`·전각 괄호 `（…）`: AI 대화 규칙(UNIVERSE_CHAT)이 쓰는 표기다. 한 줄 안의 짧은 구절만 본다 —
 *   줄을 넘거나 60자를 넘는 괄호는 설명·인용일 가능성이 커서 대사 글자로 둔다.
 * - 별표 `*…*`·`**…**`: 예전 표기다. 이미 쓰인 대사를 위해 계속 받는다. 별표 안쪽 가장자리가 공백이나 별표이면
 *   행동으로 보지 않는다 — 곱셈 "2 * 3 * 4" 나 비어 있는 "****" 가 행동으로 바뀌지 않게 하려는 것이다.
 */
const ACTION_PATTERN =
  /\(([^()\n]{1,60})\)|（([^（）\n]{1,60})）|(\*{1,2})([^\s*](?:[\s\S]*?[^\s*])?)\3/g;

/**
 * 캐릭터 대사를 일반 대사와 행동으로 나눈다. 순서는 그대로 두고 괄호·별표는 값에서 뺀다.
 * 짝이 없는 괄호·별표는 행동으로 보지 않고 글자 그대로 둔다 — 받는 중인 문장이 통째로 행동 색으로 바뀌지 않게 하려는 것이다.
 */
export const splitActionSegments = (text: string): ChatTextSegment[] => {
  const segments: ChatTextSegment[] = [];
  let cursor = 0;

  for (const match of text.matchAll(ACTION_PATTERN)) {
    const matchStart = match.index ?? 0;
    const before = text.slice(cursor, matchStart).trim();
    const action = (match[1] ?? match[2] ?? match[4] ?? "").trim();

    if (before) segments.push({ type: "text", value: before });
    if (action) segments.push({ type: "action", value: action });

    cursor = matchStart + match[0].length;
  }

  const rest = text.slice(cursor).trim();
  if (rest) segments.push({ type: "text", value: rest });

  return segments;
};
