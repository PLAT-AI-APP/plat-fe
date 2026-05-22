import { SIZE_CONFIG } from "./CharacterCard";

interface CharacterCardSkeletonProps {
  size?: "S" | "M" | "L" | "XL";
}

export const CharacterCardSkeleton = ({
  size = "M",
}: CharacterCardSkeletonProps) => {
  const config = SIZE_CONFIG[size];

  return (
    <article
      className={`inline-flex flex-col justify-start items-start animate-pulse ${config.wrapper}`}
    >
      {/* 1. 이미지 영역 스켈레톤 */}
      <div className={`bg-neutral-800 ${config.imageArea}`} />

      {/* 2. 정보 텍스트 영역 스켈레톤 */}
      <div
        className={`self-stretch flex flex-col justify-start items-start w-full ${config.infoArea}`}
      >
        {/* 제목 스켈레톤 (너비 75%) */}
        <div className="w-3/4 h-6 bg-neutral-800 rounded-md" />

        {/* 설명 스켈레톤 (너비 100%) */}
        <div className="w-full h-4 bg-neutral-800 rounded-md" />

        {/* 크리에이터 이름 스켈레톤 (너비 50%) */}
        <div className="w-1/2 h-3 bg-neutral-800 rounded-md mt-0.5" />

        {/* 채팅 수 스켈레톤 (너비 30%) */}
        <div className="w-1/3 h-3 bg-neutral-800 rounded-md mt-0.5" />
      </div>
    </article>
  );
};
