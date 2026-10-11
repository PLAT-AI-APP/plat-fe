import type { DocsLocale, DocsSearchResponse } from "./types";
import { DOCS_SEARCH_MAX_LENGTH } from "./types";

/**
 * 검색창 자동완성용 브라우저 요청. 공개 API 라 토큰 없이 부르며, 인증·토스트 인터셉터가 붙은
 * axios 인스턴스 대신 fetch 를 쓴다(실패해도 드롭다운만 비우면 된다). 목업 모드에서는 MSW 가 잡는다.
 */
export const searchDocs = async (
  locale: DocsLocale,
  rawQuery: string,
  signal?: AbortSignal,
): Promise<DocsSearchResponse> => {
  const query = rawQuery.trim();
  if (!query || query.length > DOCS_SEARCH_MAX_LENGTH) return { items: [] };

  const baseUri = process.env.NEXT_PUBLIC_BASE_URI?.replace(/\/$/, "") ?? "";
  const params = new URLSearchParams({ q: query });
  const response = await fetch(`${baseUri}/docs/${locale}/search?${params}`, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (!response.ok) throw new Error(`[docs] 검색 실패: ${response.status}`);
  return (await response.json()) as DocsSearchResponse;
};
