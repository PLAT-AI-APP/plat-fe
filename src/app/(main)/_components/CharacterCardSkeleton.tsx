import { SIZE_CONFIG } from "./character-card/constants";

interface CharacterCardSkeletonProps {
  size?: "S" | "M" | "L" | "XL";
}

const SKELETON_GAP = {
  XL: "gap-4",
  L: "gap-3",
  M: "gap-2.5",
  S: "gap-2.5",
};

export const CharacterCardSkeleton = ({
  size = "M",
}: CharacterCardSkeletonProps) => {
  if (size === "L") {
    return (
      <article className="relative size-96 inline-flex flex-col justify-end items-center overflow-hidden rounded-2xl bg-card-hover animate-pulse">
        <div className="relative z-10 self-stretch h-36 px-4 pt-6 pb-5 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.4)_20%,rgba(0,0,0,0.8)_100%)] rounded-b-2xl flex flex-col justify-end items-start gap-2">
          <div className="h-5 w-1/2 rounded-[50px] bg-card" />
          <div className="h-4 w-11/12 rounded-[50px] bg-card" />
          <div className="h-4 w-1/4 rounded-[50px] bg-card" />
          <div className="self-stretch inline-flex justify-center items-center gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="size-2 rounded-full bg-card" />
            ))}
          </div>
        </div>
      </article>
    );
  }

  const config = SIZE_CONFIG[size];
  const infoAreaWithoutGap = config.infoArea.replace(/gap-\S+/g, "").trim();

  return (
    <article
      className={`inline-flex flex-col justify-start items-start animate-pulse ${config.wrapper}`}
    >
      <div className={`bg-card-hover ${config.imageArea}`} />

      <div
        className={`self-stretch flex flex-col justify-start items-start w-full ${infoAreaWithoutGap} ${SKELETON_GAP[size]}`}
      >
        <div className="h-4 w-1/2 rounded-[50px] bg-card-hover mt-1" />
        <div className="h-4 w-3/4 rounded-[50px] bg-card-hover" />
        {size === "M" && (
          <div className="h-4 w-1/4 rounded-[50px] bg-card-hover" />
        )}
      </div>
    </article>
  );
};
