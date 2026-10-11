"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { DocsLocale, DocsLocaleInfo, DocsTreeNode } from "@/api/docs/types";
import type { DocsMessages } from "@/i18n/locales/docs";

interface DocsContextValue {
  locale: DocsLocale;
  /** 서버가 정한 지원 언어(메뉴 순서). */
  locales: DocsLocaleInfo[];
  messages: DocsMessages;
  tree: DocsTreeNode[];
  /** 지금 보는 문서가 번역돼 있는 언어. null 이면 언어와 무관한 화면(홈·검색)이다. */
  availableLocales: DocsLocale[] | null;
  setAvailableLocales: (locales: DocsLocale[] | null) => void;
}

const DocsContext = createContext<DocsContextValue | null>(null);

/** 문서 레이아웃이 서버에서 받은 언어·문구·트리를 클라이언트 컴포넌트(헤더·사이드바)에 나눠 준다. */
export const DocsProvider = ({
  locale,
  locales,
  messages,
  tree,
  children,
}: {
  locale: DocsLocale;
  locales: DocsLocaleInfo[];
  messages: DocsMessages;
  tree: DocsTreeNode[];
  children: ReactNode;
}) => {
  const [availableLocales, setAvailableLocales] = useState<DocsLocale[] | null>(null);

  // 앱의 IntlProvider 가 <html lang> 을 앱 언어로 맞추므로, 문서에서는 주소 locale 로 다시 맞춘다.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(
    () => ({ locale, locales, messages, tree, availableLocales, setAvailableLocales }),
    [locale, locales, messages, tree, availableLocales],
  );

  return <DocsContext.Provider value={value}>{children}</DocsContext.Provider>;
};

export const useDocs = () => {
  const context = useContext(DocsContext);
  if (!context) throw new Error("useDocs 는 DocsProvider 안에서만 쓴다.");
  return context;
};

/**
 * 페이지가 "이 문서는 어떤 언어로 있는지" 를 헤더의 언어 전환에 알린다.
 * 화면을 떠나면 다시 비워 둔다(홈·검색은 모든 언어로 있다).
 */
export const DocsPageLocales = ({ locales }: { locales: DocsLocale[] | null }) => {
  const { setAvailableLocales } = useDocs();
  const key = locales?.join(",") ?? "";

  useEffect(() => {
    setAvailableLocales(key ? (key.split(",") as DocsLocale[]) : null);
    return () => setAvailableLocales(null);
  }, [key, setAvailableLocales]);

  return null;
};
