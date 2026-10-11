import type { DocsLocale } from "@/api/docs/types";

/*
 * 문서 사이트 내부 링크는 전부 여기서 만든다.
 * 나중에 docs.plat.so 서브도메인을 proxy 의 host rewrite 로 붙이면 이 기준 경로만 "" 로 바꾸면 된다.
 */
export const DOCS_BASE_PATH = "/docs";

/** 주소의 `{slug}-{id}` 조각. slug 가 비어 있으면 id 만 쓴다. */
export const toSlugId = (slug: string | null | undefined, id: string) =>
  slug ? `${slug}-${id}` : id;

/** `{slug}-{id}` 에서 마지막 `-` 뒤 숫자를 id 로 읽는다. 형식이 맞지 않으면 null. */
export const parseSlugId = (value: string): { slug: string; id: string } | null => {
  const decoded = (() => {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  })();
  const match = decoded.match(/^(?:(.*)-)?(\d+)$/);
  if (!match) return null;
  return { slug: match[1] ?? "", id: match[2] };
};

/** 앱에서 문서로 들어갈 때 붙이는 앱 언어. 문서가 그 언어를 지원하면 그 언어 홈으로, 아니면 기본 언어로 간다. */
export const DOCS_ENTRY_LANG_PARAM = "lang";

/** 앱 → 문서 진입 주소(`/docs?lang=en`). 실제 언어는 지원 목록을 아는 proxy · /docs 페이지가 고른다. */
export const docsEntryPath = (appLocale: string) =>
  `${DOCS_BASE_PATH}?${new URLSearchParams({ [DOCS_ENTRY_LANG_PARAM]: appLocale })}`;

/** 진입 언어가 지원 목록에 있으면 그 언어, 없으면 기본 언어. */
export const pickDocsEntryLocale = (
  requested: string | null | undefined,
  supported: { defaultLocale: DocsLocale; locales: { code: DocsLocale }[] },
): DocsLocale =>
  supported.locales.some((item) => item.code === requested) ? (requested as DocsLocale) : supported.defaultLocale;

export const docsPath = {
  home: (locale: DocsLocale) => `${DOCS_BASE_PATH}/${locale}`,
  category: (locale: DocsLocale, slug: string | null | undefined, id: string) =>
    `${DOCS_BASE_PATH}/${locale}/categories/${toSlugId(slug, id)}`,
  article: (locale: DocsLocale, slug: string | null | undefined, id: string) =>
    `${DOCS_BASE_PATH}/${locale}/articles/${toSlugId(slug, id)}`,
  search: (locale: DocsLocale, query?: string) => {
    const trimmed = query?.trim();
    return `${DOCS_BASE_PATH}/${locale}/search${
      trimmed ? `?${new URLSearchParams({ q: trimmed })}` : ""
    }`;
  },
};

/** 현재 문서 주소의 종류와 id. 사이드바 강조·언어 전환이 주소만 보고 판단한다. */
export const parseDocsPathname = (
  pathname: string,
): { locale: string; kind: "home" | "category" | "article" | "search" | "other"; id?: string } => {
  const rest = pathname.startsWith(DOCS_BASE_PATH)
    ? pathname.slice(DOCS_BASE_PATH.length)
    : pathname;
  const [, locale = "", section, slugId] = rest.split("/");
  if (!section) return { locale, kind: "home" };
  if (section === "search") return { locale, kind: "search" };
  if ((section === "categories" || section === "articles") && slugId) {
    const parsed = parseSlugId(slugId);
    return {
      locale,
      kind: section === "categories" ? "category" : "article",
      id: parsed?.id,
    };
  }
  return { locale, kind: "other" };
};

/** 같은 화면을 다른 언어로 연 주소. 기준 경로 뒤 첫 조각(locale)만 바꾼다. */
export const swapDocsLocale = (pathname: string, search: string, locale: DocsLocale) => {
  const rest = pathname.slice(DOCS_BASE_PATH.length).split("/");
  rest[1] = locale;
  return `${DOCS_BASE_PATH}${rest.join("/")}${search}`;
};

/** 문서 사이트 주소인지. 앱 셸·동의 게이트·점검 모드가 문서를 앱 화면과 구분할 때 쓴다. */
export const isDocsPathname = (pathname: string) =>
  pathname === DOCS_BASE_PATH || pathname.startsWith(`${DOCS_BASE_PATH}/`);
