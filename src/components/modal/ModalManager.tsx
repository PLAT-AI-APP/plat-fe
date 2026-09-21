"use client";

import { Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { ModalStackContext } from "@/components/ModalLayout";
import { useModalStore } from "@/store/useModalStore";
import { MODAL_COMPONENTS } from "./ModalRegistry";

export const ModalManager = () => {
  // modals 는 실제로 필요해서 구독하지만, closeModal 까지 한 번에 꺼내면
  // 스토어의 다른 변화에도 함께 다시 그려진다.
  const modals = useModalStore((state) => state.modals);
  const closeModal = useModalStore((state) => state.closeModal);

  return (
    <AnimatePresence>
      {modals.map((modal, index) => {
        const ModalComponent = MODAL_COMPONENTS[
          modal.type
        ] as React.ComponentType<
          typeof modal.props & { onClose: () => void; stackIndex?: number }
        >;

        return (
          // 로컬 경계가 없으면 처음 여는 모달의 청크 로딩이 더 위의 Suspense로
          // 번져, 그 아래 있던 페이지 전체가 잠깐 사라지고 배경색만 보인다.
          <Suspense key={`${modal.type}-${index}`} fallback={null}>
            {/* 모달이 stackIndex를 ModalLayout까지 넘기지 않아도 제 층에 그려지도록 context로 내려준다. */}
            <ModalStackContext.Provider value={index}>
              <ModalComponent
                {...modal.props}
                onClose={closeModal}
                stackIndex={index}
              />
            </ModalStackContext.Provider>
          </Suspense>
        );
      })}
    </AnimatePresence>
  );
};
