/*
 * 문서는 plat-docs 레포가 앱과 따로 배포하는 문서 전용 사이트에 있다(develop → docs-dev, main → docs).
 * 앱에는 문서로 가는 링크와, 예전 앱 안 주소(/docs/**)를 문서 사이트로 넘기는 일만 남아 있다.
 */

/** 예전 앱 안 문서의 기준 경로. 이 아래로 들어온 요청은 proxy 가 문서 사이트의 같은 경로로 보낸다. */
export const DOCS_BASE_PATH = "/docs";

/** 앱에서 문서로 들어갈 때 붙이는 앱 언어. 문서가 그 언어를 지원하면 그 언어 홈으로, 아니면 기본 언어로 간다. */
export const DOCS_ENTRY_LANG_PARAM = "lang";

/**
 * 문서 전용 사이트 주소.
 * 개발 값은 .env 에, 운영 값은 apphosting.prod.yaml 에 둔다. 비면 운영 주소를 쓴다.
 */
export const DOCS_SITE_URL = (
  process.env.NEXT_PUBLIC_DOCS_URL || "https://docs.plat.so"
).replace(/\/+$/, "");

/** 앱 → 문서 진입 주소(`https://docs.plat.so/?lang=en`). 실제 언어는 지원 목록을 아는 문서 사이트가 고른다. */
export const docsEntryPath = (appLocale: string) =>
  `${DOCS_SITE_URL}/?${new URLSearchParams({ [DOCS_ENTRY_LANG_PARAM]: appLocale })}`;

/** 예전 앱 안 문서 주소인지. */
export const isDocsPathname = (pathname: string) =>
  pathname === DOCS_BASE_PATH || pathname.startsWith(`${DOCS_BASE_PATH}/`);
