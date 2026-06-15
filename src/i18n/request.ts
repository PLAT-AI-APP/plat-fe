import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { CHARACTER_CREATE_MESSAGES_BY_LOCALE } from "@/i18n/characterCreateMessages";
import { CHAT_ROOM_MESSAGES_BY_LOCALE } from "@/i18n/chatRoomMessages";
import { getMessages } from "@/i18n/messages";
import { MODAL_MESSAGES_BY_LOCALE } from "@/i18n/modalMessages";
import { RUNTIME_MESSAGES_BY_LOCALE } from "@/i18n/runtimeMessages";
import { STUDIO_MESSAGES_BY_LOCALE } from "@/i18n/studioMessages";
import { UI_MESSAGES_BY_LOCALE } from "@/i18n/uiMessages";

const mergeMessages = (
  base: Record<string, unknown>,
  extra: Record<string, unknown>,
) => {
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
      // next-intl 요청 설정에서도 클라이언트와 같은 메시지 병합 규칙을 유지합니다.
      merged[key] = mergeMessages(
        merged[key] as Record<string, unknown>,
        value as Record<string, unknown>,
      );
      return;
    }

    merged[key] = value;
  });

  return merged;
};

export default getRequestConfig(async () => {
  // 현재 앱의 실제 언어 전환은 클라이언트 store가 담당하므로,
  // 서버 기본 렌더에서는 안전한 기본 언어를 제공해 next-intl 설정 요구사항을 충족합니다.
  const locale = DEFAULT_LOCALE;
  const messages = mergeMessages(
    mergeMessages(
      mergeMessages(
        mergeMessages(
          mergeMessages(
            getMessages(locale) as Record<string, unknown>,
            RUNTIME_MESSAGES_BY_LOCALE[locale] as Record<string, unknown>,
          ),
          UI_MESSAGES_BY_LOCALE[locale] as Record<string, unknown>,
        ),
        STUDIO_MESSAGES_BY_LOCALE[locale] as Record<string, unknown>,
      ),
      CHARACTER_CREATE_MESSAGES_BY_LOCALE[locale] as Record<string, unknown>,
    ),
    mergeMessages(
      CHAT_ROOM_MESSAGES_BY_LOCALE[locale] as Record<string, unknown>,
      MODAL_MESSAGES_BY_LOCALE[locale] as Record<string, unknown>,
    ),
  );

  return {
    locale,
    messages,
  };
});
