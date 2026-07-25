"use client";

import Image from "next/image";
import { LockLine } from "@/icons";
import { cn } from "@/lib/utils";
import type { ChatAssetGalleryItem } from "@/type/chat";

interface AssetGalleryItemProps {
  asset: ChatAssetGalleryItem;
}

const AssetGalleryItem = ({ asset }: AssetGalleryItemProps) => {
  return (
    <button
      type="button"
      className="relative block aspect-square w-full min-w-0 overflow-hidden rounded-xl bg-[#d9d9d9]"
      aria-disabled={asset.isLocked}
    >
      <Image
        src={asset.imageUrl}
        alt=""
        fill
        sizes="(max-width: 400px) calc((100vw - 49px) / 2), 152px"
        className={cn(
          "rounded-xl object-cover",
          asset.isLocked && "scale-105 blur-[4px]",
        )}
      />

      {asset.isLocked && (
        <>
          <span className="absolute inset-0 rounded-xl bg-black/50" />
          <span className="absolute inset-0 flex items-center justify-center">
            <LockLine className="size-[30px] text-white" />
          </span>
        </>
      )}
    </button>
  );
};

export default AssetGalleryItem;
