import { SIZE_CONFIG } from "./CharacterCard";

interface CharacterCardSkeletonProps {
  size?: "S" | "M" | "L" | "XL";
}
// 스켈레톤 전용 간격 매핑 (XL: 16px, L: 12px, M/S: 10px)
const SKELETON_GAP = {
  XL: "gap-4",
  L: "gap-3",
  M: "gap-2.5",
  S: "gap-2.5",
};

export const CharacterCardSkeleton = ({
  size = "M",
}: CharacterCardSkeletonProps) => {
  const config = SIZE_CONFIG[size];
  const isLarge = config.isIntegrated; // L, XL 여부 확인

  const infoAreaWithoutGap = config.infoArea.replace(/gap-\S+/g, "").trim();
  return (
    <article
      className={`inline-flex flex-col justify-start items-start animate-pulse ${config.wrapper}`}
    >
      {/* 1. 이미지 영역 스켈레톤 */}
      <div className={`bg-card-hover ${config.imageArea}`} />

      {/* 2. 정보 텍스트 영역 스켈레톤 */}
      <div
        className={`self-stretch flex flex-col justify-start items-start w-full ${infoAreaWithoutGap} ${SKELETON_GAP[size]}`}
      >
        {/* 첫 번째 줄 (제목) - L/XL은 살짝 더 크고, S/M은 작게 */}
        <div
          className={`bg-card-hover rounded-[50px] ${
            isLarge ? "h-5 w-1/2" : "h-4 w-1/2 mt-1"
          }`}
        />

        {/* 두 번째 줄 (설명) - L/XL은 길게, S/M은 중간 길이로 */}
        <div
          className={`bg-card-hover rounded-[50px] ${
            isLarge ? "h-4 w-11/12" : "h-4 w-3/4"
          }`}
        />

        {/* 세 번째 줄 (부가 정보) - L, XL 사이즈에만 노출 */}
        {isLarge && <div className="h-4 w-1/4 bg-card-hover rounded-[50px]" />}
      </div>
    </article>
  );
};
