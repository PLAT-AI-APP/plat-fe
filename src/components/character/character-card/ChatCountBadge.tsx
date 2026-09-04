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
          "absolute right-[13.7px] top-4.25 z-20 min-w-13.5 rounded-lg bg-card px-1 py-0.5",
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
