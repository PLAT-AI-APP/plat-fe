import { FLUID_SIZE_OVERRIDE, SIZE_CONFIG } from "./character-card/constants";

interface CharacterCardSkeletonProps {
  size?: "S" | "M" | "L" | "XL";
  fluid?: boolean;
}

const SKELETON_GAP = {
  XL: "gap-4",
  L: "gap-3",
  M: "gap-2.5",
  S: "gap-2.5",
};

export const CharacterCardSkeleton = ({
  size = "M",
  fluid = false,
}: CharacterCardSkeletonProps) => {
  if (size === "L") {
    return (
      <article
        className={`relative inline-flex flex-col justify-end items-center overflow-hidden rounded-2xl skeleton ${fluid ? FLUID_SIZE_OVERRIDE.L.wrapper : "size-96"}`}
      >
        <div className="relative z-10 self-stretch h-36 px-4 pt-6 pb-5 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.4)_20%,rgba(0,0,0,0.8)_100%)] rounded-b-2xl flex flex-col justify-end items-start gap-2">
          <div className="h-5 w-1/2 rounded-full skeleton" />
          <div className="h-4 w-11/12 rounded-full skeleton" />
          <div className="h-4 w-1/4 rounded-full skeleton" />
          <div className="self-stretch inline-flex justify-center items-center gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="size-2 rounded-full skeleton" />
            ))}
          </div>
        </div>
      </article>
    );
  }

  const config = SIZE_CONFIG[size];
  const fluidOverride = FLUID_SIZE_OVERRIDE[size];
  const infoAreaWithoutGap = config.infoArea.replace(/gap-\S+/g, "").trim();

  return (
    <article
      className={`inline-flex flex-col justify-start items-start ${fluid ? fluidOverride.wrapper : config.wrapper}`}
    >
      <div
        className={`skeleton ${fluid ? fluidOverride.imageArea : config.imageArea}`}
      />

      <div
        className={`self-stretch flex flex-col justify-start items-start w-full ${infoAreaWithoutGap} ${SKELETON_GAP[size]}`}
      >
        <div className="h-4 w-1/2 rounded-full skeleton mt-1" />
        <div className="h-4 w-3/4 rounded-full skeleton" />
        {size === "M" && <div className="h-4 w-1/4 rounded-full skeleton" />}
      </div>
    </article>
  );
};
