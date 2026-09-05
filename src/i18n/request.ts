import { getRequestConfig } from "next-intl/server";
import { buildMessages } from "@/i18n/buildMessages";
import { DEFAULT_LOCALE } from "@/i18n/config";

export default getRequestConfig(async () => {
  // 현재 앱의 실제 언어 전환은 클라이언트 store가 담당하므로,
  // 서버 기본 렌더에서는 안전한 기본 언어를 제공해 next-intl 설정 요구사항을 충족합니다.
  const locale = DEFAULT_LOCALE;

  return {
    locale,
    messages: buildMessages(locale),
  };
});
