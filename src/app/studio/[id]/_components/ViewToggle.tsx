"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ViewGrid, ViewList } from "@/icons";

const ViewToggle = () => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "list" ? "grid" : "list"));
  };

  return (
    <div
      onClick={toggleViewMode}
      className="relative flex items-center w-16.5 h-8.5 p-1 rounded-full border border-border-main bg-bg-darkest cursor-pointer overflow-hidden"
    >
      {/* 움직이는 배경원 */}
      <motion.div
        className="absolute h-6.5 w-6.5 rounded-full bg-[#2a304d]"
        initial={false}
        animate={{
          // 부모 p-1(4px) 기준:
          // list일 때 0 (가장 왼쪽)
          // grid일 때 전체 너비의 절반만큼 이동 (정확히 오른쪽 아이콘 위치)
          x: viewMode === "list" ? 0 : 29,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />

      {/* List 아이콘 영역 */}
      <div className="relative z-10 flex flex-1 justify-center items-center">
        <ViewList
          className={cn(
            "w-5 h-5 transition-colors duration-200",
            viewMode === "list" ? "" : "text-font-disabled",
          )}
        />
      </div>

      {/* Grid 아이콘 영역 */}
      <div className="relative z-10 flex flex-1 justify-center items-center">
        <ViewGrid
          className={cn(
            "w-5 h-5 transition-colors duration-200",
            viewMode === "grid" ? "" : "text-font-disabled",
          )}
        />
      </div>
    </div>
  );
};

export default ViewToggle;
