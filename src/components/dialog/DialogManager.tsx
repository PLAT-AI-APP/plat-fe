"use client";

import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { useDialogStore } from "@/store/useDialogStore";
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
        <DialogComponent
          key={currentDialog.type}
          {...currentDialog.props}
          onClose={closeDialog}
        />
      )}
    </AnimatePresence>
  );
};

export default DialogManager;
