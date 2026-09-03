"use client";

import Image from "next/image";
import { LockLine } from "@/icons";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { ChatAssetGalleryItem } from "@/type/chat";

interface AssetGalleryItemProps {
  asset: ChatAssetGalleryItem;
}

const AssetGalleryItem = ({ asset }: AssetGalleryItemProps) => {
  const t = useTranslations("chatRoom.sidebar");

  return (
    <button
      type="button"
      className="relative isolate block aspect-square w-full min-w-0 overflow-hidden rounded-xl bg-card-hover transition-opacity hover:opacity-90"
      // 이미지는 이 버튼 안의 장식이라 alt 는 비우고, 이름은 버튼이 갖는다.
      aria-label={t("assetView")}
      aria-disabled={asset.isLocked}
    >
      <Image
        src={asset.imageUrl}
        alt=""
        fill
        sizes="(max-width: 400px) calc((100vw - 49px) / 2), 152px"
        className={cn("object-cover", asset.isLocked && "scale-105 blur-[4px]")}
      />

      {asset.isLocked && (
        <>
          <span className="absolute inset-0 z-10 bg-scrim/50" />
          <span className="absolute inset-0 z-20 flex items-center justify-center">
            <LockLine className="size-[30px] text-overlay-font" />
          </span>
        </>
      )}
    </button>
  );
};

export default AssetGalleryItem;
