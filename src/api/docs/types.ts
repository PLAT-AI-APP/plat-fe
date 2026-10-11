/**
 * 문서 사이트(/docs) 공개 API 응답 타입.
 * 기준은 .worktrees/docs/DOCS_API_CONTRACT.md 의 "공개 API" 절이다. ID 는 문자열.
 */

/**
 * 문서 언어 코드(`ko` · `en` …). 어떤 언어가 있는지는 서버(`GET /docs/locales`)가 정한다 —
 * 사이트는 언어 목록을 들고 있지 않는다. 화면 문구(헤더 · 버튼)만 사이트가 언어별로 갖는다.
 */
export type DocsLocale = string;

export interface DocsLocaleInfo {
  code: DocsLocale;
  /** 그 언어로 적은 이름(한국어 · English). 언어 메뉴에 그대로 쓴다. */
  name: string;
}

/** GET /docs/locales. `locales` 순서가 언어 메뉴 순서다. */
export interface DocsLocalesResponse {
  defaultLocale: DocsLocale;
  locales: DocsLocaleInfo[];
}

/** GET /docs/{locale}/tree 의 노드. GROUP 은 name, PAGE 는 title 을 쓴다. */
export interface DocsTreeNode {
  type: "GROUP" | "PAGE";
  id: string;
  slug: string;
  name?: string | null;
  title?: string | null;
  children: DocsTreeNode[];
}

export interface DocsTreeResponse {
  items: DocsTreeNode[];
}

export interface DocsHomeGroup {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  pageCount: number;
}

export interface DocsHomeResponse {
  groups: DocsHomeGroup[];
}

export interface DocsBreadcrumb {
  id: string;
  slug: string;
  name: string;
}

export type DocsGroupChild =
  | {
      type: "GROUP";
      id: string;
      slug: string;
      name: string;
      description: string | null;
      coverImageUrl: string | null;
      pageCount: number;
    }
  | {
      type: "PAGE";
      id: string;
      slug: string;
      title: string;
      summary: string | null;
    };

export interface DocsGroupResponse {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  breadcrumbs: DocsBreadcrumb[];
  children: DocsGroupChild[];
  availableLocales: DocsLocale[];
}

export interface DocsPageResponse {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  content: string;
  updatedAt: string;
  groupId: string;
  breadcrumbs: DocsBreadcrumb[];
  availableLocales: DocsLocale[];
}

export interface DocsSearchItem {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  groupName: string;
}

export interface DocsSearchResponse {
  items: DocsSearchItem[];
}

/** 계약: q 는 앞뒤 공백을 뺀 뒤 1~50자. */
export const DOCS_SEARCH_MAX_LENGTH = 50;
