import { AnimatePresence } from "framer-motion";
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
          <ModalComponent
            key={`${modal.type}-${index}`}
            {...modal.props}
            onClose={closeModal}
            stackIndex={index}
          />
        );
      })}
    </AnimatePresence>
  );
};
