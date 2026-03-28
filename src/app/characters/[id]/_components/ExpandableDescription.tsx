import { ArrowDown } from "@/icons";
import { cn } from "@/lib/utils";

interface ExpandableDescriptionProps {
  content: string;
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
  shouldShowExpand: boolean;
  textRef: React.RefObject<HTMLParagraphElement | null>;
}

export const ExpandableDescription = ({
  content,
  isExpanded,
  setIsExpanded,
  shouldShowExpand,
  textRef,
}: ExpandableDescriptionProps) => {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-font-1 font-medium">캐릭터 정보</h3>
      <div
        id="description-body"
        className={cn(
          "relative",
          shouldShowExpand &&
            !isExpanded &&
            "after:absolute after:bottom-0 after:left-0 after:w-full after:h-full after:bg-linear-to-t after:from-bg-dark after:to-transparent after:pointer-events-none",
        )}
      >
        <p
          ref={textRef}
          className={cn(
            "whitespace-pre-wrap text-sm text-font-2 leading-relaxed overflow-hidden transition-all duration-500",
            shouldShowExpand && !isExpanded ? "max-h-22" : "",
          )}
        >
          {content}
        </p>
      </div>

      {shouldShowExpand && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          className="flex justify-center items-center gap-1 p-1 pl-2 text-[12px] text-font-2 hover:text-white transition-colors z-10"
        >
          {isExpanded ? "접기" : "펼치기"}
          <ArrowDown
            className={cn(
              "w-4 h-4 transition-transform",
              isExpanded && "rotate-180",
            )}
          />
        </button>
      )}
    </section>
  );
};

export default ExpandableDescription;
