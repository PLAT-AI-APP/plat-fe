import React from "react";
import { cn } from "@/lib/utils";
import type { EarningUniverseLabel } from "@/type/earning";

/** 캐릭터 썸네일. 이미지가 없거나 지워진 캐릭터는 이름 첫 글자를 둔다. 서버가 80px 로 준다. */
const CharacterThumb = ({
  label,
  size = 44,
}: {
  label: EarningUniverseLabel;
  size?: number;
}) => {
  if (label.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={label.imageUrl}
        alt=""
        width={size}
        height={size}
        className="shrink-0 rounded-xl bg-darkest object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        "title-5 flex shrink-0 items-center justify-center rounded-xl bg-darkest",
        label.active ? "text-font-2" : "text-font-disabled",
      )}
      style={{ width: size, height: size }}
    >
      {label.title?.slice(0, 1) ?? "?"}
    </span>
  );
};

export default CharacterThumb;
