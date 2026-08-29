export const endpoint = (pathname: string) =>
  new RegExp(`${pathname.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\?.*)?$`);

export const pathValue = (requestUrl: string, pattern: RegExp) =>
  new URL(requestUrl).pathname.match(pattern)?.[1];

const SUPPORTED_MOCK_LANGS = ["ko", "en", "ja", "zh"] as const;
export type MockLang = (typeof SUPPORTED_MOCK_LANGS)[number];
const DEFAULT_MOCK_LANG: MockLang = "ko";

/**
 * Accept-Language 헤더를 파싱해 지원 언어 중 하나로 매칭합니다.
 * q값 내림차순으로 후보를 순회하며, region/script가 붙어도(zh-Hant-TW → zh)
 * 최상위 subtag만 비교하고, 미지원 후보는 건너뛰고 다음 후보로 넘어갑니다.
 * 매칭되는 후보가 없으면 기본 언어(ko)로 폴백합니다.
 */
export const resolveAcceptLanguage = (header: string | null): MockLang => {
  if (!header) return DEFAULT_MOCK_LANG;

  const candidates = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const q = qParam ? parseFloat(qParam.trim().slice(2)) : 1;
      return { tag: tag.trim().toLowerCase(), q: Number.isNaN(q) ? 1 : q };
    })
    .filter((candidate) => candidate.tag)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of candidates) {
    const primarySubtag = tag.split("-")[0];
    if ((SUPPORTED_MOCK_LANGS as readonly string[]).includes(primarySubtag)) {
      return primarySubtag as MockLang;
    }
  }

  return DEFAULT_MOCK_LANG;
};
