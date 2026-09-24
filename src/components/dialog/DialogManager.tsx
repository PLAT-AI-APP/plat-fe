"use client";

import { Suspense } from "react";
import type { ComponentType } from "react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { ModalStackContext } from "@/components/ModalLayout";
import { useDialogStore } from "@/store/useDialogStore";
import { useModalStore } from "@/store/useModalStore";
import type { DialogTypeMap } from "@/type/dialog";

const DIALOG_LOADERS = {
  CHAT_DELETE: () => import("./ChatDeleteDialog"),
  CHAT_LEAVE: () => import("./ChatLeaveDialog"),
  CHAT_RESTART: () => import("./ChatRestartDialog"),
  COMMENT_DELETE: () => import("./CommentDeleteDialog"),
  DRAFT_OVERWRITE: () => import("./DraftOverwriteDialog"),
  DRAFT_SAVE_OVERWRITE: () => import("./DraftSaveOverwriteDialog"),
  LOGIN_REQUIRED: () => import("./LoginRequiredDialog"),
  PERSONA_DELETE: () => import("./PersonaDeleteDialog"),
  SIGNUP_COMPLETE: () => import("./SignupCompleteDialog"),
  UNSAVED_CHANGES: () => import("./UnsavedChangesDialog"),
  USER_BLOCK: () => import("./UserBlockDialog"),
  WELCOME_CREDIT: () => import("./WelcomeCreditDialog"),
  WITHDRAWAL_COMPLETE: () => import("./WithdrawalCompleteDialog"),
  WITHDRAWAL_CONFIRM: () => import("./WithdrawalConfirmDialog"),
} satisfies Record<keyof DialogTypeMap, () => Promise<unknown>>;

const DIALOG_COMPONENTS = Object.fromEntries(
  Object.entries(DIALOG_LOADERS).map(([type, loader]) => [
    type,
    dynamic(loader as () => Promise<{ default: ComponentType<object> }>),
  ]),
) as unknown as {
  [K in keyof DialogTypeMap]: ComponentType<
    DialogTypeMap[K] & { onClose: () => void }
  >;
};

/** 다이얼로그 코드를 미리 받아 둔다(ModalRegistry 의 preloadModal 과 같은 용도). */
export const preloadDialog = (type: keyof DialogTypeMap) => {
  void DIALOG_LOADERS[type]().catch(() => undefined);
};

const DialogManager = () => {
  const currentDialog = useDialogStore((state) => state.currentDialog);
  const closeDialog = useDialogStore((state) => state.closeDialog);
  // 다이얼로그는 떠 있는 모달이 몇 겹이든 그 위에 올라가야 한다.
  const modalCount = useModalStore((state) => state.modals.length);

  const DialogComponent = currentDialog
    ? (DIALOG_COMPONENTS[currentDialog.type] as ComponentType<
        typeof currentDialog.props & { onClose: () => void }
      >)
    : null;

  /*
   * AnimatePresence 가 없으면 currentDialog 가 비는 순간 즉시 언마운트되어
   * ModalLayout 이 정의한 exit 애니메이션이 11개 다이얼로그 전부에서
   * 재생되지 않았다(열릴 때만 부드럽고 닫힐 때는 뚝 사라짐).
   */
  return (
    <AnimatePresence>
      {currentDialog && DialogComponent && (
        // 다이얼로그 청크가 처음 로딩될 때 로딩이 루트 Suspense 로 번져
        // 페이지 전체가 잠깐 사라지지 않도록 다이얼로그 자리에서 멈춘다.
        <Suspense key={currentDialog.type} fallback={null}>
          <ModalStackContext.Provider value={modalCount}>
            <DialogComponent {...currentDialog.props} onClose={closeDialog} />
          </ModalStackContext.Provider>
        </Suspense>
      )}
    </AnimatePresence>
  );
};

export default DialogManager;
