"use client";

import { useTranslations } from "next-intl";

export const useTranslateText = () => {
  const t = useTranslations();

  return (message?: string) => {
    if (!message) return message;

    return t.has(message) ? t(message) : message;
  };
};
