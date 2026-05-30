import { useModalStore } from "@/store/useModalStore";
import { MODAL_COMPONENTS } from "./ModalRegistry";

export const ModalManager = () => {
  const { modals, closeModal } = useModalStore();

  return (
    <>
      {modals.map((modal, index) => {
        console.log(modal.props);

        const ModalComponent = MODAL_COMPONENTS[
          modal.type
        ] as React.ComponentType<
          typeof modal.props & { onClose: () => void; stackIndex?: number }
        >;
        return (
          <ModalComponent
            key={`${modal.type}-${index}`}
            {...modal.props}
            onClose={closeModal} // 여기서 스토어의 닫기 함수를 전달
            stackIndex={index}
          />
        );
      })}
    </>
  );
};
