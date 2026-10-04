import React from "react";
import { Message } from "@/icons";
import { cn } from "@/lib/utils";

interface ScenarioProps {
  text: string;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  /** 소설로 보기. 나레이션 아이콘 없이 글만 그린다. */
  isNovelView?: boolean;
}

const Scenario = ({
  text,
  className,
  iconClassName = "size-6",
  textClassName,
  isNovelView = false,
}: ScenarioProps) => {
  return (
    <section id="scenario-item" className={cn("flex gap-5", className)}>
      {!isNovelView && (
        <Message className={cn("shrink-0 text-font-2", iconClassName)} />
      )}
      <p
        className={cn(
          "body-4 whitespace-pre-wrap text-narration",
          isNovelView && "min-w-0 flex-1",
          textClassName,
        )}
      >
        {text}
      </p>
    </section>
  );
};

// 스트리밍 중 글이 그대로인 앞 블록은 다시 그리지 않는다(CharacterChat 과 같은 이유).
export default React.memo(Scenario);
