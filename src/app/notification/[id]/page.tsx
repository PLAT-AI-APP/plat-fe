import { Clock } from "@/icons";
import React from "react";

const DUMMY_TEXT = `안녕하세요, 플랫입니다.
 
보다 안정적인 서비스 제공과 개선을 위해 점검이 진행될 예정입니다.
 
점검 일정: 2026년 2월 27일(금) 03:00 ~ 09:00
※ 점검은 목요일에서 금요일로 넘어가는 새벽 시간에 진행됩니다.
 
점검 시간 동안 서비스 이용이 일시적으로 제한될 수 있으며, 다소 긴 점검이 진행되는 점 너른 양해 부탁드립니다.
또한, 안정적인 점검을 위해 작업 시간은 상황에 따라 연장되거나 변동될 수 있습니다.
 
감사합니다.
플랫챗 드림`;

const NotificationDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  return (
    <article
      id="notice-detail-container"
      className="flex flex-col gap-9 pt-5 mx-auto max-w-170 w-full"
    >
      <header className="flex flex-col gap-1">
        {/* 공지사항 제목 text */}
        <h2 className="text-[20px] font-medium">서비스 이용 약관 변경 안내</h2>

        {/* 공지사항 업로드 시간 */}
        <time className="flex items-center gap-1.5 text-font-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm">2026-02-03 23:42:33</span>
        </time>
      </header>

      {/* 공지사항 내용 text */}
      <section className="whitespace-pre-wrap">
        <p>{DUMMY_TEXT}</p>
      </section>
    </article>
  );
};

export default NotificationDetailPage;
