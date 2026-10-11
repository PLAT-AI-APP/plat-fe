import type { Metadata } from "next";
import { DOCS_LOCALES, isDocsLocale, type DocsLocale } from "@/api/docs/types";
import { getDocsMessages } from "@/i18n/locales/docs";

/** 주소의 locale 조각을 문서 언어로 읽는다. 지원하지 않으면 null(페이지가 notFound). */
export const readDocsLocale = (value: string): DocsLocale | null =>
  isDocsLocale(value) ? value : null;

/**
 * 문서 화면 공통 메타데이터. canonical 은 정규 주소(slug-id), 같은 문서가 있는 다른 언어는 hreflang 으로 잇는다.
 * 상대 경로는 루트 레이아웃의 metadataBase(SITE_URL)로 풀린다.
 */
export const buildDocsMetadata = ({
  locale,
  title,
  description,
  path,
  alternates,
}: {
  locale: DocsLocale;
  title?: string;
  description?: string | null;
  path: string;
  /** 언어별 같은 문서 주소. 없으면 hreflang 을 달지 않는다. */
  alternates?: Partial<Record<DocsLocale, string>>;
}): Metadata => {
  const messages = getDocsMessages(locale);
  const desc = description?.trim() || messages.metaDescription;
  return {
    ...(title ? { title } : {}),
    description: desc,
    alternates: {
      canonical: path,
      ...(alternates ? { languages: alternates } : {}),
    },
    openGraph: {
      type: "website",
      siteName: messages.siteName,
      locale: locale === "ko" ? "ko_KR" : "en_US",
      title: title ? `${title} | ${messages.siteName}` : messages.siteName,
      description: desc,
      url: path,
    },
  };
};

/** 모든 언어 주소(홈처럼 언어마다 반드시 있는 화면). */
export const allLocaleAlternates = (toPath: (locale: DocsLocale) => string) =>
  Object.fromEntries(DOCS_LOCALES.map((locale) => [locale, toPath(locale)])) as Record<
    DocsLocale,
    string
  >;
