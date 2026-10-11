/**
 * 가이드 문서(/docs) 공개 API 응답 타입.
 * 기준은 .worktrees/docs/DOCS_API_CONTRACT.md 의 "공개 API" 절이다. ID 는 문자열.
 */

export const DOCS_LOCALES = ["ko", "en"] as const;
export type DocsLocale = (typeof DOCS_LOCALES)[number];
export const DEFAULT_DOCS_LOCALE: DocsLocale = "ko";

export const isDocsLocale = (value: string): value is DocsLocale =>
  (DOCS_LOCALES as readonly string[]).includes(value);

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
  iconUrl: string | null;
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
  iconUrl: string | null;
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
