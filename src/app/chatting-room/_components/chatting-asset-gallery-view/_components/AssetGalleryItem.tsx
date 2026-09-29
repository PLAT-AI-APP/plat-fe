"use client";

import Image from "next/image";
import { LockLine } from "@/icons";
import { useTranslations } from "next-intl";
import type { ChatAssetGalleryItem } from "@/type/chat";

interface AssetGalleryItemProps {
  asset: ChatAssetGalleryItem;
  onSelect: (asset: ChatAssetGalleryItem) => void;
}

/**
 * 갤러리 한 칸. 잠긴 칸은 서버가 이미지 주소를 주지 않으므로 자물쇠만 그린다
 * (예전 목업처럼 흐린 원본을 깔면 주소가 그대로 새어 나간다).
 */
const AssetGalleryItem = ({ asset, onSelect }: AssetGalleryItemProps) => {
  const t = useTranslations("chatRoom.sidebar");

  if (asset.isLocked || !asset.imageUrl) {
    return (
      <div
        role="img"
        aria-label={t("assetLocked")}
        className="relative flex aspect-square w-full min-w-0 items-center justify-center overflow-hidden rounded-xl bg-card-hover"
      >
        <LockLine className="size-[30px] text-font-disabled" />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(asset)}
      className="relative isolate block aspect-square w-full min-w-0 overflow-hidden rounded-xl bg-card-hover transition-opacity hover:opacity-90"
      // 이미지는 이 버튼 안의 장식이라 alt 는 비우고, 이름은 버튼이 갖는다.
      aria-label={asset.name ?? t("assetView")}
    >
      <Image
        src={asset.imageUrl}
        alt=""
        fill
        sizes="(max-width: 400px) calc((100vw - 49px) / 2), 152px"
        className="object-cover"
      />
    </button>
  );
};

export default AssetGalleryItem;
