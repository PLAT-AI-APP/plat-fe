import type { DocsLocale } from "@/api/docs/types";
import en from "./en";
import ko from "./ko";

export type DocsMessages = typeof ko;

const MESSAGES: Record<DocsLocale, DocsMessages> = { ko, en };

/** 주소 locale 에 맞는 문서 문구. 서버 컴포넌트에서 골라 클라이언트 컴포넌트에 props 로 넘긴다. */
export const getDocsMessages = (locale: DocsLocale): DocsMessages => MESSAGES[locale];

/** "{name}" 자리표시자를 채운다. */
export const formatDocsMessage = (
  template: string,
  values: Record<string, string | number>,
) => template.replace(/\{(\w+)\}/g, (whole, key: string) => String(values[key] ?? whole));
