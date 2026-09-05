"use client";

import React, { use } from "react";
import Link from "next/link";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { useTranslations } from "next-intl";
import { useNoticeDetailContentsQuery } from "@/api/notice/getNoticeDetailContents";
import { ErrorState } from "@/components/state";
import { ArrowLeft, Clock } from "@/icons";
import PinFill from "@/icons/PinFill";
import dayjs from "@/lib/dayjs";
import { cn, formatStatCount } from "@/lib/utils";
import type { NoticeCategory } from "@/type/notice";

/** 목록의 배지와 같은 색을 씁니다 — 같은 분류가 화면마다 달라 보이면 안 됩니다. */
const NOTICE_CATEGORY_STYLE: Record<
  NoticeCategory,
  { bg: string; color: string; labelKey: string }
> = {
  SERVICE: { bg: "bg-info-bg", color: "text-info", labelKey: "notification.filters.service" },
  UPDATE: { bg: "bg-success-bg", color: "text-success", labelKey: "notification.filters.update" },
  EVENT: { bg: "bg-warning-bg", color: "text-warning", labelKey: "notification.filters.event" },
  MAINTENANCE: { bg: "bg-warning-bg", color: "text-warning", labelKey: "notification.filters.maintenance" },
  POLICY: { bg: "bg-info-bg", color: "text-info", labelKey: "notification.filters.policy" },
};

/* 공지 본문은 마크다운으로 들어옵니다. 기본 마진을 걷어내고 본문 리듬에 맞춥니다. */
const markdownComponents: Partial<Components> = {
  h1: ({ ...props }) => <h2 className="title-1 mt-6 first:mt-0" {...props} />,
  h2: ({ ...props }) => <h3 className="title-2 mt-6 first:mt-0" {...props} />,
  h3: ({ ...props }) => <h4 className="title-3 mt-5 first:mt-0" {...props} />,
  p: ({ ...props }) => <p className="leading-relaxed" {...props} />,
  ul: ({ ...props }) => <ul className="list-disc pl-5 leading-relaxed" {...props} />,
  ol: ({ ...props }) => <ol className="list-decimal pl-5 leading-relaxed" {...props} />,
  a: ({ ...props }) => (
    <a className="text-brand underline underline-offset-2" target="_blank" rel="noreferrer" {...props} />
  ),
  code: ({ ...props }) => <code className="rounded bg-card px-1.5 py-0.5" {...props} />,
  blockquote: ({ ...props }) => (
    <blockquote className="border-l-2 border-brand pl-4 text-font-2" {...props} />
  ),
  hr: () => <hr className="border-main" />,
};

const DetailSkeleton = () => (
  <div aria-hidden="true" className="flex flex-col gap-9">
    <div className="flex flex-col gap-2">
      <div className="skeleton h-6 w-16 rounded-md" />
      <div className="skeleton h-9 w-3/4 rounded-full" />
      <div className="skeleton h-5 w-44 rounded-full" />
    </div>
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="skeleton h-5 w-full rounded-full" />
      ))}
      <div className="skeleton h-5 w-2/3 rounded-full" />
    </div>
  </div>
);

interface PageProps {
  params: Promise<{ id: string }>;
}

const NotificationDetailPage = ({ params }: PageProps) => {
  // Promise 형태의 params를 unwrapping 합니다.
  const { id } = use(params);
  const t = useTranslations();

  const {
    data: notice,
    isPending,
    isError,
    error,
    refetch,
  } = useNoticeDetailContentsQuery({ noticeId: id });

  const backToList = (
    <Link
      href="/notification"
      className="body-5 flex w-fit items-center gap-1.5 text-font-2 transition-colors hover:text-font-1"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      {t("notification.backToList")}
    </Link>
  );

  return (
    <article
      id="notice-detail-container"
      className="mx-auto flex w-full max-w-170 flex-col gap-6 pt-5"
    >
      {backToList}

      {isPending && <DetailSkeleton />}

      {/* 내려간 공지·없는 id 는 서버가 404 로 답합니다. 백지 대신 이유를 남깁니다. */}
      {isError && <ErrorState error={error} onRetry={refetch} />}

      {notice && (
        <>
          <header className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              {notice.isPinned && (
                <span className="flex w-fit items-center rounded-md bg-brand-opacity px-2 py-1">
                  <PinFill className="size-3.5 text-brand" aria-hidden="true" />
                </span>
              )}
              <span
                className={cn(
                  "caption-2 w-fit rounded-md px-2 py-1",
                  NOTICE_CATEGORY_STYLE[notice.category].bg,
                  NOTICE_CATEGORY_STYLE[notice.category].color,
                )}
              >
                {t(NOTICE_CATEGORY_STYLE[notice.category].labelKey)}
              </span>
            </div>

            <h1 className="heading-3 text-font-1">{notice.title}</h1>

            <div className="body-5 flex items-center gap-3 text-font-2">
              <time
                dateTime={dayjs(notice.updatedAt ?? notice.createdAt).toISOString()}
                className="flex items-center gap-1.5"
              >
                <Clock className="size-4" aria-hidden="true" />
                {/* 수정된 적 없는 공지는 updatedAt 이 비어 오므로 작성 시각을 보여줍니다. */}
                {dayjs(notice.updatedAt ?? notice.createdAt).format("YYYY-MM-DD HH:mm")}
              </time>
              <span>
                {t("notification.viewCount", {
                  count: formatStatCount(notice.viewCount),
                })}
              </span>
            </div>
          </header>

          <section className="body-3 flex flex-col gap-3 border-t border-main pt-6 text-font-1">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={markdownComponents}
            >
              {notice.content}
            </ReactMarkdown>
          </section>
        </>
      )}
    </article>
  );
};

export default NotificationDetailPage;
