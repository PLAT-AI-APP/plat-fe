"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Info } from "@/icons";

const ChattingRoomNotice = () => {
  const t = useTranslations();

  return (
    <div className="body-7 flex items-center justify-center gap-1 pb-5 pt-4 text-font-disabled">
      <Info className="size-3.5" />
      <span>{t("chatRoom.generatedNotice")}</span>
    </div>
  );
};

export default ChattingRoomNotice;
