"use client";

import { useIsMutating } from "@tanstack/react-query";
import { DELETE_UNIVERSE_MUTATION_KEY } from "@/api/universe/deleteUniverse";
import type { UniverseDeleteDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

const UniverseDeleteDialog = ({ onClose, onConfirm }: UniverseDeleteDialogProps) => {
  // Dialog는 열릴 때 props가 고정되므로 진행 상태는 뮤테이션에서 직접 구독합니다.
  const isPending =
    useIsMutating({ mutationKey: DELETE_UNIVERSE_MUTATION_KEY }) > 0;

  return (
    <Dialog
      onClose={onClose}
      cancelFn={onClose}
      cancelText="dialog.universeDelete.cancel"
      confirmText="dialog.universeDelete.confirm"
      label="dialog.universeDelete.title"
      description="dialog.universeDelete.description"
      confirmFn={onConfirm}
      isConfirmPending={isPending}
    />
  );
};

export default UniverseDeleteDialog;
