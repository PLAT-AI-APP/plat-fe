"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useChatAssetGalleryQuery } from "@/api/chat/getChatAssetGallery";
import SkeletonAssetGallery from "@/components/skeleton/SkeletonAssetGallery";
import { EmptyState, ErrorState } from "@/components/state";
import { useFadeInAfterLoading } from "@/hooks/common/useFadeInAfterLoading";
import { cn } from "@/lib/utils";
import { ArrowLeft, ImageIcon } from "@/icons";
import type { ChatAssetGalleryItem } from "@/type/chat";
import AssetGalleryItem from "./_components/AssetGalleryItem";

interface ChattingAssetGalleryViewProps {
  roomId: string;
  onBack: () => void;
}

const ChattingAssetGalleryView = ({
  roomId,
  onBack,
}: ChattingAssetGalleryViewProps) => {
  const t = useTranslations("chatRoom.sidebar");
  const { data: assetGallery, isPending, isError, error, refetch } =
    useChatAssetGalleryQuery(roomId);
  const assetItems = assetGallery?.items ?? [];
  // 실패와 빈 목록을 구분한다. 예전에는 불러오지 못해도 0/0 과 빈 칸만 남아 "에셋이 없는 캐릭터" 로 보였다.
  const isEmpty = !isPending && !isError && assetItems.length === 0;
  const fadeInClassName = useFadeInAfterLoading(isPending);
  // 해금된 칸을 누르면 같은 패널 안에서 크게 본다. 뒤로 가기는 목록으로 돌아온다.
  const [selectedAsset, setSelectedAsset] =
    useState<ChatAssetGalleryItem | null>(null);

  if (selectedAsset?.imageUrl) {
    return (
      <div className="flex h-full flex-col gap-5 overflow-y-auto bg-dark p-5">
        <button
          type="button"
          onClick={() => setSelectedAsset(null)}
          className="flex size-5 items-center justify-center text-font-2 transition-colors hover:text-font-1"
          aria-label={t("backToAssetGallery")}
        >
          <ArrowLeft className="size-5" />
        </button>

        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-card-hover">
          <Image
            src={selectedAsset.imageUrl}
            alt={selectedAsset.name ?? ""}
            fill
            sizes="296px"
            className="object-contain"
          />
        </div>

        {(selectedAsset.name || selectedAsset.situation) && (
          <div className="flex flex-col gap-1.5">
            {selectedAsset.name && (
              <h2 className="body-3 text-font-1">{selectedAsset.name}</h2>
            )}
            {selectedAsset.situation && (
              <p className="body-5 whitespace-pre-line text-font-2">
                {selectedAsset.situation}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-5 overflow-hidden bg-dark p-5">
      <button
        type="button"
        onClick={onBack}
        className="flex size-5 items-center justify-center text-font-2 transition-colors hover:text-font-1"
        aria-label={t("backToSettings")}
      >
        <ArrowLeft className="size-5" />
      </button>

      <header className="flex w-full items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ImageIcon className="size-6 text-font-2" />
          <h2 className="body-3 text-font-1">{t("assetGallery")}</h2>
        </div>

        {isPending ? (
          <div aria-hidden="true" className="skeleton h-4.5 w-10 shrink-0 rounded-full" />
        ) : isError ? null : (
          <span className="body-7 shrink-0 whitespace-nowrap text-font-2">
            {assetGallery?.visibleCount ?? 0}/{assetGallery?.totalCount ?? 0}
          </span>
        )}
      </header>

      {isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : isEmpty ? (
        <EmptyState size="sm" mood="ghost" message={t("assetGalleryEmpty")} />
      ) : (
        <div
          className={cn(
            "grid min-h-0 flex-1 auto-rows-max grid-cols-[repeat(2,minmax(0,1fr))] content-start gap-2 overflow-y-auto",
            fadeInClassName,
          )}
        >
          {isPending ? (
            <SkeletonAssetGallery />
          ) : (
            assetItems.map((asset) => (
              <AssetGalleryItem
                key={asset.id}
                asset={asset}
                onSelect={setSelectedAsset}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ChattingAssetGalleryView;
