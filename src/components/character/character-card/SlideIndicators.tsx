import { cn } from "@/lib/utils";
import React from "react";

interface SlideIndicatorsProps {
  imageCount: number;
  currentIndex: number;
  variant: "standard" | "large";
  forceImageInactive?: boolean;
  onImageSelect: (event: React.MouseEvent, index: number) => void;
  onActionSelect?: (event: React.MouseEvent) => void;
  isActionActive?: boolean;
}

const SlideIndicators = ({
  imageCount,
  currentIndex,
  variant,
  forceImageInactive = false,
  onImageSelect,
  onActionSelect,
  isActionActive = false,
}: SlideIndicatorsProps) => {
  const isLarge = variant === "large";

  return (
    // 카드 전체를 덮는 stretched link 위에 이 영역만 걸쳐 있어, wrapper는
    // pointer-events-none으로 링크 클릭을 통과시키고 각 버튼만 다시 받게 합니다.
    <div
      className={cn(
        "pointer-events-none flex items-center gap-1",
        isLarge
          ? "self-stretch justify-center gap-2"
          : "absolute bottom-3 left-1/2 z-10 -translate-x-1/2 justify-between",
      )}
    >
      {Array.from({ length: imageCount }).map((_, index) => {
        const isActive = !forceImageInactive && index === currentIndex;

        return (
          <button
            key={index}
            type="button"
            onClick={(event) => onImageSelect(event, index)}
            className={cn(
              "pointer-events-auto cursor-pointer rounded-full transition hover:brightness-125",
              isLarge ? "size-2" : "h-2 w-2",
              isActive
                ? cn("bg-brand", !isLarge && "scale-110")
                : isLarge
                  ? "bg-font-1"
                  : "bg-scrim",
            )}
            aria-label={`View image ${index + 1}`}
          />
        );
      })}

      {onActionSelect && (
        <button
          type="button"
          onClick={onActionSelect}
          className={cn(
            "pointer-events-auto size-2 cursor-pointer rounded-full transition-colors",
            isActionActive ? "bg-brand" : "bg-font-1",
          )}
          aria-label="View profile action"
        />
      )}
    </div>
  );
};

export default SlideIndicators;
