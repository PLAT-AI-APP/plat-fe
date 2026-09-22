import { cn } from "@/lib/utils";
import EmptyMascot, { type MascotMood } from "./EmptyMascot";

interface EmptyStateProps {
  message: string;
  /**
   * 넘기면 문구 위에 캐릭터가 얼굴을 내민다.
   * 넘기지 않으면 예전처럼 문구만 보여준다(좁은 자리용).
   */
  mood?: MascotMood;
  /** sm 은 댓글·태그 목록처럼 좁은 자리용. 캐릭터와 여백을 줄인다. */
  size?: "md" | "sm";
  /** 안내 아래에 덧붙일 보조 문구나 행동 버튼입니다. */
  children?: React.ReactNode;
  className?: string;
}

/**
 * 요청은 성공했는데 보여줄 것이 없을 때의 표시.
 *
 * 실패(ErrorState)와 반드시 구분해서 쓴다. 둘을 뭉치면 서버가 죽은 상황이
 * "아직 아무것도 없어요"로 보여 사용자가 잘못된 결론을 내린다.
 */
const EmptyState = ({
  message,
  mood,
  size = "md",
  children,
  className,
}: EmptyStateProps) => {
  if (!mood) {
    return (
      <div
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 px-6 py-10 text-center",
          className,
        )}
      >
        <p className="body-4 text-font-2">{message}</p>
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center text-center",
        size === "sm" ? "gap-2.5 px-4 py-6" : "gap-4 px-6 py-10",
        className,
      )}
    >
      {/* 카드 없이 어느 면 위에서도 쓰이도록, 바닥은 잘라내는 대신 배경으로 스며들게 한다 */}
      <EmptyMascot
        mood={mood}
        className={cn(
          "[mask-image:linear-gradient(to_bottom,#000_72%,transparent)]",
          size === "sm" ? "w-36" : "w-64",
        )}
      />
      <p
        className={cn(
          "text-font-2 break-keep",
          size === "sm" ? "body-5" : "body-3",
        )}
      >
        {message}
      </p>
      {children}
    </div>
  );
};

export default EmptyState;
