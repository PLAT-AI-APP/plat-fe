"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

interface NoticeMarkdownProps {
  content: string;
}

const markdownComponents: Partial<Components> = {
  h1: ({ ...props }) => <h2 className="title-1 mt-6 first:mt-0" {...props} />,
  h2: ({ ...props }) => <h3 className="title-2 mt-6 first:mt-0" {...props} />,
  h3: ({ ...props }) => <h4 className="title-3 mt-5 first:mt-0" {...props} />,
  p: ({ ...props }) => <p className="leading-relaxed" {...props} />,
  ul: ({ ...props }) => (
    <ul className="list-disc pl-5 leading-relaxed" {...props} />
  ),
  ol: ({ ...props }) => (
    <ol className="list-decimal pl-5 leading-relaxed" {...props} />
  ),
  a: ({ ...props }) => (
    <a
      className="text-brand underline underline-offset-2"
      target="_blank"
      rel="noreferrer"
      {...props}
    />
  ),
  code: ({ ...props }) => (
    <code className="rounded bg-card px-1.5 py-0.5" {...props} />
  ),
  blockquote: ({ ...props }) => (
    <blockquote
      className="border-l-2 border-brand pl-4 text-font-2"
      {...props}
    />
  ),
  hr: () => <hr className="border-main" />,
};

const NoticeMarkdown = ({ content }: NoticeMarkdownProps) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm, remarkBreaks]}
    components={markdownComponents}
  >
    {content}
  </ReactMarkdown>
);

export default NoticeMarkdown;
