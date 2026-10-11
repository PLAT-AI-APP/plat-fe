"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkBreaks from "remark-breaks";
import { cn } from "@/lib/utils";

interface FaqAnswerProps {
  content: string;
  className?: string;
}

/*
 * FAQ 답변에 허용하는 마크다운 요소. 굵게·기울임·목록·링크·인라인 코드·줄바꿈·제목만 쓴다.
 * 그 밖의 요소(표·이미지·인용·코드 블록 등)는 태그를 걷어내고 글자만 남긴다.
 * raw HTML 은 rehype-raw 를 붙이지 않았으므로 처음부터 렌더하지 않는다(글자로 보이지도 않고 버려진다).
 */
const ALLOWED_ELEMENTS = [
  "p",
  "br",
  "strong",
  "em",
  "ul",
  "ol",
  "li",
  "a",
  "code",
  "h1",
  "h2",
  "h3",
];

/** 이 서비스 안의 경로인지. 상대 경로(`/…`)와 `#…` 만 안으로 본다. */
const isInternalHref = (href: string | undefined) =>
  Boolean(href && (href.startsWith("/") || href.startsWith("#")) && !href.startsWith("//"));

/**
 * react-markdown 은 각 요소에 mdast node 를 함께 넘긴다. 그대로 펼치면 DOM 속성으로 새어
 * 경고가 나므로 빼고 넘긴다.
 */
const withoutNode = <T extends { node?: unknown }>(props: T): Omit<T, "node"> => {
  const rest = { ...props };
  delete rest.node;
  return rest;
};

/* 아코디언 안이라 제목은 본문보다 조금만 키운다. 질문 줄(title-5)보다 커지지 않게 둔다. */
const components: Partial<Components> = {
  h1: ({ className, ...props }) => (
    <h3 className={cn("title-5 text-font-0", className)} {...withoutNode(props)} />
  ),
  h2: ({ className, ...props }) => (
    <h4 className={cn("title-6 text-font-0", className)} {...withoutNode(props)} />
  ),
  h3: ({ className, ...props }) => (
    <h5 className={cn("title-6 text-font-1", className)} {...withoutNode(props)} />
  ),
  strong: ({ className, ...props }) => (
    <strong className={cn("font-semibold text-font-0", className)} {...withoutNode(props)} />
  ),
  ul: ({ className, ...props }) => (
    <ul
      className={cn("flex list-disc flex-col gap-1 pl-5 [&_ul]:list-[circle]", className)}
      {...withoutNode(props)}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn("flex list-decimal flex-col gap-1 pl-5", className)} {...withoutNode(props)} />
  ),
  code: ({ className, ...props }) => (
    <code
      className={cn("rounded bg-card px-1.5 py-0.5 font-mono text-[0.9em]", className)}
      {...withoutNode(props)}
    />
  ),
  // 외부 링크는 새 탭으로 열고 opener 를 끊는다. 서비스 안 경로는 같은 탭에서 연다.
  a: ({ className, href, ...props }) => {
    const external = !isInternalHref(href);
    return (
      <a
        href={href}
        className={cn("text-brand underline underline-offset-2", className)}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...withoutNode(props)}
      />
    );
  },
};

/**
 * 고객센터 FAQ 답변. 관리자가 마크다운으로 쓴 원문을 그린다.
 * 마크다운을 쓰지 않은 예전 평문도 줄바꿈이 그대로 보이도록 remark-breaks 를 건다.
 */
const FaqAnswer = ({ content, className }: FaqAnswerProps) => (
  <div className={cn("flex flex-col gap-2 break-keep", className)}>
    <ReactMarkdown
      remarkPlugins={[remarkBreaks]}
      allowedElements={ALLOWED_ELEMENTS}
      unwrapDisallowed
      skipHtml
      components={components}
    >
      {content}
    </ReactMarkdown>
  </div>
);

export default FaqAnswer;
