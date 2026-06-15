"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Info } from "@/icons";

const ChattingRoomNotice = () => {
  const t = useTranslations("chatRoom");

  return (
    <p className="body-6 flex items-center justify-center gap-1 pb-5.75 pt-4">
      <Info className="h-5 w-5" />
      {t("generatedNotice")}
    </p>
  );
};

export default ChattingRoomNotice;
