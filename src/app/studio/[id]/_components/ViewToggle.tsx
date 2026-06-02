"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ViewGrid, ViewList } from "@/icons";
import { useChangeQueryString } from "@/hooks/useChangeQueryString";

interface ViewToggleProps {
  viewMode: "list" | "grid";
}

const ViewToggle = ({ viewMode }: ViewToggleProps) => {
  const changeQueryString = useChangeQueryString();

  const toggleViewMode = () => {
    const nextMode = viewMode === "list" ? "grid" : "list";
    changeQueryString({ updateKey: "view", updateValue: nextMode });
  };

  return (
    <button
      id="view-mode-toggle"
      onClick={toggleViewMode}
      className="relative flex items-center w-16.5 h-8.5 p-1 rounded-full border border-border-main bg-bg-darkest cursor-pointer overflow-hidden"
      aria-label={`Switch to ${viewMode === "list" ? "grid" : "list"} view`}
    >
      {/* 움직이는 배경원 */}
      <motion.div
        className="absolute h-6.5 w-6.5 rounded-full bg-[#2a304d]"
        initial={false}
        animate={{
          x: viewMode === "list" ? 0 : 29,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />

      {/* List 아이콘 영역 */}
      <span className="relative z-10 flex flex-1 justify-center items-center">
        <ViewList
          className={cn(
            "w-5 h-5 transition-colors",
            viewMode === "list" ? "" : "text-font-disabled",
          )}
        />
      </span>

      {/* Grid 아이콘 영역 */}
      <span className="relative z-10 flex flex-1 justify-center items-center">
        <ViewGrid
          className={cn(
            "w-5 h-5 transition-colors",
            viewMode === "grid" ? "" : "text-font-disabled",
          )}
        />
      </span>
    </button>
  );
};

export default ViewToggle;
