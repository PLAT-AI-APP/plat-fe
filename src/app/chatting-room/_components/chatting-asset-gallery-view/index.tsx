"use client";

import { useTranslations } from "next-intl";
import { useChatAssetGalleryQuery } from "@/api/chat/getChatAssetGallery";
import SkeletonAssetGallery from "@/components/skeleton/SkeletonAssetGallery";
import { useFadeInAfterLoading } from "@/hooks/common/useFadeInAfterLoading";
import { cn } from "@/lib/utils";
import { ArrowLeft, ImageIcon } from "@/icons";
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
  const { data: assetGallery, isPending } = useChatAssetGalleryQuery(roomId);
  const assetItems = assetGallery?.items ?? [];
  const fadeInClassName = useFadeInAfterLoading(isPending);

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
        ) : (
          <span className="body-7 shrink-0 whitespace-nowrap text-font-2">
            {assetGallery?.visibleCount ?? 0}/{assetGallery?.totalCount ?? 0}
          </span>
        )}
      </header>

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
            <AssetGalleryItem key={asset.id} asset={asset} />
          ))
        )}
      </div>
    </div>
  );
};

export default ChattingAssetGalleryView;
