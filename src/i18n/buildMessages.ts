import { CHARACTER_CREATE_MESSAGES_BY_LOCALE } from "@/i18n/characterCreateMessages";
import { CHAT_ROOM_MESSAGES_BY_LOCALE } from "@/i18n/chatRoomMessages";
import type { AppLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { MODAL_MESSAGES_BY_LOCALE } from "@/i18n/modalMessages";
import { RUNTIME_MESSAGES_BY_LOCALE } from "@/i18n/runtimeMessages";
import { STUDIO_MESSAGES_BY_LOCALE } from "@/i18n/studioMessages";
import { UI_MESSAGES_BY_LOCALE } from "@/i18n/uiMessages";

type MessageTree = Record<string, unknown>;

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
 * 로케일별로 한 번만 계산한다.
 *
 * 예전에는 이 5중 병합이 IntlProvider 의 렌더 본문에 그대로 있었다.
 * IntlProvider 는 앱 트리 전체를 감싸므로, 상위가 리렌더될 때마다 메시지
 * 6,400줄(약 292KB)을 통째로 깊은 병합했다. 결과물은 locale 이 같으면 항상
 * 같은데도 그랬다.
 *
 * useMemo 대신 모듈 수준 캐시를 쓰는 이유는, 그래야 컴포넌트가 다시 마운트돼도
 * 다시 계산하지 않고 서버(request.ts)와도 같은 계산을 공유하기 때문이다.
 * 언어는 여섯 개뿐이라 캐시가 무한정 자라지 않는다.
 */
const cache = new Map<AppLocale, MessageTree>();

export const buildMessages = (locale: AppLocale): MessageTree => {
  const cached = cache.get(locale);
  if (cached) return cached;

  const messages = mergeMessages(
    mergeMessages(
      mergeMessages(
        mergeMessages(
          mergeMessages(
            getMessages(locale) as MessageTree,
            RUNTIME_MESSAGES_BY_LOCALE[locale] as MessageTree,
          ),
          UI_MESSAGES_BY_LOCALE[locale] as MessageTree,
        ),
        STUDIO_MESSAGES_BY_LOCALE[locale] as MessageTree,
      ),
      CHARACTER_CREATE_MESSAGES_BY_LOCALE[locale] as MessageTree,
    ),
    mergeMessages(
      CHAT_ROOM_MESSAGES_BY_LOCALE[locale] as MessageTree,
      MODAL_MESSAGES_BY_LOCALE[locale] as MessageTree,
    ),
  );

  cache.set(locale, messages);
  return messages;
};
