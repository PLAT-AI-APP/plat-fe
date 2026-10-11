import { cache } from "react";
import { isMockingEnabled } from "@/lib/apiMocking";
import type {
  DocsGroupResponse,
  DocsHomeResponse,
  DocsLocale,
  DocsPageResponse,
  DocsSearchResponse,
  DocsTreeResponse,
} from "./types";
import { DOCS_SEARCH_MAX_LENGTH } from "./types";

/*
 * 가이드 문서 서버 데이터 레이어. 서버 컴포넌트에서만 부른다(검색 엔진이 본문을 읽도록 서버에서 그린다).
 *
 * - 공개 API 라 로그인 토큰 없이 fetch 로 부르고 60초 캐시한다. axios 인스턴스(src/api/index.ts)는
 *   브라우저 인증·토스트 인터셉터가 붙어 있어 쓰지 않는다.
 * - 목업 모드(NEXT_PUBLIC_API_MOCKING)에서는 MSW 브라우저 워커가 서버 요청을 잡지 못하므로
 *   같은 목업 원본(./mockData)으로 응답을 직접 만든다.
 * - 404 는 null 로 돌려 페이지가 notFound() 를 부르게 하고, 그 밖의 실패는 던져 오류 화면으로 보낸다.
 * - 같은 렌더 안에서 레이아웃·페이지·generateMetadata 가 같은 데이터를 여러 번 부르므로 cache 로 묶는다.
 */

const REVALIDATE_SECONDS = 60;
const REQUEST_TIMEOUT_MS = 10_000;

const baseUri = () => process.env.NEXT_PUBLIC_BASE_URI?.replace(/\/$/, "") ?? "";

const loadMock = () => import("./mockData");

const fetchDocs = async <T>(path: string): Promise<T | null> => {
  const response = await fetch(`${baseUri()}${path}`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`[docs] ${path} 응답 실패: ${response.status}`);
  }
  return (await response.json()) as T;
};

/** URL 경로의 id 는 숫자만 받는다. 숫자가 아니면 서버에 묻지 않고 404 로 본다. */
const isNumericId = (id: string) => /^\d+$/.test(id);

export const getDocsTree = cache(async (locale: DocsLocale): Promise<DocsTreeResponse> => {
  if (isMockingEnabled) return (await loadMock()).mockDocsTree(locale);
  return (await fetchDocs<DocsTreeResponse>(`/docs/${locale}/tree`)) ?? { items: [] };
});

export const getDocsHome = cache(async (locale: DocsLocale): Promise<DocsHomeResponse> => {
  if (isMockingEnabled) return (await loadMock()).mockDocsHome(locale);
  return (await fetchDocs<DocsHomeResponse>(`/docs/${locale}/home`)) ?? { groups: [] };
});

export const getDocsGroup = cache(
  async (locale: DocsLocale, groupId: string): Promise<DocsGroupResponse | null> => {
    if (!isNumericId(groupId)) return null;
    if (isMockingEnabled) return (await loadMock()).mockDocsGroup(locale, groupId);
    return fetchDocs<DocsGroupResponse>(`/docs/${locale}/groups/${groupId}`);
  },
);

export const getDocsPage = cache(
  async (locale: DocsLocale, pageId: string): Promise<DocsPageResponse | null> => {
    if (!isNumericId(pageId)) return null;
    if (isMockingEnabled) return (await loadMock()).mockDocsPage(locale, pageId);
    return fetchDocs<DocsPageResponse>(`/docs/${locale}/pages/${pageId}`);
  },
);

export const searchDocsOnServer = cache(
  async (locale: DocsLocale, rawQuery: string): Promise<DocsSearchResponse> => {
    const query = rawQuery.trim();
    if (!query || query.length > DOCS_SEARCH_MAX_LENGTH) return { items: [] };
    if (isMockingEnabled) return (await loadMock()).mockDocsSearch(locale, query);
    const params = new URLSearchParams({ q: query });
    return (
      (await fetchDocs<DocsSearchResponse>(`/docs/${locale}/search?${params}`)) ?? {
        items: [],
      }
    );
  },
);
