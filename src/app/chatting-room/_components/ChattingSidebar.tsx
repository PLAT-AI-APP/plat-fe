import PersonaModal from "@/components/modal/PersonaModal";
import StorageModal from "@/components/modal/StorageModal";
import UserNoteModal from "@/components/modal/UserNoteModal";
import { Close, Persona, Storage } from "@/icons";
import Adjust from "@/icons/Adjust";
import Note from "@/icons/Note";
import React, { useCallback, useMemo, useState } from "react";

interface ChattingSidebarProps {
  toggleIsSidebar: () => void;
}

type ModalState = {
  storage: boolean;
  persona: boolean;
  note: boolean;
  adjust: boolean;
};

interface MenuItem {
  id: keyof ModalState;
  title: string;
  icon: React.ElementType;
  text?: string;
}
const MENU_LIST: MenuItem[] = [
  { id: "storage", title: "장기기억", icon: Storage },
  { id: "persona", title: "페르소나", icon: Persona },
  { id: "note", title: "유저노트", icon: Note },
  { id: "adjust", title: "출력량", icon: Adjust, text: "x1.0" },
];

const ChattingSidebar = ({ toggleIsSidebar }: ChattingSidebarProps) => {
  const [isModal, setIsModal] = useState<ModalState>({
    storage: false,
    persona: false,
    note: false,
    adjust: false,
  });

  const openModal = useCallback((id: keyof ModalState) => {
    setIsModal({
      storage: false,
      persona: false,
      note: false,
      adjust: false,
      [id]: true,
    });
  }, []);
  const closeModal = useCallback(() => {
    setIsModal({ storage: false, persona: false, note: false, adjust: false });
  }, []);

  const activeModal = useMemo(() => {
    if (isModal.storage) return <StorageModal closeModal={closeModal} />;
    if (isModal.persona) return <PersonaModal closeModal={closeModal} />;
    if (isModal.note) return <UserNoteModal closeModal={closeModal} />;
    if (isModal.adjust) return <section className="...">출력량 모달</section>;
    return null;
  }, [isModal, closeModal]);

  return (
    <aside className="fixed flex justify-end top-0 right-0 font-medium bg-black/50 w-screen h-screen z-20">
      <div id="sidebar-container" className="bg-bg-dark p-5 w-fit h-screen">
        <header className="pb-6 flex justify-end">
          <button
            onClick={toggleIsSidebar}
            className="p-1 w-6 h-6 flex items-center justify-center hover:bg-btn-hover rounded-lg"
          >
            <Close className="w-3.5 h-3.5" />
          </button>
        </header>

        <nav>
          <h2 className="pb-3 text-font-2 text-base">채팅방 설정</h2>
          <menu className="flex flex-col gap-2">
            {MENU_LIST.map(({ id, icon: Icon, title, text }) => (
              <li
                key={title}
                onClick={() => openModal(id)}
                className="w-50 p-2 flex items-center text-sm justify-between list-none cursor-pointer hover:bg-btn-hover rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-font-2" />
                  <span className="hover:text-font-2">{title}</span>
                </div>
                {text && <span className="text-font-2">{text}</span>}
              </li>
            ))}
          </menu>
        </nav>
      </div>

      {Object.values(isModal).some(Boolean) && (
        <div
          id="modal-overlay"
          className="fixed inset-0 flex items-center justify-center z-20"
        >
          <div className="absolute inset-0" />
          <article className="relative">{activeModal}</article>
        </div>
      )}
    </aside>
  );
};

export default ChattingSidebar;
