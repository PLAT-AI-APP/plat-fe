import { cn } from "@/lib/utils";
import React from "react";

interface TagListProps {
  list: string[];
  className?: string;
}
const TagList = ({ list, className }: TagListProps) => {
  return (
    <ul
      className={cn(
        "flex gap-0.5 w-full overflow-hidden flex-wrap text-[11px]",
        className,
      )}
    >
      {list.map((tag, index) => (
        <li
          key={`${tag}-${index}`}
          className="text-brand-dark flex text-nowrap whitespace-nowrap shrink-0"
        >
          #{tag}
        </li>
      ))}
    </ul>
  );
};

export default TagList;
