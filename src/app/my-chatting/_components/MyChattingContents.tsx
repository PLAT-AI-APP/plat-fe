"use client";

import React from "react";
import { useTranslations } from "next-intl";
import ChattingList from "./ChattingList";

const MyChattingContents = () => {
  const t = useTranslations();

  return (
    <section className="mx-auto flex w-full max-w-175 flex-col gap-9 pt-7.5">
      <h1 className="heading-2">{t("myChatting.title")}</h1>
      <ChattingList />
    </section>
  );
};

export default MyChattingContents;
