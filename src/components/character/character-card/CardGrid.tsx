import { cn } from "@/lib/utils";
import {
  CARD_COLUMNS_CLASS,
  DEFAULT_CARD_COLUMNS,
  type CardColumnCount,
} from "./constants";
import type { CardSize } from "./types";

interface CardGridProps {
  children: React.ReactNode;
  /** 놓이는 카드의 크기. 열 수 기본값이 여기서 정해진다. */
  size?: CardSize;
  /** 기본 열 수를 덮어써야 하는 섹션만 지정한다. */
  columns?: CardColumnCount;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 카드가 놓이는 격자.
 *
 * 카드 목록을 그리는 화면이 저마다 격자를 직접 짜고 있었다 — 홈은 열 계약,
 * 프로필·공식은 auto-fit + minmax, 랭킹·신작·검색은 고정폭 카드의 flex-wrap.
 * 그래서 같은 카드가 화면마다 다른 폭으로 그려졌고, flex-wrap 쪽은 카드가
 * 폭만 줄어들고 높이는 고정이라 비율까지 무너졌다(검색 첫 화면에서 187:245
 * 카드가 108:245 로 찌그러졌다). 격자는 이 컴포넌트 하나만 쓴다.
 *
 * 열 계약은 컨테이너 쿼리라 바깥에 @container 가 필요하다. 그 컨테이너를 이
 * 컴포넌트가 직접 두르므로, 호출하는 쪽은 어디에 놓든 폭에 맞는 열 수를 얻는다.
 */
export const CardGrid = ({
  children,
  size = "S",
  columns,
  className,
  style,
}: CardGridProps) => (
  <div className="@container w-full">
    <div
      className={cn(
        "grid gap-x-4 gap-y-7",
        CARD_COLUMNS_CLASS[columns ?? DEFAULT_CARD_COLUMNS[size]],
        className,
      )}
      style={style}
    >
      {children}
    </div>
  </div>
);

export default CardGrid;
