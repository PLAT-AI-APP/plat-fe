"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Chat,
  Eye,
  EyeOff,
  ImageIcon,
  LockLine,
  Logout,
  PenSparkle,
  Persona,
  Storage,
  Token,
} from "@/icons";
import Note from "@/icons/Note";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/store/useModalStore";

interface ChattingSidebarProps {
  toggleIsSidebar: () => void;
  isSuggestedReplyOn: boolean;
  onSuggestedReplyToggle: () => void;
}

interface SidebarMenuItemProps {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  trailing?: React.ReactNode;
}

interface SidebarToggleProps {
  isOn: boolean;
  onClick: () => void;
}

interface AssetGalleryViewProps {
  onBack: () => void;
}

const ASSET_ITEMS = Array.from({ length: 12 }, (_, index) => ({
  id: `asset-${index + 1}`,
  imageUrl: "/images/sample.png",
  isLocked: index >= 6,
}));

const SidebarMenuItem = ({
  icon: Icon,
  label,
  onClick,
  trailing,
}: SidebarMenuItemProps) => {
  const content = (
    <>
      <span className="flex items-center gap-3">
        <Icon className="size-6 shrink-0 text-font-2" />
        <span className="whitespace-nowrap">{label}</span>
      </span>
      {trailing}
    </>
  );

  if (trailing && !onClick) {
    return (
      <div className="body-2 flex w-full items-center justify-between py-2 text-font-1">
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="body-2 flex w-full items-center justify-between py-2 text-font-1 transition-colors hover:text-font-2"
    >
      {content}
    </button>
  );
};

const SidebarToggle = ({ isOn, onClick }: SidebarToggleProps) => {
  const ToggleIcon = isOn ? Eye : EyeOff;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative h-6 w-12 rounded-[22.588px] border transition-colors",
        isOn
          ? "border-brand/40 bg-brand-opacity-2"
          : "border-border-main/40 bg-bg-darkest",
      )}
      aria-pressed={isOn}
    >
      <span
        className={cn(
          "absolute top-0.5 flex size-5 items-center justify-center rounded-full transition-all",
          isOn ? "left-[26px] bg-brand" : "left-0.5 bg-font-disabled",
        )}
      >
        <ToggleIcon className="size-4 text-font-4" />
      </span>
    </button>
  );
};

const AssetGalleryView = ({ onBack }: AssetGalleryViewProps) => {
  const t = useTranslations("chatRoom.sidebar");

  return (
    <div className="flex h-full flex-col gap-5 overflow-hidden bg-bg-dark p-5">
      <button
        type="button"
        onClick={onBack}
        className="flex size-5 items-center justify-center text-font-2 transition-colors hover:text-font-1"
        aria-label={t("backToSettings")}
      >
        <ArrowLeft className="size-5" />
      </button>

      <header className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="size-6 text-font-2" />
          <h2 className="body-2 text-font-1">{t("assetGallery")}</h2>
        </div>
        <span className="body-6 whitespace-pre text-font-2">
          {t("assetTotal", { count: 90 })}
        </span>
      </header>

      <div className="grid flex-1 grid-cols-2 gap-x-[9px] gap-y-[9px] overflow-y-auto">
        {ASSET_ITEMS.map((asset) => (
          <button
            key={asset.id}
            type="button"
            className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#d9d9d9]"
          >
            <Image
              src={asset.imageUrl}
              alt=""
              fill
              sizes="calc((336px - 40px - 9px) / 2)"
              className={cn(
                "rounded-xl object-cover",
                asset.isLocked && "blur-[4px]",
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
        ))}
      </div>
    </div>
  );
};

const ChattingSidebar = ({
  toggleIsSidebar,
  isSuggestedReplyOn,
  onSuggestedReplyToggle,
}: ChattingSidebarProps) => {
  const t = useTranslations("chatRoom.sidebar");
  const router = useRouter();
  const { openModal } = useModalStore();
  const [isAssetViewOn, setIsAssetViewOn] = useState(false);
  const [isAssetGalleryVisible, setIsAssetGalleryVisible] = useState(false);

  const handleOpenModal = (modalId: "STORAGE" | "PERSONA" | "USER_NOTE") => {
    // 사이드바 액션 후 레이어가 겹치지 않도록 먼저 닫는 흐름
    toggleIsSidebar();
    openModal(modalId);
  };

  const handleAssetViewToggle = () => {
    // 에셋 보기 토글과 갤러리 화면 전환 상태
    setIsAssetViewOn((prevState) => !prevState);
    setIsAssetGalleryVisible((prevState) => !prevState);
  };

  const handleAssetGalleryBack = () => {
    // 갤러리에서 설정 화면으로 돌아가는 상태
    setIsAssetViewOn(false);
    setIsAssetGalleryVisible(false);
  };

  const handleLeaveChat = () => {
    // 채팅방을 벗어나는 하단 고정 액션
    toggleIsSidebar();
    router.push("/");
  };

  return (
    <aside className="fixed inset-0 z-20 flex justify-end bg-black/50 font-medium">
      <div
        id="sidebar-container"
        className="h-screen w-[336px] border border-border-main bg-bg-dark"
      >
        {isAssetGalleryVisible ? (
          <AssetGalleryView onBack={handleAssetGalleryBack} />
        ) : (
          <div className="flex h-full flex-col justify-between p-5">
            <div className="flex flex-col gap-5">
              <header className="flex w-full items-center justify-between">
                <button
                  type="button"
                  onClick={toggleIsSidebar}
                  className="flex size-5 items-center justify-center text-font-2 transition-colors hover:text-font-1"
                  aria-label={t("close")}
                >
                  <ArrowLeft className="size-5" />
                </button>

                <div className="flex items-center rounded-lg bg-[#181C2E] px-3 py-2">
                  <div className="flex items-center gap-3">
                    <span className="body-5 whitespace-nowrap text-font-2">
                      {t("ownedNotes")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Token className="size-6" />
                      <span className="body-2 whitespace-nowrap text-white">
                        1,234
                      </span>
                    </span>
                  </div>
                </div>
              </header>

              <nav className="flex flex-col gap-6">
                <section className="flex flex-col gap-3">
                  <h2 className="body-4 text-font-2">{t("userSettings")}</h2>
                  <menu className="flex list-none flex-col gap-1">
                    <li>
                      <SidebarMenuItem
                        icon={Persona}
                        label={t("persona")}
                        onClick={() => handleOpenModal("PERSONA")}
                        trailing={
                          <span className="title-5 flex items-center gap-0.5 whitespace-nowrap text-font-0">
                            이름이름이름
                            <span className="flex size-6 items-center justify-center">
                              <ArrowLeft className="size-4 rotate-180 text-font-2" />
                            </span>
                          </span>
                        }
                      />
                    </li>
                    <li>
                      <SidebarMenuItem
                        icon={Note}
                        label={t("userNote")}
                        onClick={() => handleOpenModal("USER_NOTE")}
                      />
                    </li>
                  </menu>
                </section>

                <section className="flex flex-col gap-3">
                  <h2 className="body-4 text-font-2">{t("memoryLog")}</h2>
                  <menu className="flex list-none flex-col gap-1">
                    <li>
                      <SidebarMenuItem
                        icon={Storage}
                        label={t("memory")}
                        onClick={() => handleOpenModal("STORAGE")}
                      />
                    </li>
                    <li>
                      <SidebarMenuItem
                        icon={ImageIcon}
                        label={t("assetGallery")}
                        onClick={() => setIsAssetGalleryVisible(true)}
                      />
                    </li>
                  </menu>
                </section>

                <section className="flex flex-col gap-3">
                  <h2 className="body-4 text-font-2">{t("chatSettings")}</h2>
                  <menu className="flex list-none flex-col gap-1">
                    <li>
                      <SidebarMenuItem
                        icon={PenSparkle}
                        label={t("suggestedReply")}
                        trailing={
                          <SidebarToggle
                            isOn={isSuggestedReplyOn}
                            onClick={onSuggestedReplyToggle}
                          />
                        }
                      />
                    </li>
                    <li>
                      <SidebarMenuItem
                        icon={ImageIcon}
                        label={t("assetView")}
                        trailing={
                          <SidebarToggle
                            isOn={isAssetViewOn}
                            onClick={handleAssetViewToggle}
                          />
                        }
                      />
                    </li>
                    <li>
                      <SidebarMenuItem icon={Chat} label={t("restartChat")} />
                    </li>
                  </menu>
                </section>
              </nav>
            </div>

            <button
              type="button"
              onClick={handleLeaveChat}
              className="body-4 flex items-center gap-2 self-end py-3 text-font-2 transition-colors hover:text-font-1"
            >
              <Logout className="size-6 scale-x-[-1]" />
              <span>{t("leaveChat")}</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ChattingSidebar;
