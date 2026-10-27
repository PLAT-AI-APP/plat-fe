/*
 * 문서 사이트는 앱과 따로 배포된다(PLAT-AI-APP/plat-docs 레포의 site/).
 * 개발은 docs-dev.plat.so(Vercel), 운영은 docs.plat.so(Firebase App Hosting)이고, 배포마다 NEXT_PUBLIC_DOCS_URL 로 정한다.
 * 앱 안에 있던 예전 문서 화면(/docs)은 쓰지 않고, 그 주소로 들어오면 proxy 가 이 사이트로 보낸다.
 */

/** 문서 사이트 주소. 끝의 "/" 는 뗀다. 비우면 운영 주소를 쓴다. NEXT_PUBLIC_ 값이라 빌드 때 고정된다. */
export const DOCS_SITE_URL = (process.env.NEXT_PUBLIC_DOCS_URL || "https://docs.plat.so").replace(/\/+$/, "");

/** 예전 앱 안 문서 화면의 기준 경로. 이 경로로 들어온 요청을 문서 사이트로 옮겨 보낸다. */
export const LEGACY_DOCS_PATH = "/docs";

/**
 * 앱 → 문서 진입 주소(`https://docs.plat.so/?lang=en`).
 * 문서 사이트가 지원하는 언어면 그 언어 홈으로, 아니면 기본 언어 홈으로 보낸다.
 */
export const docsSiteEntryUrl = (appLocale: string) =>
  `${DOCS_SITE_URL}/?${new URLSearchParams({ lang: appLocale })}`;

/** 예전 문서 주소인지(`/docs`, `/docs/...`). */
export const isLegacyDocsPathname = (pathname: string) =>
  pathname === LEGACY_DOCS_PATH || pathname.startsWith(`${LEGACY_DOCS_PATH}/`);

/**
 * 예전 문서 주소를 문서 사이트의 같은 화면 주소로 바꾼다. 앞의 `/docs` 만 떼고 나머지 경로·쿼리는 그대로 둔다.
 * `/docs/ko/articles/refund` → `https://docs.plat.so/ko/articles/refund`, `/docs?lang=en` → `https://docs.plat.so/?lang=en`
 */
export const legacyDocsToSiteUrl = (pathname: string, search: string) =>
  `${DOCS_SITE_URL}${pathname.slice(LEGACY_DOCS_PATH.length) || "/"}${search}`;
