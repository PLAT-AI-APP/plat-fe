"use client";

import React, { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChatPlus, Logout, Persona, Storage, Token } from "@/icons";
import Note from "@/icons/Note";
import { useRoomDetailQuery } from "@/api/room/getRoomDetail";
import {
  adaptUniverseDetailToCharacterDetail,
  useUniverseDetailQuery,
} from "@/api/universe/getUniverseDetail";
import { usePatchRoomPersonaMutation } from "@/api/room/patchRoomPersona";
import { cn, formatWithCommas } from "@/lib/utils";
import { useDialogStore } from "@/store/useDialogStore";
import { useModalStore } from "@/store/useModalStore";
import { useWalletStore } from "@/store/useWalletStore";
import { TRANSITION } from "@/constants/motion";

/*
 * 유저노트 화면은 react-hook-form·zod 를 쓰는데, 그대로 가져오면 두 라이브러리(약 126KB)가
 * 채팅방 첫 로딩에 함께 실린다. 사이드바에서 유저노트를 열 때만 받도록 나눈다.
 * (모달이던 시절에는 모달 레지스트리가 같은 방식으로 늦게 불러왔다.)
 */
const ChattingUserNoteView = dynamic(() => import("./chatting-user-note-view"));
const ChattingMemoryView = dynamic(() => import("./chatting-memory-view"));

interface ChattingSidebarProps {
  roomId: string;
  toggleIsSidebar: () => void;
}

interface SidebarMenuItemProps {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  trailing?: React.ReactNode;
  disabled?: boolean;
}

/*
 * 에셋 갤러리·추천 답변·에셋 보기는 서버 연동 전까지 메뉴에서 뺀다.
 * 목업 데이터나 없는 API 를 부르는 화면을 사용자에게 보여 주지 않기 위해서다.
 */
type SidebarDepth = "SETTINGS" | "USER_NOTE" | "MEMORY";

/** 사이드바 오버레이 페이드 애니메이션 */
const sidebarOverlayMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/** 사이드바 패널 슬라이드 애니메이션 */
const sidebarPanelMotion = {
  initial: { x: 336 },
  animate: { x: 0 },
  exit: { x: 336 },
};

/** 사이드바 하위 화면 슬라이드 애니메이션 */
const sidebarDepthMotion = {
  initial: { x: 48, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 48, opacity: 0 },
};

const sidebarTransition = TRANSITION;

const SidebarMenuItem = ({
  icon: Icon,
  label,
  onClick,
  trailing,
  disabled = false,
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
      <div className="body-3 flex w-full items-center justify-between px-2 py-2 text-font-1">
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="body-5 flex w-full items-center justify-between rounded-lg px-2 py-2 text-font-1 transition-colors hover:bg-btn-hover disabled:cursor-wait disabled:opacity-50"
    >
      {content}
    </button>
  );
};

const ChattingSidebar = ({
  roomId,
  toggleIsSidebar,
}: ChattingSidebarProps) => {
  const t = useTranslations("chatRoom.sidebar");
  const router = useRouter();
  const openDialog = useDialogStore((state) => state.openDialog);
  const openModal = useModalStore((state) => state.openModal);
  const availableBalance = useWalletStore(
    (state) => state.balance?.availableBalance ?? 0,
  );
  const { data: room } = useRoomDetailQuery(roomId);
  // 채팅방 화면이 이미 받아 둔 세계관 상세를 캐시에서 그대로 쓴다.
  const { data: universe } = useUniverseDetailQuery(room?.universeId);
  const scenarios = universe
    ? adaptUniverseDetailToCharacterDetail(universe).scenarios
    : [];
  const { mutate: patchRoomPersona } = usePatchRoomPersonaMutation();
  const [sidebarDepth, setSidebarDepth] = useState<SidebarDepth>("SETTINGS");

  const isDepthViewOpen = sidebarDepth !== "SETTINGS";

  const handleOpenPersonaModal = () => {
    // 다른 레이어 UI를 열기 전 사이드바 먼저 닫기
    toggleIsSidebar();
    openModal("PERSONA", {
      // 현재 페르소나를 넘기면 모달이 "관리"가 아니라 "선택" 모드로 열린다.
      currentPersonaId: room?.personaId,
      onSelectPersona: (persona) =>
        patchRoomPersona({ roomId, personaId: persona.personaId }),
    });
  };

  const handleDepthBack = () => {
    // 사이드바 하위 화면에서 설정 화면으로 복귀
    setSidebarDepth("SETTINGS");
  };

  const handleOverlayClick = () => {
    // 가장 위에 열린 사이드바 레이어부터 닫기
    if (isDepthViewOpen) {
      handleDepthBack();
      return;
    }

    toggleIsSidebar();
  };

  const handleConfirmLeaveChat = () => {
    // 채팅방 나가기 확인 후 홈으로 이동
    toggleIsSidebar();
    router.push("/");
  };

  const handleLeaveChat = () => {
    // 현재 채팅을 복구할 수 없으므로 나가기 전 확인
    openDialog("CHAT_LEAVE", {
      onConfirm: handleConfirmLeaveChat,
    });
  };

  const handleRestartChat = () => {
    // 같은 세계관으로 새 채팅방을 만든다. 페르소나·시나리오는 채팅 시작 창에서 다시 고른다.
    if (!universe) return;
    openDialog("CHAT_RESTART", {
      onConfirm: () => {
        toggleIsSidebar();
        openModal("CHATTING_START", {
          universeId: universe.universeId,
          scenarioList: scenarios,
          currentScenario: scenarios[0],
        });
      },
    });
  };

  return (
    <m.aside
      onClick={handleOverlayClick}
      {...sidebarOverlayMotion}
      transition={sidebarTransition}
      className={cn(
        "fixed inset-0 z-20 flex justify-end",
        isDepthViewOpen ? "bg-scrim/70" : "bg-scrim/50",
      )}
    >
      <m.div
        id="sidebar-container"
        onClick={(event) => event.stopPropagation()}
        {...sidebarPanelMotion}
        transition={sidebarTransition}
        className="h-dvh w-[336px] overflow-hidden border border-main bg-dark"
      >
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={sidebarDepth}
            {...sidebarDepthMotion}
            transition={sidebarTransition}
            className="h-full"
          >
            {sidebarDepth === "USER_NOTE" ? (
              <ChattingUserNoteView roomId={roomId} onBack={handleDepthBack} />
            ) : sidebarDepth === "MEMORY" ? (
              <ChattingMemoryView roomId={roomId} onBack={handleDepthBack} />
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

                    <Link
                      href="/token-charge"
                      className="flex items-center gap-1.5 rounded-lg bg-card px-3 py-2 transition-colors hover:bg-card-hover"
                    >
                      <Token className="size-[21px]" />
                      <span className="body-5 whitespace-nowrap text-font-1">
                        {formatWithCommas(availableBalance)}
                      </span>
                    </Link>
                  </header>

                  <nav className="flex flex-col gap-6">
                    <section className="flex flex-col gap-3">
                      <h2 className="body-5 text-font-2">
                        {t("userSettings")}
                      </h2>
                      <menu className="flex list-none flex-col gap-1">
                        <li>
                          <SidebarMenuItem
                            icon={Persona}
                            label={t("persona")}
                            onClick={handleOpenPersonaModal}
                            trailing={
                              <span className="flex size-6 items-center justify-center">
                                <ArrowLeft className="size-4 rotate-180 text-font-2" />
                              </span>
                            }
                          />
                        </li>
                        <li>
                          <SidebarMenuItem
                            icon={Note}
                            label={t("userNote")}
                            onClick={() => setSidebarDepth("USER_NOTE")}
                          />
                        </li>
                      </menu>
                    </section>

                    <section className="flex flex-col gap-3">
                      <h2 className="body-5 text-font-2">{t("memoryLog")}</h2>
                      <menu className="flex list-none flex-col gap-1">
                        <li>
                          <SidebarMenuItem
                            icon={Storage}
                            label={t("memory")}
                            onClick={() => setSidebarDepth("MEMORY")}
                          />
                        </li>
                      </menu>
                    </section>

                    <section className="flex flex-col gap-3">
                      <h2 className="body-5 text-font-2">
                        {t("chatSettings")}
                      </h2>
                      <menu className="flex list-none flex-col gap-1">
                        <li>
                          <SidebarMenuItem
                            icon={ChatPlus}
                            label={t("restartChat")}
                            onClick={handleRestartChat}
                            disabled={!universe}
                          />
                        </li>
                      </menu>
                    </section>
                  </nav>
                </div>

                <button
                  type="button"
                  onClick={handleLeaveChat}
                  className="body-5 flex w-full items-center gap-2 px-2 py-3 text-font-2 transition-colors hover:text-font-1"
                >
                  <Logout className="size-6 scale-x-[-1]" />
                  <span>{t("leaveChat")}</span>
                </button>
              </div>
            )}
          </m.div>
        </AnimatePresence>
      </m.div>
    </m.aside>
  );
};

export default ChattingSidebar;
