import { ChatFill } from "@/icons";
import { cn, formatStatCount } from "@/lib/utils";
import { useLocaleStore } from "@/store/useLocaleStore";

interface ChatCountBadgeProps {
  chatCount: number;
  variant: "floating" | "inline";
  textClassName: string;
  iconClassName?: string;
}

const ChatCountBadge = ({
  chatCount,
  variant,
  textClassName,
  iconClassName,
}: ChatCountBadgeProps) => {
  const locale = useLocaleStore((state) => state.locale);

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center gap-1",
        variant === "floating" &&
          // 헤더(z-20)처럼 sticky+z-index로 별도 스태킹 컨텍스트를 만드는 요소와
          // 같은 z-20으로 경쟁하면 DOM 순서상 뒤에 오는 카드가 팝오버/다이얼로그
          // 위로 그려지는 문제가 있어, 카드 내부 다른 오버레이와 같은 z-10으로 낮춘다.
          "absolute right-[13.7px] top-4.25 z-10 min-w-13.5 rounded-lg bg-card px-1 py-0.5",
      )}
    >
      <div
        data-icon="chat-fill"
        className="relative flex size-4 items-center justify-center overflow-hidden"
      >
        <ChatFill className={cn("size-4", iconClassName || "text-font-2")} />
      </div>
      <span className={cn("text-font-2", textClassName)}>
        {formatStatCount(chatCount, locale)}
      </span>
    </div>
  );
};

export default ChatCountBadge;
