"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import CopyFill from "@/icons/CopyFill";
import { ArrowDown, Close, Trash } from "@/icons";
import { cn } from "@/lib/utils";

const GUIDE_ITEMS = [
  {
    type: "buttons",
    titleKey: "guideCopyTitle",
    descriptionKey: "guideCopyDescription",
  },
  {
    type: "drag",
    titleKey: "guideDragTitle",
    descriptionKey: "guideDragDescription",
  },
  {
    type: "code",
    titleKey: "guideCodeTitle",
    descriptionKey: "guideCodeDescription",
  },
] as const;

const AssetGuideVisual = ({
  type,
}: {
  type: (typeof GUIDE_ITEMS)[number]["type"];
}) => {
  if (type === "buttons") {
    return (
      <div className="flex size-full items-center justify-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-full bg-darkest text-font-2">
          <CopyFill className="size-4" />
        </span>
        <span className="flex size-7 items-center justify-center rounded-full text-font-2">
          <Trash className="size-4" />
        </span>
        <span className="flex size-7 items-center justify-center rounded-full text-font-2">
          <ArrowDown className="size-4" />
        </span>
      </div>
    );
  }

  if (type === "drag") {
    return (
      <div className="flex size-full items-center justify-center gap-2">
        <span className="size-1.5 rounded-full bg-font-2" />
        <span className="size-1.5 rounded-full bg-font-2" />
        <span className="size-1.5 rounded-full bg-font-2" />
      </div>
    );
  }

  return (
    <div className="body-5 flex size-full items-center justify-center text-font-2">
      {"{{img:platpl}}"}
    </div>
  );
};

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

      <div className="mt-6 flex flex-col gap-4">
        {GUIDE_ITEMS.map(({ type, titleKey, descriptionKey }) => (
          <section key={type} className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-[90px] w-[132px] shrink-0 items-center justify-center rounded-xl bg-card",
                type === "buttons" && "justify-start px-4",
              )}
            >
              <AssetGuideVisual type={type} />
            </div>

            <div className="min-w-0">
              <h4 className="body-5 text-font-1">{t(titleKey)}</h4>
              <p className="body-7 mt-2 text-font-2">{t(descriptionKey)}</p>
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
};

export default AssetGuidePanel;
