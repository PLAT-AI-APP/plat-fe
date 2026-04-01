import { ModalLayout } from "@/components/ModalLayout";
import { Sort } from "@/icons";
import Check from "@/icons/Check";
import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";

const CommentHeader = ({
  count,
  sort,
  handleSort,
}: {
  count: number;
  sort: string;
  handleSort: (val: string) => void;
}) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const triggerRef = useRef(null);

  return (
    <header className="flex justify-between">
      <span>댓글 {count}개</span>
      <button
        ref={triggerRef}
        onClick={() => setIsSortOpen(!isSortOpen)}
        className="relative flex items-center gap-1.5 text-sm"
      >
        <Sort className="w-3.5 h-3.5" /> {sort}
        {isSortOpen && (
          <ModalLayout
            onClose={() => setIsSortOpen(false)}
            triggerRef={triggerRef}
          >
            <ul className="flex flex-col gap-1 text-nowrap">
              <li
                onClick={() => handleSort("최신 순")}
                className={cn(
                  "w-33.5 text-sm flex items-center justify-between px-2.5 py-2 rounded-lg ",
                  sort === "최신 순" ? "font-medium" : "hover:bg-btn-hover",
                )}
              >
                최신 순
                {sort === "최신 순" && <Check className="w-4 h-4 text-brand" />}
              </li>
              <li
                onClick={() => handleSort("인기순")}
                className={cn(
                  "w-33.5 text-sm flex items-center justify-between px-2.5 py-2 rounded-lg ",
                  sort === "인기순" ? "font-medium" : "hover:bg-btn-hover",
                )}
              >
                인기순
                {sort === "인기순" && <Check className="w-4 h-4 text-brand" />}
              </li>
            </ul>
          </ModalLayout>
        )}
      </button>
    </header>
  );
};

export default CommentHeader;
