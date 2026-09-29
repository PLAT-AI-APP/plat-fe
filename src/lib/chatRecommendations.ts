/**
 * 답변 추천 블록.
 *
 * 서버는 추천을 따로 된 SSE 이벤트가 아니라 응답 맨 뒤에 일반 토큰으로 흘려보낸다.
 *   ...본문...<recommendations>{"items":["...","...","..."]}</recommendations>
 * 저장되는 본문에서는 서버가 이 블록을 떼므로, 화면도 받는 즉시 떼고 말풍선에 그리지 않는다.
 */
const START_TAG = "<recommendations>";
const END_TAG = "</recommendations>";

/**
 * 받는 중인 글에서 보여 줄 본문만 잘라낸다.
 *
 * 태그가 한 번에 오지 않고 `<recomm` 처럼 잘려 도착하는 동안에도 말풍선 끝에 꺾쇠가 비치지 않게,
 * 끝이 여는 태그의 앞부분이면 거기서 함께 자른다.
 */
export const stripRecommendationBlock = (text: string) => {
  const tagIndex = text.indexOf(START_TAG);
  if (tagIndex !== -1) return text.slice(0, tagIndex).trimEnd();

  const lastBracket = text.lastIndexOf("<");
  if (lastBracket !== -1 && START_TAG.startsWith(text.slice(lastBracket))) {
    return text.slice(0, lastBracket).trimEnd();
  }

  return text;
};

/**
 * 다 받은 응답에서 추천 문장을 꺼낸다. 블록이 없거나(설정이 꺼져 있다) 모양이 깨졌으면 빈 배열이다 —
 * 추천은 덤이라, 파싱에 실패했다고 응답 자체를 실패로 만들지 않는다.
 */
export const parseRecommendations = (text: string): string[] => {
  const startIndex = text.indexOf(START_TAG);
  if (startIndex === -1) return [];

  const jsonStart = startIndex + START_TAG.length;
  const endIndex = text.indexOf(END_TAG, jsonStart);
  const json = text.slice(jsonStart, endIndex === -1 ? undefined : endIndex);

  try {
    const parsed: unknown = JSON.parse(json);
    const items = (parsed as { items?: unknown })?.items;
    if (!Array.isArray(items)) return [];

    return items
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
};
