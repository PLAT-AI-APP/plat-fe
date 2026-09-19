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
    const loadWhenNeeded = (state: ReturnType<typeof useModalStore.getState>) => {
      if (state.modals.length > 0) setHasLoadedModalManager(true);
    };

    // A sibling effect can open a modal before this subscription is attached.
    // Check once after subscribing so that update is not missed.
    const unsubscribe = useModalStore.subscribe(loadWhenNeeded);
    loadWhenNeeded(useModalStore.getState());
    return unsubscribe;
  }, []);

  useEffect(() => {
    const loadWhenNeeded = (
      state: ReturnType<typeof useDialogStore.getState>,
    ) => {
      if (state.currentDialog) setHasLoadedDialogManager(true);
    };

    const unsubscribe = useDialogStore.subscribe(loadWhenNeeded);
    loadWhenNeeded(useDialogStore.getState());
    return unsubscribe;
  }, []);

  return (
    <>
      {hasLoadedModalManager && <ModalManager />}
      {hasLoadedDialogManager && <DialogManager />}
    </>
  );
};

export default LazyLayerManagers;
