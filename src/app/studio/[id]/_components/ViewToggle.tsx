"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ViewGrid, ViewList } from "@/icons";
import { useChangeQueryString } from "@/hooks/useChangeQueryString";
import { SPRING_SNAPPY } from "@/constants/motion";

interface ViewToggleProps {
  viewMode: "list" | "grid";
}

const ViewToggle = ({ viewMode }: ViewToggleProps) => {
  const t = useTranslations("studio");
  const changeQueryString = useChangeQueryString();

  const toggleViewMode = () => {
    const nextMode = viewMode === "list" ? "grid" : "list";
    changeQueryString({ updateKey: "view", updateValue: nextMode });
  };

  return (
    <button type="button"
      id="view-mode-toggle"
      onClick={toggleViewMode}
      className="relative flex h-8.5 w-16.5 cursor-pointer items-center overflow-hidden rounded-full border border-main bg-darkest p-1"
      aria-label={viewMode === "list" ? t("switchToGrid") : t("switchToList")}
    >
      <motion.div
        className="absolute h-6.5 w-6.5 rounded-full bg-card-selected"
        initial={false}
        animate={{ x: viewMode === "list" ? 0 : 29 }}
        transition={SPRING_SNAPPY}
      />

      <span className="relative z-10 flex flex-1 items-center justify-center">
        <ViewList
          className={cn(
            "h-5 w-5 transition-colors",
            viewMode === "list" ? "" : "text-font-disabled",
          )}
        />
      </span>

      <span className="relative z-10 flex flex-1 items-center justify-center">
        <ViewGrid
          className={cn(
            "h-5 w-5 transition-colors",
            viewMode === "grid" ? "" : "text-font-disabled",
          )}
        />
      </span>
    </button>
  );
};

export default ViewToggle;
