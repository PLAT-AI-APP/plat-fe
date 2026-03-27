import React from "react";

interface TagListProps {
  list: string[];
}
const TagList = ({ list }: TagListProps) => {
  return (
    <ul className="flex gap-0.75 w-full h-4.5 overflow-hidden flex-wrap">
      {list.map((tag, index) => (
        <li
          key={`${tag}-${index}`}
          className="bg-border-main rounded-sm px-1 py-0.5 text-brand text-[10px] flex text-nowrap whitespace-nowrap shrink-0"
        >
          #{tag}
        </li>
      ))}
    </ul>
  );
};

export default TagList;
