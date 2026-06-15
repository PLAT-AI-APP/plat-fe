import React from "react";
import { useTranslations } from "next-intl";
import { Close, Persona, Storage } from "@/icons";
import Note from "@/icons/Note";
import { useModalStore } from "@/store/useModalStore";

interface ChattingSidebarProps {
  toggleIsSidebar: () => void;
}

const ChattingSidebar = ({ toggleIsSidebar }: ChattingSidebarProps) => {
  const t = useTranslations("chatRoom");
  const { openModal } = useModalStore();

  // 채팅방 설정 메뉴는 id는 그대로 유지하고, 화면 라벨만 locale에 맞춰 바꿉니다.
  const menuList = [
    { id: "STORAGE", title: t("sidebar.memory"), icon: Storage },
    { id: "PERSONA", title: t("sidebar.persona"), icon: Persona },
    { id: "USER_NOTE", title: t("sidebar.userNote"), icon: Note },
  ] as const;

  return (
    <aside className="fixed top-0 right-0 z-20 flex h-screen w-screen justify-end bg-black/50 font-medium">
      <div id="sidebar-container" className="h-screen w-fit bg-bg-dark p-5">
        <header className="flex justify-end pb-6">
          <button
            onClick={toggleIsSidebar}
            className="flex h-6 w-6 items-center justify-center rounded-lg p-1 hover:bg-btn-hover"
          >
            <Close className="h-3.5 w-3.5" />
          </button>
        </header>

        <nav className="body-4">
          <h2 className="pb-3 text-font-2">{t("sidebar.title")}</h2>
          <menu className="flex flex-col gap-2">
            {menuList.map(({ id, icon: Icon, title }) => (
              <li
                key={title}
                onClick={() => openModal(id)}
                className="flex w-50 list-none items-center justify-between rounded-lg p-2 hover:bg-btn-hover"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-6 w-6 text-font-2" />
                  <span className="hover:text-font-2">{title}</span>
                </div>
              </li>
            ))}
          </menu>
        </nav>
      </div>
    </aside>
  );
};

export default ChattingSidebar;
