import { cache } from "react";
import { matchDocs } from "./matchDocs";
import type {
  DocsGroupResponse,
  DocsHomeResponse,
  DocsLocale,
  DocsLocaleBundle,
  DocsLocalesResponse,
  DocsPageResponse,
  DocsSearchResponse,
  DocsTreeResponse,
} from "./types";

/*
 * 문서 사이트 서버 데이터 레이어. 서버 컴포넌트·route·proxy 에서만 부른다(검색 엔진이 본문을 읽도록 서버에서 그린다).
 *
 * - 원본은 public 레포 PLAT-AI-APP/plat-docs 다. 그 레포의 Action 이 main·develop 에 반영될 때마다
 *   검사를 거친 묶음(locales.json · <locale>.json)을 bundle 브랜치의 <브랜치>/ 에 올리고, 여기서는 그것만 읽는다.
 *   어느 브랜치를 읽을지는 DOCS_BRANCH(운영 main, 그 밖 develop)가 정한다.
 * - GitHub raw 는 5분 캐시라 문서 반영은 그만큼 늦을 수 있다. 우리 쪽은 60초마다 다시 받는다(문서 화면의 ISR 주기와 같다).
 * - DOCS_BUNDLE_DIR 를 주면 GitHub 대신 그 폴더의 묶음을 읽는다(push 전 로컬 확인용).
 * - 묶음을 못 받으면 문서를 그릴 수 없으므로 던진다(오류 화면). 없는 slug 는 null 로 돌려 페이지가 notFound() 를 부르게 한다.
 * - 같은 렌더 안에서 레이아웃·페이지·generateMetadata 가 같은 데이터를 여러 번 부르므로 cache 로 묶는다.
 */

const REVALIDATE_SECONDS = 60;
const REQUEST_TIMEOUT_MS = 10_000;
const BUNDLE_BASE_URL = "https://raw.githubusercontent.com/PLAT-AI-APP/plat-docs/bundle";

const docsBranch = () => process.env.DOCS_BRANCH || "develop";

const loadBundleFile = async <T>(name: string): Promise<T> => {
  const localDir = process.env.DOCS_BUNDLE_DIR;
  if (localDir) {
    const [{ readFile }, { join }] = await Promise.all([import("node:fs/promises"), import("node:path")]);
    return JSON.parse(await readFile(join(localDir, name), "utf8")) as T;
  }
  const url = `${BUNDLE_BASE_URL}/${docsBranch()}/${name}`;
  const response = await fetch(url, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!response.ok) throw new Error(`[docs] ${url} 응답 실패: ${response.status}`);
  // raw 는 text/plain 으로 내려주므로 형식과 상관없이 JSON 으로 읽는다.
  return JSON.parse(await response.text()) as T;
};

/** 레코드에서 slug 로 찾는다. `constructor` 같은 프로토타입 이름이 주소로 들어와도 걸리지 않게 자기 키만 본다. */
const pick = <T>(record: Record<string, T>, slug: string): T | null =>
  Object.hasOwn(record, slug) ? record[slug] : null;

/**
 * 지원 언어. 주소 검사 · 언어 메뉴 · hreflang · `/docs` 기본 언어가 모두 이것을 쓴다.
 * 비어 있으면 문서를 그릴 수 없으므로 던진다(오류 화면).
 */
export const getDocsLocales = cache(async (): Promise<DocsLocalesResponse> => {
  const locales = await loadBundleFile<DocsLocalesResponse>("locales.json");
  if (!locales?.locales?.length) throw new Error("[docs] locales.json 이 비었습니다.");
  return locales;
});

const getDocsBundle = cache(
  (locale: DocsLocale): Promise<DocsLocaleBundle> => loadBundleFile<DocsLocaleBundle>(`${locale}.json`),
);

export const getDocsTree = cache(async (locale: DocsLocale): Promise<DocsTreeResponse> => ({
  items: (await getDocsBundle(locale)).tree,
}));

export const getDocsHome = cache(async (locale: DocsLocale): Promise<DocsHomeResponse> => ({
  groups: (await getDocsBundle(locale)).home,
}));

export const getDocsGroup = cache(
  async (locale: DocsLocale, slug: string): Promise<DocsGroupResponse | null> =>
    pick((await getDocsBundle(locale)).groups, slug),
);

export const getDocsPage = cache(
  async (locale: DocsLocale, slug: string): Promise<DocsPageResponse | null> =>
    pick((await getDocsBundle(locale)).pages, slug),
);

export const searchDocsOnServer = cache(
  async (locale: DocsLocale, query: string): Promise<DocsSearchResponse> => ({
    items: matchDocs((await getDocsBundle(locale)).search, query),
  }),
);

/**
 * 지금 언어에 없는 문서가 다른 언어로는 있는지 찾는다. 언어를 바꿔 들어온 문서가 그 언어로 번역되지 않았을 때
 * "다른 언어로 보기" 안내를 그리는 데 쓴다. 어느 언어에도 없으면 빈 배열(진짜 없는 문서 → 404).
 */
export const findDocsInOtherLocales = async <T>(
  locale: DocsLocale,
  load: (other: DocsLocale) => Promise<T | null>,
): Promise<{ locale: DocsLocale; name: string; item: T }[]> => {
  const { locales } = await getDocsLocales();
  const found = await Promise.all(
    locales
      .filter((each) => each.code !== locale)
      .map(async (each) => ({ locale: each.code, name: each.name, item: await load(each.code) })),
  );
  return found.flatMap((each) => (each.item ? [{ ...each, item: each.item }] : []));
};
