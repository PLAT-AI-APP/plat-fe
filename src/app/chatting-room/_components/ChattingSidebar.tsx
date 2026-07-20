"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Chat,
  Eye,
  EyeOff,
  ImageIcon,
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

const ChattingSidebar = ({ toggleIsSidebar }: ChattingSidebarProps) => {
  const t = useTranslations("chatRoom.sidebar");
  const router = useRouter();
  const { openModal } = useModalStore();
  const [isSuggestedReplyOn, setIsSuggestedReplyOn] = useState(true);
  const [isAssetViewOn, setIsAssetViewOn] = useState(true);

  const handleOpenModal = (modalId: "STORAGE" | "PERSONA" | "USER_NOTE") => {
    // 사이드바 액션 후 레이어가 겹치지 않도록 먼저 닫는 흐름
    toggleIsSidebar();
    openModal(modalId);
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
        className="flex h-screen w-[336px] flex-col justify-between border border-border-main bg-bg-dark p-5"
      >
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

            <div className="flex items-center rounded-lg bg-card px-3 py-2">
              <div className="flex items-center gap-3">
                <span className="body-5 whitespace-nowrap text-font-2">
                  {t("ownedNotes")}
                </span>
                <span className="flex items-center gap-1">
                  <Token className="size-6" />
                  <span className="body-2 whitespace-nowrap text-font-4">
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
                      <span className="title-5 flex items-center gap-0.5 whitespace-nowrap text-font-4">
                        이름이름이름
                        <ArrowLeft className="size-6 rotate-180 text-font-2" />
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
                  <SidebarMenuItem icon={ImageIcon} label={t("assetGallery")} />
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
                        onClick={() =>
                          setIsSuggestedReplyOn((prevState) => !prevState)
                        }
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
                        onClick={() =>
                          setIsAssetViewOn((prevState) => !prevState)
                        }
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
          <Logout className="size-6" />
          <span>{t("leaveChat")}</span>
        </button>
      </div>
    </aside>
  );
};

export default ChattingSidebar;
