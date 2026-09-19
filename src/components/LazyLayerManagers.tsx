"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useDialogStore } from "@/store/useDialogStore";
import { useModalStore } from "@/store/useModalStore";

const ModalManager = dynamic(() =>
  import("@/components/modal/ModalManager").then(
    (module) => module.ModalManager,
  ),
);
const DialogManager = dynamic(() => import("@/components/dialog/DialogManager"));

const LazyLayerManagers = () => {
  const [hasLoadedModalManager, setHasLoadedModalManager] = useState(
    () => useModalStore.getState().modals.length > 0,
  );
  const [hasLoadedDialogManager, setHasLoadedDialogManager] = useState(
    () => useDialogStore.getState().currentDialog !== null,
  );

  useEffect(() => {
    return useModalStore.subscribe((state) => {
      if (state.modals.length > 0) setHasLoadedModalManager(true);
    });
  }, []);

  useEffect(() => {
    return useDialogStore.subscribe((state) => {
      if (state.currentDialog) setHasLoadedDialogManager(true);
    });
  }, []);

  return (
    <>
      {hasLoadedModalManager && <ModalManager />}
      {hasLoadedDialogManager && <DialogManager />}
    </>
  );
};

export default LazyLayerManagers;
