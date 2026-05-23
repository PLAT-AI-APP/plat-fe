import { Search } from "@/icons";
import Check from "@/icons/Check";
import { cn } from "@/lib/utils";
import React from "react";
import Research from "./Research";
import Suggestion from "./Suggestion";

const TagSidebar = () => {
  return (
    <aside className="w-66.25 bg-bg-dark py-4 px-3">
      <div
        id="tag-sidebar-content"
        className="w-60 inline-flex flex-col items-start gap-9"
      >
        {/* 취향 추천 태그 영역 */}
        <Suggestion />

        {/* 탐색 태그 영역 */}
        <Research />
      </div>
    </aside>
  );
};

export default TagSidebar;
