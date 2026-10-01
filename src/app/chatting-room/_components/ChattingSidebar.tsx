"use client";

import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, m } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChatPlus,
  ImageIcon,
  Logout,
  Pen,
  Persona,
  Storage,
  Token,
} from "@/icons";
import Note from "@/icons/Note";
import { useRoomDetailQuery } from "@/api/room/getRoomDetail";
import {
  adaptUniverseDetailToCharacterDetail,
  useUniverseDetailQuery,
} from "@/api/universe/getUniverseDetail";
import { usePatchRoomAnswerRecommendationMutation } from "@/api/room/patchRoomAnswerRecommendation";
import { usePatchRoomPersonaMutation } from "@/api/room/patchRoomPersona";
import { cn, formatWithCommas } from "@/lib/utils";
import { useDialogStore } from "@/store/useDialogStore";
import { useModalStore } from "@/store/useModalStore";
import { useWalletStore } from "@/store/useWalletStore";
import { TRANSITION } from "@/constants/motion";
import { useFocusTrap } from "@/hooks/dom/useFocusTrap";

/*
 * 유저노트 화면은 react-hook-form·zod 를 쓰는데, 그대로 가져오면 두 라이브러리(약 126KB)가
 * 채팅방 첫 로딩에 함께 실린다. 사이드바에서 유저노트를 열 때만 받도록 나눈다.
 * (모달이던 시절에는 모달 레지스트리가 같은 방식으로 늦게 불러왔다.)
 *
 * next/dynamic 은 ssr 기본값에서 자체 Suspense 를 만들지 않는다. 그래서 처음 여는 하위 화면의 청크를
 * 받는 동안 로딩이 채팅방 라우트의 loading.tsx 까지 번져, 화면 전체가 한 번 로딩 화면으로 깜빡였다
 * (청크가 캐시된 두 번째부터는 없었다). 사이드바 안에 경계를 두고, 사이드바가 열리면 미리 받아 둔다.
 */
const loadUserNoteView = () => import("./chatting-user-note-view");
const loadMemoryView = () => import("./chatting-memory-view");
const loadAssetGalleryView = () => import("./chatting-asset-gallery-view");
const ChattingUserNoteView = dynamic(loadUserNoteView);
const ChattingMemoryView = dynamic(loadMemoryView);
const ChattingAssetGalleryView = dynamic(loadAssetGalleryView);

/** 하위 화면 청크를 받는 동안 사이드바 안에만 보이는 자리. 뒤로 가기 줄과 본문 줄 모양만 둔다. */
const SidebarDepthFallback = () => (
  <div aria-hidden="true" className="flex h-full flex-col gap-5 p-5">
    <div className="skeleton size-5 rounded-md" />
    <div className="skeleton h-6 w-32 rounded-full" />
    <div className="skeleton h-40 w-full rounded-xl" />
  </div>
);

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

type SidebarDepth = "SETTINGS" | "USER_NOTE" | "MEMORY" | "ASSET_GALLERY";

interface SidebarToggleProps {
  isOn: boolean;
  onClick: () => void;
  label: string;
}

/** 켬/끔만 있는 설정 줄의 스위치. 지금은 답변 추천 하나가 쓴다. */
const SidebarToggle = ({ isOn, onClick, label }: SidebarToggleProps) => (
  <button
    type="button"
    onClick={onClick}
    role="switch"
    aria-checked={isOn}
    aria-label={label}
    className={cn(
      "relative h-6 w-12 shrink-0 rounded-full border transition-colors",
      isOn ? "border-brand/40 bg-brand-opacity-2" : "border-main/40 bg-darkest",
    )}
  >
    <span
      className={cn(
        "absolute left-0.5 top-0.5 size-5 rounded-full transition",
        isOn ? "translate-x-6 bg-brand" : "translate-x-0 bg-font-disabled",
      )}
    />
  </button>
);

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

const ChattingSidebar = ({ roomId, toggleIsSidebar }: ChattingSidebarProps) => {
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
  const { mutate: patchAnswerRecommendation } =
    usePatchRoomAnswerRecommendationMutation();
  const [sidebarDepth, setSidebarDepth] = useState<SidebarDepth>("SETTINGS");

  const isAnswerRecommendationOn = room?.answerRecommendationEnabled ?? false;
  const handleAnswerRecommendationToggle = () => {
    // 방 정보를 아직 못 받았으면 지금 값을 몰라 뒤집을 수 없다.
    if (!room) return;

    patchAnswerRecommendation({ roomId, enabled: !isAnswerRecommendationOn });
  };

  const isDepthViewOpen = sidebarDepth !== "SETTINGS";
  const panelRef = useRef<HTMLDivElement>(null);
  // 장기기억·유저노트를 고치다 저장하지 않았는지. 하위 화면이 알려 준다.
  const isDepthDirtyRef = useRef(false);
  const handleDepthDirtyChange = useCallback((isDirty: boolean) => {
    isDepthDirtyRef.current = isDirty;
  }, []);

  /** 고치던 내용이 있으면 버릴지 먼저 묻고, 괜찮다고 하면 이동한다. */
  const confirmLeaveDepth = useCallback(
    (leave: () => void) => {
      if (!isDepthDirtyRef.current) {
        leave();
        return;
      }
      openDialog("UNSAVED_CHANGES", {
        onCancel: () => undefined,
        onLeave: () => {
          isDepthDirtyRef.current = false;
          leave();
        },
      });
    },
    [openDialog],
  );

  // 사이드바가 열리면 하위 화면 청크를 미리 받아, 눌렀을 때 기다리지 않게 한다.
  useEffect(() => {
    void loadUserNoteView();
    void loadMemoryView();
    void loadAssetGalleryView();
  }, []);

  const handleOpenPersonaModal = () => {
    // 모달(z-100)이 사이드바(z-20) 위에 뜨므로 사이드바는 그대로 둔다. 페르소나를 바꾼 뒤 설정을 이어서 볼 수 있다.
    openModal("PERSONA", {
      // 현재 페르소나를 넘기면 모달이 "관리"가 아니라 "선택" 모드로 열린다.
      currentPersonaId: room?.personaId,
      onSelectPersona: (persona) =>
        patchRoomPersona({ roomId, personaId: persona.personaId }),
    });
  };

  const handleDepthBack = useCallback(() => {
    // 사이드바 하위 화면에서 설정 화면으로 복귀
    confirmLeaveDepth(() => setSidebarDepth("SETTINGS"));
  }, [confirmLeaveDepth]);

  const handleOverlayClick = useCallback(() => {
    // 가장 위에 열린 사이드바 레이어부터 닫기
    if (isDepthViewOpen) {
      handleDepthBack();
      return;
    }

    toggleIsSidebar();
  }, [isDepthViewOpen, handleDepthBack, toggleIsSidebar]);

  // Esc 는 바깥을 누른 것과 같게 맨 위 레이어부터 닫는다. 열리면 첫 버튼으로 포커스를 옮기고,
  // 닫히면 사이드바를 연 버튼으로 돌려준다. 위에 모달·다이얼로그가 뜨면 그쪽 트랩이 키보드를 가져간다.
  // 트랩은 onEscape 가 바뀌면 다시 걸리며 포커스를 첫 버튼으로 옮기고 돌아갈 자리도 잃는다. 참조를 고정한다.
  const handleOverlayClickRef = useRef(handleOverlayClick);
  useEffect(() => {
    handleOverlayClickRef.current = handleOverlayClick;
  }, [handleOverlayClick]);
  const handleEscape = useCallback(() => handleOverlayClickRef.current(), []);
  useFocusTrap({
    containerRef: panelRef,
    enabled: true,
    onEscape: handleEscape,
  });

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
        ref={panelRef}
        id="sidebar-container"
        role="dialog"
        aria-modal="true"
        aria-label={t("title")}
        onClick={(event) => event.stopPropagation()}
        {...sidebarPanelMotion}
        transition={sidebarTransition}
        className="h-dvh w-[min(336px,100vw)] overflow-hidden border border-main bg-dark"
      >
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={sidebarDepth}
            {...sidebarDepthMotion}
            transition={sidebarTransition}
            className="h-full"
          >
            <Suspense fallback={<SidebarDepthFallback />}>
              {sidebarDepth === "USER_NOTE" ? (
                <ChattingUserNoteView
                  roomId={roomId}
                  onBack={handleDepthBack}
                  onDirtyChange={handleDepthDirtyChange}
                />
              ) : sidebarDepth === "MEMORY" ? (
                <ChattingMemoryView
                  roomId={roomId}
                  onBack={handleDepthBack}
                  onDirtyChange={handleDepthDirtyChange}
                />
              ) : sidebarDepth === "ASSET_GALLERY" ? (
                <ChattingAssetGalleryView
                  roomId={roomId}
                  onBack={handleDepthBack}
                />
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
                        <h2 className="body-5 text-font-2">
                          {t("chatSettings")}
                        </h2>
                        <menu className="flex list-none flex-col gap-1">
                          <li>
                            <SidebarMenuItem
                              icon={Pen}
                              label={t("suggestedReply")}
                              trailing={
                                <SidebarToggle
                                  isOn={isAnswerRecommendationOn}
                                  onClick={handleAnswerRecommendationToggle}
                                  label={t("suggestedReply")}
                                />
                              }
                            />
                          </li>
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
            </Suspense>
          </m.div>
        </AnimatePresence>
      </m.div>
    </m.aside>
  );
};

export default ChattingSidebar;
