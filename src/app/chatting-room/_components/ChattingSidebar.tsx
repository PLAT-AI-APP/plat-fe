"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChatPlus,
  Eye,
  EyeOff,
  GalleryViewLine,
  ImageIcon,
  Logout,
  PenSparkle,
  Persona,
  Storage,
  Token,
} from "@/icons";
import Note from "@/icons/Note";
import { cn } from "@/lib/utils";
import { useDialogStore } from "@/store/useDialogStore";
import { useModalStore } from "@/store/useModalStore";
import ChattingAssetGalleryView from "./chatting-asset-gallery-view";
import ChattingMemoryView from "./chatting-memory-view";

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

// 사이드바 내부에서 전환되는 하위 화면 종류
type SidebarDepth = "SETTINGS" | "MEMORY" | "ASSET_GALLERY";

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
        <ToggleIcon className="size-4 text-white" />
      </span>
    </button>
  );
};

const ChattingSidebar = ({
  toggleIsSidebar,
  isSuggestedReplyOn,
  onSuggestedReplyToggle,
}: ChattingSidebarProps) => {
  const t = useTranslations("chatRoom.sidebar");
  const router = useRouter();
  const openDialog = useDialogStore((state) => state.openDialog);
  const { openModal } = useModalStore();
  const [isAssetViewOn, setIsAssetViewOn] = useState(true);
  const [sidebarDepth, setSidebarDepth] = useState<SidebarDepth>("SETTINGS");

  // 배경 클릭 시 사이드바보다 먼저 닫을 하위 화면 여부
  const isDepthViewOpen = sidebarDepth !== "SETTINGS";

  const handleOpenModal = (modalId: "PERSONA" | "USER_NOTE") => {
    // 사이드바 액션 후 레이어가 겹치지 않도록 먼저 닫는 흐름
    toggleIsSidebar();
    openModal(modalId);
  };

  const handleAssetViewToggle = () => {
    // 채팅 화면 안의 에셋 표시 여부만 바꾸는 토글
    setIsAssetViewOn((prevState) => !prevState);
  };

  const handleAssetGalleryBack = () => {
    // 에셋 갤러리 뎁스에서 설정 화면으로 복귀
    setSidebarDepth("SETTINGS");
  };

  const handleDepthBack = () => {
    // 사이드바 하위 뎁스에서 설정 화면으로 복귀
    setSidebarDepth("SETTINGS");
  };

  const handleOverlayClick = () => {
    // 배경 클릭 시 가장 위에 열린 사이드바 뎁스부터 닫는 흐름
    if (isDepthViewOpen) {
      handleDepthBack();
      return;
    }

    toggleIsSidebar();
  };

  const handleConfirmLeaveChat = () => {
    // 채팅방 나가기 확정 후 홈으로 이동
    toggleIsSidebar();
    router.push("/");
  };

  const handleLeaveChat = () => {
    // 채팅방 나가기 전 복구 불가 안내 확인
    openDialog("CHAT_LEAVE", {
      onConfirm: handleConfirmLeaveChat,
    });
  };

  const handleRestartChat = () => {
    // 새 채팅방 생성 API 연결 전까지 다이얼로그 확인 흐름만 먼저 연결
    openDialog("CHAT_RESTART", {
      onConfirm: toggleIsSidebar,
    });
  };

  return (
    <aside
      onClick={handleOverlayClick}
      className={cn(
        "fixed inset-0 z-20 flex justify-end font-medium",
        isDepthViewOpen ? "bg-[#0D0E11]/70" : "bg-[#0D0E11]/50",
      )}
    >
      <div
        id="sidebar-container"
        onClick={(event) => event.stopPropagation()}
        className="h-screen w-[336px] border border-border-main bg-bg-dark"
      >
        {sidebarDepth === "MEMORY" ? (
          <ChattingMemoryView onBack={handleDepthBack} />
        ) : sidebarDepth === "ASSET_GALLERY" ? (
          <ChattingAssetGalleryView onBack={handleAssetGalleryBack} />
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

                <div className="flex items-center gap-1.5 rounded-lg bg-card px-3 py-2">
                  <Token className="size-[21px]" />
                  <span className="body-4 whitespace-nowrap text-white">
                    1,234
                  </span>
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
                        onClick={() => setSidebarDepth("MEMORY")}
                      />
                    </li>
                    <li>
                      <SidebarMenuItem
                        icon={ImageIcon}
                        label={t("assetGallery")}
                        onClick={() => setSidebarDepth("ASSET_GALLERY")}
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
                        icon={GalleryViewLine}
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
                      <SidebarMenuItem
                        icon={ChatPlus}
                        label={t("restartChat")}
                        onClick={handleRestartChat}
                      />
                    </li>
                  </menu>
                </section>
              </nav>
            </div>

            <button
              type="button"
              onClick={handleLeaveChat}
              className="body-4 flex w-full items-center gap-2 px-2 py-3 text-font-2 transition-colors hover:text-font-1"
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
