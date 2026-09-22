import type { MessageTree } from "@/i18n/composeMessages";
import { type AppLocale, DEFAULT_LOCALE } from "@/i18n/config";
import defaultMessages from "@/i18n/locales/ko";

/**
 * 언어별 번역을 필요할 때만 받아온다.
 *
 * 예전에는 6개 언어 번역(약 260KB)이 모든 페이지 번들에 함께 실렸다. 화면은 한 번에 한 언어만
 * 쓰므로, 기본 언어(서버가 그리는 언어)만 번들에 두고 나머지는 고른 순간 별도 청크로 받는다.
 * import() 경로를 언어마다 따로 적어야 번들러가 언어별 청크를 나눈다.
 */
// 기본 언어(ko)는 위에서 바로 가져오므로 여기에는 없다.
const LOADERS: Partial<Record<AppLocale, () => Promise<{ default: MessageTree }>>> = {
  en: () => import("@/i18n/locales/en"),
  ja: () => import("@/i18n/locales/ja"),
  zh: () => import("@/i18n/locales/zh"),
  th: () => import("@/i18n/locales/th"),
  vi: () => import("@/i18n/locales/vi"),
};

export { defaultMessages };

const loaded = new Map<AppLocale, MessageTree>([[DEFAULT_LOCALE, defaultMessages]]);
const pending = new Map<AppLocale, Promise<MessageTree>>();

/** 이미 받아 둔 언어의 번역. 아직 없으면 undefined. React 밖(axios 인터셉터 등)에서도 쓴다. */
export const getLoadedMessages = (locale: AppLocale) => loaded.get(locale);

/** 언어 번역을 받아 둔다. 같은 언어를 여러 곳에서 동시에 요청해도 한 번만 받는다. */
export const loadMessages = (locale: AppLocale): Promise<MessageTree> => {
  const cached = loaded.get(locale);
  if (cached) return Promise.resolve(cached);

  const loader = LOADERS[locale];
  if (!loader) return Promise.resolve(defaultMessages);

  const inFlight = pending.get(locale);
  if (inFlight) return inFlight;

  const request = loader()
    .then(({ default: messages }) => {
      loaded.set(locale, messages);
      return messages;
    })
    .finally(() => {
      // 실패했으면 다음 요청 때 다시 시도할 수 있게 비운다.
      pending.delete(locale);
    });

  pending.set(locale, request);
  return request;
};
