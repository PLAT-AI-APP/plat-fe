import { Close, Persona, Storage } from "@/icons";
import Note from "@/icons/Note";
import { useModalStore } from "@/store/useModalStore";
import React from "react";

interface ChattingSidebarProps {
  toggleIsSidebar: () => void;
}

const MENU_LIST = [
  { id: "STORAGE", title: "장기기억", icon: Storage },
  { id: "PERSONA", title: "페르소나", icon: Persona },
  { id: "USER_NOTE", title: "유저노트", icon: Note },
] as const;

const ChattingSidebar = ({ toggleIsSidebar }: ChattingSidebarProps) => {
  const { openModal } = useModalStore();

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
            {MENU_LIST.map(({ id, icon: Icon, title }) => (
              <li
                key={title}
                onClick={() => openModal(id)}
                className="w-50 p-2 flex items-center text-sm justify-between list-none cursor-pointer hover:bg-btn-hover rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-font-2" />
                  <span className="hover:text-font-2">{title}</span>
                </div>
                {/* {text && <span className="text-font-2">{text}</span>} */}
              </li>
            ))}
          </menu>
        </nav>
      </div>
    </aside>
  );
};

export default ChattingSidebar;
