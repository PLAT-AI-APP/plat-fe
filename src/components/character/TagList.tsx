import React from "react";

interface TagListProps {
  list: string[];
}
const TagList = ({ list }: TagListProps) => {
  return (
    <ul className="flex gap-0.5 w-full overflow-hidden flex-wrap">
      {list.map((tag, index) => (
        <li
          key={`${tag}-${index}`}
          className="text-brand-dark text-[11px] flex text-nowrap whitespace-nowrap shrink-0"
        >
          #{tag}
        </li>
      ))}
    </ul>
  );
};

export default TagList;
