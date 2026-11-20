/**
 * 답변 추천.
 *
 * 서버는 추천을 채팅 답변과 별도로 생성해 `recommendations` SSE 이벤트로 보낸다.
 *   event: recommendations
 *   data: {"items":["...","...","..."]}
 * 본문 토큰에는 섞이지 않으므로 화면에서 따로 잘라낼 것이 없다.
 */

/**
 * `recommendations` 이벤트의 data 에서 추천 문장을 꺼낸다. 모양이 깨졌으면 빈 배열이다 —
 * 추천은 덤이라, 파싱에 실패했다고 응답 자체를 실패로 만들지 않는다.
 */
export const parseRecommendations = (data: string): string[] => {
  try {
    const parsed: unknown = JSON.parse(data);
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
