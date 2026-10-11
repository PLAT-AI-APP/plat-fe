"use client";

import type { Components } from "react-markdown";
import MarkdownDocument from "@/components/markdown/MarkdownDocument";
import { cn } from "@/lib/utils";

/**
 * react-markdown 이 넘기는 mdast node 는 DOM 속성으로 새지 않게 뺀다(MarkdownDocument 와 같은 처리).
 */
const withoutNode = <T extends { node?: unknown }>(props: T): Omit<T, "node"> => {
  const rest = { ...props };
  delete rest.node;
  return rest;
};

/*
 * 가이드 문서용 요소 모양. 공지·약관과 달리 문서 제목(h1)과 본문 제목 단계를 그대로 맞춰
 * `##` → h2, `###` → h3 로 그린다(목차가 h2·h3 를 읽는다). 앵커로 이동해도 고정 헤더에 가리지 않게
 * scroll-margin 을 준다. 나머지 요소는 MarkdownDocument 기본 모양을 쓴다.
 */
const docsComponents: Partial<Components> = {
  h1: ({ className, ...props }) => (
    <h2 className={cn("heading-2 mt-12 scroll-mt-24 first:mt-0", className)} {...withoutNode(props)} />
  ),
  h2: ({ className, ...props }) => (
    <h2 className={cn("heading-2 mt-12 scroll-mt-24 first:mt-0", className)} {...withoutNode(props)} />
  ),
  h3: ({ className, ...props }) => (
    <h3 className={cn("title-1 mt-8 scroll-mt-24 first:mt-0", className)} {...withoutNode(props)} />
  ),
  h4: ({ className, ...props }) => (
    <h4 className={cn("title-2 mt-6 first:mt-0", className)} {...withoutNode(props)} />
  ),
  p: ({ className, ...props }) => (
    <p className={cn("leading-[1.75]", className)} {...withoutNode(props)} />
  ),
  // 문서 안 링크는 같은 탭에서, 외부 링크는 새 탭에서 연다.
  a: ({ className, href, ...props }) => {
    const isExternal = /^https?:\/\//.test(href ?? "");
    return (
      <a
        href={href}
        className={cn("text-brand-dark underline underline-offset-2", className)}
        {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
        {...withoutNode(props)}
      />
    );
  },
  img: ({ className, alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt ?? ""}
      loading="lazy"
      className={cn("my-2 h-auto max-w-full rounded-xl border border-main", className)}
      {...withoutNode(props)}
    />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "flex flex-col gap-2 rounded-xl bg-card px-5 py-4 text-font-1 [&_p]:leading-relaxed",
        className,
      )}
      {...withoutNode(props)}
    />
  ),
};

const DocsMarkdown = ({ content }: { content: string }) => (
  <MarkdownDocument content={content} anchorHeadings components={docsComponents} />
);

export default DocsMarkdown;
