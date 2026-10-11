import { http, HttpResponse } from "msw";
import {
  isMockDocsLocale,
  mockDocsGroup,
  mockDocsHome,
  mockDocsLocales,
  mockDocsPage,
  mockDocsSearch,
  mockDocsTree,
} from "@/api/docs/mockData";
import type { DocsLocale } from "@/api/docs/types";

/*
 * 가이드 문서 공개 API 목업. 응답은 서버 컴포넌트 목업과 같은 원본(@/api/docs/mockData)에서 만든다.
 * 서버 컴포넌트 fetch 는 이 워커를 거치지 않으므로, 브라우저에서 부르는 검색 자동완성이 주로 쓴다.
 */

const notFound = () =>
  HttpResponse.json(
    { code: "DOCS_NOT_FOUND", message: "문서를 찾을 수 없습니다." },
    { status: 404 },
  );

const withLocale = (
  locale: string | readonly string[] | undefined,
  respond: (locale: DocsLocale) => Response,
) => (typeof locale === "string" && isMockDocsLocale(locale) ? respond(locale) : notFound());

/*
 * API 주소까지 붙여 잡는다. 경로만으로 잡으면 같은 모양인 화면 주소(/docs/ko/search?q=… 의 RSC 요청)까지
 * 가로채 JSON 을 돌려주게 된다.
 */
const API_BASE = process.env.NEXT_PUBLIC_BASE_URI?.replace(/\/$/, "") ?? "";

export const docsHandlers = [
  http.get(`${API_BASE}/docs/locales`, () => HttpResponse.json(mockDocsLocales())),
  http.get(`${API_BASE}/docs/:locale/tree`, ({ params }) =>
    withLocale(params.locale, (locale) => HttpResponse.json(mockDocsTree(locale))),
  ),
  http.get(`${API_BASE}/docs/:locale/home`, ({ params }) =>
    withLocale(params.locale, (locale) => HttpResponse.json(mockDocsHome(locale))),
  ),
  http.get(`${API_BASE}/docs/:locale/groups/:id`, ({ params }) =>
    withLocale(params.locale, (locale) => {
      const group = mockDocsGroup(locale, String(params.id));
      return group ? HttpResponse.json(group) : notFound();
    }),
  ),
  http.get(`${API_BASE}/docs/:locale/pages/:id`, ({ params }) =>
    withLocale(params.locale, (locale) => {
      const page = mockDocsPage(locale, String(params.id));
      return page ? HttpResponse.json(page) : notFound();
    }),
  ),
  http.get(`${API_BASE}/docs/:locale/search`, ({ params, request }) =>
    withLocale(params.locale, (locale) =>
      HttpResponse.json(
        mockDocsSearch(locale, new URL(request.url).searchParams.get("q") ?? ""),
      ),
    ),
  ),
];
