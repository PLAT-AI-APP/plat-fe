"use client";
import { useNoticeDetailContentsQuery } from "@/api/notice/getNoticeDetailContents";
import { Clock } from "@/icons";
import dayjs from "dayjs";
import React, { use } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}
const NotificationDetailPage = ({ params }: PageProps) => {
  // Promise 형태의 params를 unwrapping 합니다.
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { data: noticeDetailContents } = useNoticeDetailContentsQuery({
    noticeId: id,
  });

  if (!noticeDetailContents) return null;

  const { title, content, updatedAt } = noticeDetailContents;
  return (
    <article
      id="notice-detail-container"
      className="flex flex-col gap-9 pt-5 mx-auto max-w-170 w-full"
    >
      <header className="flex flex-col gap-1">
        {/* 공지사항 제목 text */}
        <h2 className="title-1">{title}</h2>

        {/* 공지사항 업로드 시간 */}
        <time className="flex items-center gap-1.5 text-font-2">
          <Clock className="w-4 h-4" />
          <span className="body-4">
            {dayjs(updatedAt).format("YYYY-MM-DD HH:mm:ss")}
          </span>
        </time>
      </header>

      {/* 공지사항 내용 text */}
      <section className="whitespace-pre-wrap body-2">
        <p>{content}</p>
      </section>
    </article>
  );
};

export default NotificationDetailPage;
