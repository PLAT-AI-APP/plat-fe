"use client";

import React from "react";
import { useTranslations } from "next-intl";

const Loading = () => {
  const t = useTranslations();

  return <div>{t("loading.text")}</div>;
};

export default Loading;
