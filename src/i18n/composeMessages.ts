export type MessageTree = Record<string, unknown>;

interface MessageParts {
  base: MessageTree;
  runtime: MessageTree;
  ui: MessageTree;
  studio: MessageTree;
  characterCreate: MessageTree;
  chatRoom: MessageTree;
  modal: MessageTree;
}

/**
 * 번역 파일을 여러 소스에서 합칠 때는 같은 namespace 를 재귀적으로 병합해
 * 기존 메시지를 덮어쓰지 않고 필요한 키만 확장합니다.
 */
const mergeMessages = (base: MessageTree, extra: MessageTree): MessageTree => {
  const merged = { ...base };

  Object.entries(extra).forEach(([key, value]) => {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      merged[key] &&
      typeof merged[key] === "object" &&
      !Array.isArray(merged[key])
    ) {
      merged[key] = mergeMessages(merged[key] as MessageTree, value as MessageTree);
      return;
    }

    merged[key] = value;
  });

  return merged;
};

/**
 * 한 언어의 도메인별 번역을 next-intl 이 쓰는 트리 하나로 합칩니다.
 * 언어별 진입점(locales/<언어>.ts)이 모듈을 불러올 때 한 번만 계산합니다.
 */
export const composeMessages = (parts: MessageParts): MessageTree =>
  mergeMessages(
    mergeMessages(
      mergeMessages(
        mergeMessages(mergeMessages(parts.base, parts.runtime), parts.ui),
        parts.studio,
      ),
      parts.characterCreate,
    ),
    mergeMessages(parts.chatRoom, parts.modal),
  );
