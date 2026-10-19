import React from "react";
import { Info } from "@/icons";
import { cn } from "@/lib/utils";

interface InfoTipProps {
  /** 설명 문구 */
  text: string;
  /** 말풍선을 아이콘의 어느 쪽에 맞출지. 화면 오른쪽 끝에서는 end 로 넘치지 않게 한다. */
  align?: "start" | "end";
  className?: string;
}

/** 제목 옆 (i) 아이콘. 마우스를 올리거나 눌러 초점이 가면 설명이 뜬다. */
const InfoTip = ({ text, align = "start", className }: InfoTipProps) => (
  <span className={cn("group relative inline-flex", className)}>
    <button
      type="button"
      aria-label={text}
      className="flex text-font-disabled transition-colors hover:text-font-2 focus-visible:text-font-2"
    >
      <Info className="size-3.5" aria-hidden="true" />
    </button>
    <span
      role="tooltip"
      className={cn(
        "body-7 pointer-events-none absolute top-full z-10 mt-1.5 w-56 rounded-xl border border-main bg-dark px-3 py-2 text-font-1 opacity-0 shadow-popover transition-opacity group-focus-within:opacity-100 group-hover:opacity-100",
        align === "start" ? "-left-2" : "-right-2",
      )}
    >
      {text}
    </span>
  </span>
);

export default InfoTip;
