"use client";

import { useVisibleItemCount } from "@/hooks/useVisibleItemCount";

interface OverflowTagListProps {
  tags: { id: string; label: string }[];
  maxLines?: number;
}

const OverflowTagList = ({ tags, maxLines = 1 }: OverflowTagListProps) => {
  const { containerRef, itemRefs, visibleCount, hiddenCount } =
    useVisibleItemCount({
      items: tags,
      maxLines,
    });

  return (
    <div
      className="
        w-full
        p-3
        bg-card
        rounded-xl
        flex
        items-start
        gap-2
      "
    >
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <div className="body-4 text-font-1">장난꾸러기 소꿉친구</div>

        <div className="flex">
          <div
            ref={containerRef}
            className="
            flex
            flex-wrap
            gap-1
            h-5
            overflow-hidden
          "
          >
            {tags.map((tag, index) => {
              const isVisible = index < visibleCount;

              return (
                <div
                  key={`${tag.id}-${index}`}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className={`
                    px-1.5
                    py-0.5
                    bg-card-hover
                    rounded-md
                    flex
                    items-center
                    gap-0.5
                    shrink-0
                    ${isVisible ? "" : "invisible pointer-events-none"}
                  `}
                >
                  <span className="body-6 text-font-2">#</span>

                  <span className="body-6 whitespace-nowrap text-font-2">
                    {tag.label}
                  </span>
                </div>
              );
            })}
          </div>
          {hiddenCount > 0 && (
            <div
              className="
                px-1.5
                py-0.5
                bg-card-hover
                rounded-md
                flex
                items-center
                shrink-0
              "
            >
              <span className="body-6 text-font-2">+{hiddenCount}</span>
            </div>
          )}
        </div>
      </div>

      <div className="body-4 text-font-disabled">✔</div>
    </div>
  );
};

export default OverflowTagList;
