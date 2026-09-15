"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Close } from "@/icons";

const AssetGuidePanel = () => {
  const t = useTranslations("characterCreate.asset");
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <aside className="mt-9 flex w-full flex-col rounded-3xl bg-darkest px-4 py-5">
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="title-3 text-font-1">{t("guidePanelTitle")}</h3>
          <p className="body-7 mt-1 text-font-2">
            {t("guidePanelDescription")}
          </p>
        </div>

        <button
          type="button"
          aria-label={t("closeGuide")}
          onClick={() => setIsVisible(false)}
          className="flex size-6 shrink-0 items-center justify-center text-font-2 hover:text-font-1"
        >
          <Close className="size-5" />
        </button>
      </header>

      <div className="mt-6 flex items-center gap-4">
        <div className="flex h-[90px] w-[132px] shrink-0 items-center justify-center rounded-xl bg-card">
          <div className="flex size-full items-center justify-center gap-2">
            <span className="size-1.5 rounded-full bg-font-2" />
            <span className="size-1.5 rounded-full bg-font-2" />
            <span className="size-1.5 rounded-full bg-font-2" />
          </div>
        </div>

        <div className="min-w-0">
          <h4 className="body-5 text-font-1">{t("guideDragTitle")}</h4>
          <p className="body-7 mt-2 text-font-2">{t("guideDragDescription")}</p>
        </div>
      </div>
    </aside>
  );
};

export default AssetGuidePanel;
