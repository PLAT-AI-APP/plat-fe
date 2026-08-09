"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const CharacterCreateBanner = () => {
  const t = useTranslations("studio");

  return (
    <div
      className={cn(
        "flex justify-between items-center rounded-3xl border border-main bg-darker px-5 py-4",
        "@max-[400px]:flex-col @max-[400px]:gap-6",
      )}
    >
      <div className="flex flex-col gap-1">
        <span className="title-3">{t("createTitle")}</span>
        <span className="body-4 text-font-2">{t("createDescription")}</span>
      </div>

      <Link
        href="/character-creat"
        className={cn(
          "flex h-10 items-center justify-center rounded-xl border border-brand bg-brand-opacity py-2.5 pl-4 pr-5 text-brand title-5",
        )}
      >
        {t("createAction")}
      </Link>
    </div>
  );
};

export default CharacterCreateBanner;
