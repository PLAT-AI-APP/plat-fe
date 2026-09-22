"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { parseNoticeCategory } from "@/constants/notice";
import FilterTab from "./FilterTab";
import NoticeList from "./NoticeList";

/**
 * 필터는 서버가 아니라 여기서 주소를 읽는다. 서버 page 가 읽으면 필터를 누를 때마다 서버 렌더를
 * 다시 받느라 선택 표시가 늦고, notification/loading.tsx 가 화면 전체를 가렸다.
 */
const NotificationContents = () => {
  const t = useTranslations();
  // 서버로 보내는 값이라 알 수 없는 filter 는 전체로 본다.
  const currentFilter = parseNoticeCategory(
    useSearchParams().get("filter") ?? undefined,
  );

  return (
    <section className="mx-auto flex w-full max-w-155 flex-col gap-9">
      <header>
        <h1 className="heading-2">{t("notification.title")}</h1>
      </header>

      <div id="notice-content-area" className="flex flex-col gap-4">
        <nav>
          <FilterTab currentFilter={currentFilter} />
        </nav>

        <NoticeList currentFilter={currentFilter} />
      </div>
    </section>
  );
};

export default NotificationContents;
