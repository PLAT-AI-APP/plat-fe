export interface ChatTextSegment {
  type: "text" | "action";
  value: string;
}

/**
 * 캐릭터 대사 안에서 행동을 나타내는 표기. 예: 안녕! *손을 흔든다*
 *
 * `*행동*` 과 `**행동**` 을 모두 받는다. 별표 안쪽 가장자리가 공백이나 별표이면 행동으로 보지 않는다 —
 * 곱셈 "2 * 3 * 4" 나 비어 있는 "****" 같은 글자가 행동으로 바뀌지 않게 하려는 것이다.
 */
const ACTION_PATTERN = /(\*{1,2})([^\s*](?:[\s\S]*?[^\s*])?)\1/g;

/**
 * 캐릭터 대사를 일반 대사와 행동으로 나눈다. 별표로 감싼 부분이 행동이다.
 *
 * 순서는 그대로 유지하고 별표는 값에서 뺀다. 감싸지 않은 짝 없는 별표는 행동으로
 * 보지 않고 글자 그대로 둔다 — 입력 도중의 문장이 통째로 행동 색으로 바뀌지 않게 하려는 것이다.
 */
export const splitActionSegments = (text: string): ChatTextSegment[] => {
  const segments: ChatTextSegment[] = [];
  let cursor = 0;

  for (const match of text.matchAll(ACTION_PATTERN)) {
    const matchStart = match.index ?? 0;
    const before = text.slice(cursor, matchStart).trim();
    const action = match[2].trim();

    if (before) segments.push({ type: "text", value: before });
    if (action) segments.push({ type: "action", value: action });

    cursor = matchStart + match[0].length;
  }

  const rest = text.slice(cursor).trim();
  if (rest) segments.push({ type: "text", value: rest });

  return segments;
};
