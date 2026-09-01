"use client";

import React from "react";
import { useTranslations } from "next-intl";
import FilterTab from "./FilterTab";
import NoticeList from "./NoticeList";

interface NotificationContentsProps {
  currentFilter: "NOTICE" | "UPDATE" | "EVENT" | null | undefined;
}

const NotificationContents = ({ currentFilter }: NotificationContentsProps) => {
  const t = useTranslations();

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
