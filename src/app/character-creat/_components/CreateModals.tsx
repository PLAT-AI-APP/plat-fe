"use client";

import { useEffect } from "react";
import { useDialogStore } from "@/store/useDialogStore";

type ModalType = "OVERWRITE" | "RESUME" | "SAVE_OVERWRITE" | "UNSAVED" | null;

interface CreateModalsProps {
  activeModal: ModalType;
  closeModal: () => void;
  handleConfirmExit: () => void;
  rejectNavigation: () => void;
  handleLoadDraft: () => void;
  handleSaveOverwrite: () => void;
}

const CreateModals = ({
  activeModal,
  closeModal,
  handleConfirmExit,
  rejectNavigation,
  handleLoadDraft,
  handleSaveOverwrite,
}: CreateModalsProps) => {
  const openDialog = useDialogStore((state) => state.openDialog);

  useEffect(() => {
    const handleStay = () => {
      closeModal();
      rejectNavigation();
    };

    if (activeModal === "UNSAVED") {
      openDialog("UNSAVED_CHANGES", {
        onCancel: handleStay,
        onLeave: handleConfirmExit,
      });
      return;
    }

    if (activeModal === "OVERWRITE") {
      openDialog("DRAFT_OVERWRITE", {
        onCancel: closeModal,
        onConfirm: handleLoadDraft,
      });
      return;
    }

    if (activeModal === "SAVE_OVERWRITE") {
      openDialog("DRAFT_SAVE_OVERWRITE", {
        onCancel: closeModal,
        onConfirm: handleSaveOverwrite,
      });
    }
  }, [
    activeModal,
    closeModal,
    handleConfirmExit,
    handleLoadDraft,
    handleSaveOverwrite,
    openDialog,
    rejectNavigation,
  ]);

  return null;
};

export default CreateModals;
