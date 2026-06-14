"use client";

import { useEffect } from "react";
import { useDialogStore } from "@/store/useDialogStore";

type ModalType = "OVERWRITE" | "RESUME" | "UNSAVED" | null;

interface CreateModalsProps {
  activeModal: ModalType;
  closeModal: () => void;
  handleConfirmExit: () => void;
  rejectNavigation: () => void;
}

const CreateModals = ({
  activeModal,
  closeModal,
  handleConfirmExit,
  rejectNavigation,
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
      });
    }
  }, [activeModal, closeModal, handleConfirmExit, openDialog, rejectNavigation]);

  return null;
};

export default CreateModals;
