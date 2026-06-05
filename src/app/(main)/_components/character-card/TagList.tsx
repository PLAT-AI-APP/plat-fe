import { cn } from "@/lib/utils";

interface TagListProps {
  tags: string[];
  selectedTagSet: Set<string>;
  currentTag: string;
}

const TagList = ({ tags, selectedTagSet, currentTag }: TagListProps) => {
  if (tags.length === 0) return null;

  return (
    <ul className="flex h-5.5 flex-wrap items-center justify-start gap-1 overflow-hidden">
      {tags.slice(0, 5).map((tag) => (
        <li
          key={tag}
          className={cn(
            "flex shrink-0 items-center justify-center",
            currentTag === tag && "text-brand",
          )}
        >
          <div
            className={cn(
              "body-5 text-font-2",
              selectedTagSet.has(tag) && "text-brand",
            )}
          >
            #{tag}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TagList;
