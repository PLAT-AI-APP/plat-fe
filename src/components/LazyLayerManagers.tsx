"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { runWhenIdle } from "@/lib/idle";
import { useAuthStore } from "@/store/useAuthStore";
import { useDialogStore } from "@/store/useDialogStore";
import { useModalStore } from "@/store/useModalStore";

const loadModalManager = () => import("@/components/modal/ModalManager");
const loadDialogManager = () => import("@/components/dialog/DialogManager");

const ModalManager = dynamic(() =>
  loadModalManager().then((module) => module.ModalManager),
);
const DialogManager = dynamic(loadDialogManager);

const LazyLayerManagers = () => {
  const [hasLoadedModalManager, setHasLoadedModalManager] = useState(
    () => useModalStore.getState().modals.length > 0,
  );
  const [hasLoadedDialogManager, setHasLoadedDialogManager] = useState(
    () => useDialogStore.getState().currentDialog !== null,
  );

  /*
   * 처음 여는 모달은 매니저 청크 → 모달 청크를 차례로 받느라 누른 뒤 한동안 아무 반응이 없었다.
   * 로그인 창처럼 가장 먼저 열리는 모달이 특히 그랬다. 첫 화면이 다 그려진 뒤 한가할 때 두 매니저를
   * 마운트해 두고(열린 게 없으면 아무것도 그리지 않는다), 비로그인이면 로그인 창 코드도 받아 둔다.
   */
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  useEffect(() => {
    if (!isAuthReady) return;

    return runWhenIdle(() => {
      setHasLoadedModalManager(true);
      setHasLoadedDialogManager(true);
      if (!isLoggedIn) {
        void import("@/components/modal/ModalRegistry").then(({ preloadModal }) =>
          preloadModal("LOGIN"),
        );
      }
    });
  }, [isAuthReady, isLoggedIn]);

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

  // next/dynamic 은 ssr 기본값에서 자체 Suspense 를 만들지 않는다. 매니저 청크가
  // 처음 로딩되는 동안 루트 Suspense 까지 번져 ClientLayout 전체가 사라지므로
  // 여기서 로딩을 멈춘다.
  return (
    <>
      {hasLoadedModalManager && (
        <Suspense fallback={null}>
          <ModalManager />
        </Suspense>
      )}
      {hasLoadedDialogManager && (
        <Suspense fallback={null}>
          <DialogManager />
        </Suspense>
      )}
    </>
  );
};

export default LazyLayerManagers;
