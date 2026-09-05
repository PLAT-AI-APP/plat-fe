import { cn } from "@/lib/utils";

interface EmptyStateProps {
  message: string;
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
const EmptyState = ({ message, children, className }: EmptyStateProps) => (
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

export default EmptyState;
