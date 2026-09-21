"use client";

import { Suspense } from "react";
import type { ComponentType } from "react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { ModalStackContext } from "@/components/ModalLayout";
import { useDialogStore } from "@/store/useDialogStore";
import { useModalStore } from "@/store/useModalStore";
import type { DialogTypeMap } from "@/type/dialog";

const DIALOG_COMPONENTS: {
  [K in keyof DialogTypeMap]: ComponentType<
    DialogTypeMap[K] & { onClose: () => void }
  >;
} = {
  CHAT_DELETE: dynamic(() => import("./ChatDeleteDialog")),
  CHAT_LEAVE: dynamic(() => import("./ChatLeaveDialog")),
  CHAT_RESTART: dynamic(() => import("./ChatRestartDialog")),
  COMMENT_DELETE: dynamic(() => import("./CommentDeleteDialog")),
  DRAFT_OVERWRITE: dynamic(() => import("./DraftOverwriteDialog")),
  DRAFT_SAVE_OVERWRITE: dynamic(() => import("./DraftSaveOverwriteDialog")),
  LOGIN_REQUIRED: dynamic(() => import("./LoginRequiredDialog")),
  PERSONA_DELETE: dynamic(() => import("./PersonaDeleteDialog")),
  SIGNUP_COMPLETE: dynamic(() => import("./SignupCompleteDialog")),
  UNSAVED_CHANGES: dynamic(() => import("./UnsavedChangesDialog")),
  USER_BLOCK: dynamic(() => import("./UserBlockDialog")),
  WELCOME_CREDIT: dynamic(() => import("./WelcomeCreditDialog")),
  WITHDRAWAL_COMPLETE: dynamic(() => import("./WithdrawalCompleteDialog")),
  WITHDRAWAL_CONFIRM: dynamic(() => import("./WithdrawalConfirmDialog")),
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
