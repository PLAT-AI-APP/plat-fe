import { AnimatePresence } from "framer-motion";
import { useModalStore } from "@/store/useModalStore";
import { MODAL_COMPONENTS } from "./ModalRegistry";

export const ModalManager = () => {
  const { modals, closeModal } = useModalStore();

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
